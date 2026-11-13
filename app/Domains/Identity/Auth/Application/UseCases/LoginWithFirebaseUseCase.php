<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

final class LoginWithFirebaseUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly BuildAuthPayloadUseCase $payload,
        private readonly IssueApiTokenUseCase $issueToken,
        private readonly OtpSecurityEngine $otpEngine,
    ) {}

    /**
     * Step 1: validate Firebase identity and issue OTP challenge (no session token).
     */
    public function initiate(
        array $firebaseUser,
        ?string $deviceName = null,
        string $requestedRole = 'buyer',
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $user = $this->resolveAndSyncUser($firebaseUser, $requestedRole);
        $activeRole = $this->resolveRole($user, $requestedRole);
        $challengeId = (string) Str::uuid();

        $code = $this->otpEngine->issue(
            email: $user->email,
            purpose: OtpPurpose::GOOGLE_LOGIN->value,
            userId: (string) $user->id,
            phone: null,
            challengeId: $challengeId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'login_type' => 'google',
                'role' => $activeRole,
                'device_name' => $deviceName ?: 'marketplace-web',
            ],
        );

        $this->sendOtpEmail($user->email, $code);

        return [
            'otp_required' => true,
            'challenge_id' => $challengeId,
            'email' => $user->email,
            'purpose' => OtpPurpose::GOOGLE_LOGIN->value,
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
            ->where('purpose', OtpPurpose::GOOGLE_LOGIN->value)
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
            purpose: OtpPurpose::GOOGLE_LOGIN->value,
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

        // Single active session: login Google yang berhasil mencabut sesi lama.
        $token = $this->issueToken->execute($user, $resolvedDevice, $activeRole, true);

        return [
            ...$this->payload->execute($user, $activeRole),
            'token_type' => 'Bearer',
            'api_token' => $token,
            'access_token' => $token,
        ];
    }

    public function resend(
        string $challengeId,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $otp = OtpChallenge::query()
            ->where('challenge_id', $challengeId)
            ->where('purpose', OtpPurpose::GOOGLE_LOGIN->value)
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
            purpose: OtpPurpose::GOOGLE_LOGIN->value,
            userId: $otp->user_id ? (string) $otp->user_id : null,
            phone: $otp->phone,
            challengeId: $challengeId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: $metadata,
        );

        $this->sendOtpEmail((string) $otp->email, $code);

        return [
            'otp_required' => true,
            'challenge_id' => $challengeId,
            'email' => (string) $otp->email,
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'message' => 'Kode OTP baru telah dikirim ke email Anda.',
        ];
    }

    private function resolveAndSyncUser(array $firebaseUser, string $requestedRole): User
    {
        $firebaseUid = $firebaseUser['uid'] ?? $firebaseUser['sub'] ?? null;
        $email = $firebaseUser['email'] ?? null;
        $claims = is_array($firebaseUser['claims'] ?? null) ? $firebaseUser['claims'] : [];
        $firebaseClaims = is_array($claims['firebase'] ?? null) ? $claims['firebase'] : [];
        $provider = strtolower((string) ($firebaseClaims['sign_in_provider'] ?? $claims['sign_in_provider'] ?? ''));

        if ($provider !== 'google.com') {
            throw ValidationException::withMessages([
                'provider' => ['Firebase hanya digunakan untuk login melalui Google.'],
            ]);
        }

        if (! is_string($firebaseUid) || trim($firebaseUid) === '') {
            throw new InvalidArgumentException('Firebase UID tidak valid atau kosong.');
        }

        if (! is_string($email) || trim($email) === '') {
            throw new InvalidArgumentException('Firebase email tidak valid atau kosong.');
        }

        return $this->userRepository->syncFromFirebase($firebaseUser);
    }

    private function sendOtpEmail(string $email, string $code): void
    {
        try {
            \Illuminate\Support\Facades\Mail::to($email)
                ->send(new \App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail(
                    $code,
                    $this->otpEngine->ttlMinutes(),
                ));
        } catch (\Throwable $throwable) {
            \Illuminate\Support\Facades\Log::error('Gagal mengirim OTP login Google.', [
                'email' => $email,
                'exception' => $throwable,
            ]);

            throw ValidationException::withMessages([
                'email' => ['Gagal mengirim kode OTP. Periksa konfigurasi email (Mailtrap/SMTP) lalu coba lagi.'],
            ]);
        }
    }

    private function resolveRole(User $user, string $requestedRole): string
    {
        $role = strtolower(trim($requestedRole)) ?: 'buyer';
        $user->loadMissing('roles:id,name');

        $roleAllowed = $user->hasRole($role)
            || ($role === 'seller' && $user->hasRole('admin'));

        if (! $roleAllowed) {
            throw ValidationException::withMessages([
                'role' => ["Akun Google ini tidak memiliki akses {$role}."],
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
