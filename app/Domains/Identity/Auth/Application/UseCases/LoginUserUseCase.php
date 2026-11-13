<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class LoginUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly BuildAuthPayloadUseCase $payload,
        private readonly IssueApiTokenUseCase $issueToken,
        private readonly OtpSecurityEngine $otpEngine,
    ) {}

    /**
     * Step 1: validate credentials and issue OTP challenge (no session token).
     */
    public function initiate(
        string $email,
        string $password,
        ?string $deviceName,
        string $requestedRole = 'buyer',
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $email = mb_strtolower(trim($email));
        $user = $this->userRepository->findByEmail($email);

        if (! $user || ! Hash::check($password, (string) $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if (method_exists($user, 'trashed') && $user->trashed()) {
            throw ValidationException::withMessages([
                'email' => ['Akun tidak ditemukan.'],
            ]);
        }

        $activeRole = $this->resolveRole($user, $requestedRole);
        $challengeId = (string) Str::uuid();

        $code = $this->otpEngine->issue(
            email: $user->email,
            purpose: OtpPurpose::LOGIN->value,
            userId: (string) $user->id,
            phone: null,
            challengeId: $challengeId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'login_type' => 'password',
                'role' => $activeRole,
                'device_name' => $deviceName ?: 'marketplace-web',
            ],
        );

        $this->sendOtpEmail($user->email, $code, $challengeId);

        return [
            'otp_required' => true,
            'challenge_id' => $challengeId,
            'email' => $user->email,
            'purpose' => OtpPurpose::LOGIN->value,
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'message' => 'Kode OTP telah dikirim ke email Anda.',
        ];
    }

    /**
     * Step 2: verify OTP and issue session token.
     */
    public function complete(
        string $challengeId,
        string $code,
        ?string $deviceName = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $otp = OtpChallenge::query()
            ->where('challenge_id', $challengeId)
            ->where('purpose', OtpPurpose::LOGIN->value)
            ->whereNull('consumed_at')
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        $email = (string) $otp->email;
        $this->otpEngine->verifyAndConsume(
            email: $email,
            purpose: OtpPurpose::LOGIN->value,
            code: $code,
            challengeId: $challengeId,
            userId: $otp->user_id ? (string) $otp->user_id : null,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        $user = $otp->user_id
            ? $this->userRepository->findById((string) $otp->user_id)
            : $this->userRepository->findByEmail($email);

        if (! $user || (method_exists($user, 'trashed') && $user->trashed())) {
            throw ValidationException::withMessages([
                'email' => ['Akun tidak ditemukan.'],
            ]);
        }

        $metadata = is_array($otp->metadata) ? $otp->metadata : (json_decode((string) $otp->metadata, true) ?: []);
        $requestedRole = (string) ($metadata['role'] ?? 'buyer');
        $resolvedDevice = $deviceName ?: (string) ($metadata['device_name'] ?? 'marketplace-web');
        $activeRole = $this->resolveRole($user, $requestedRole);

        // Single active session: login yang berhasil (setelah OTP) mencabut
        // seluruh sesi/perangkat lama. Perangkat baru otomatis force logout.
        $token = $this->issueToken->execute($user, $resolvedDevice, $activeRole, true);

        return [
            ...$this->payload->execute($user, $activeRole),
            'token_type' => 'Bearer',
            'access_token' => $token,
            'api_token' => $token,
        ];
    }

    public function resend(
        string $challengeId,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $otp = OtpChallenge::query()
            ->where('challenge_id', $challengeId)
            ->where('purpose', OtpPurpose::LOGIN->value)
            ->whereNull('consumed_at')
            ->orderByDesc('created_at')
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'challenge_id' => ['Sesi login tidak ditemukan atau sudah kedaluwarsa.'],
            ]);
        }

        $metadata = is_array($otp->metadata) ? $otp->metadata : (json_decode((string) $otp->metadata, true) ?: []);

        $code = $this->otpEngine->resend(
            email: (string) $otp->email,
            purpose: OtpPurpose::LOGIN->value,
            userId: $otp->user_id ? (string) $otp->user_id : null,
            phone: $otp->phone,
            challengeId: $challengeId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: $metadata,
        );

        $this->sendOtpEmail((string) $otp->email, $code, $challengeId);

        return [
            'otp_required' => true,
            'challenge_id' => $challengeId,
            'email' => (string) $otp->email,
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'message' => 'Kode OTP baru telah dikirim ke email Anda.',
        ];
    }

    private function sendOtpEmail(string $email, string $code, ?string $challengeId = null): void
    {
        try {
            \Illuminate\Support\Facades\Mail::to($email)
                ->send(new \App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail(
                    $code,
                    $this->otpEngine->ttlMinutes(),
                ));
        } catch (\Throwable $throwable) {
            \Illuminate\Support\Facades\Log::error('Gagal mengirim OTP login.', [
                'email' => $email,
                'exception' => $throwable,
            ]);

            // Invalidate the issued OTP so it cannot be guessed when email
            // delivery fails. Sebelumnya challenge id kosong sehingga OTP
            // tetap aktif (bug keamanan).
            if ($challengeId !== null && $challengeId !== '') {
                try {
                    $this->otpEngine->invalidateByChallengeId($challengeId, OtpPurpose::LOGIN->value);
                } catch (\Throwable) {
                }
            }

            throw ValidationException::withMessages([
                'email' => ['Gagal mengirim kode OTP. Periksa konfigurasi email (Mailtrap/SMTP) lalu coba lagi.'],
            ]);
        }
    }

    private function resolveRole(User $user, string $requestedRole): string
    {
        $role = strtolower(trim($requestedRole)) ?: 'buyer';
        $user->loadMissing('roles:id,name');

        // Admin adalah superset seller pada marketplace single-store.
        $roleAllowed = $user->hasRole($role)
            || ($role === 'seller' && $user->hasRole('admin'));

        if (! $roleAllowed) {
            throw ValidationException::withMessages([
                'role' => ["Akun ini tidak memiliki akses {$role}."],
            ]);
        }

        if ($role === 'seller' && ! $this->userRepository->hasSellerAccess($user)) {
            throw ValidationException::withMessages([
                'role' => ['Akses seller belum aktif atau toko belum tersedia.'],
            ]);
        }

        return $role;
    }
}
