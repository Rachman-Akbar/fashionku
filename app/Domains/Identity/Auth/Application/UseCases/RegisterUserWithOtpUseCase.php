<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\RegistrationChallenge;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories\EloquentRegistrationChallengeRepository;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use RuntimeException;

final readonly class RegisterUserWithOtpUseCase
{
    public function __construct(
        private EloquentRegistrationChallengeRepository $registrationChallengeRepository,
        private OtpSecurityEngine $otpEngine,
        private UserRepositoryInterface $userRepository,
        private BuildAuthPayloadUseCase $payload,
        private IssueApiTokenUseCase $issueToken,
    ) {}

    public function initiate(
        string $name,
        string $email,
        string $password,
        ?string $phone = null,
        ?string $firebaseUid = null,
        ?string $avatar = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $email = Str::lower(trim($email));

        if ($this->userRepository->findAnyByEmail($email)) {
            throw new EmailAlreadyExistsException("User with email {$email} already exists.");
        }

        $existingChallenge = $this->registrationChallengeRepository->findActiveByEmail($email);
        if ($existingChallenge) {
            throw new RuntimeException('Sudah ada proses registrasi aktif untuk email ini. Silakan verifikasi atau tunggu hingga kedaluwarsa.');
        }

        $challengeId = (string) Str::uuid();
        $ttlSeconds = 600;

        $registrationChallenge = DB::transaction(function () use ($name, $email, $password, $phone, $firebaseUid, $avatar, $challengeId, $ttlSeconds, $ipAddress, $userAgent): RegistrationChallenge {
            $challenge = $this->registrationChallengeRepository->create([
                'id' => (string) Str::uuid(),
                'email' => $email,
                'name' => trim($name),
                'password_hash' => Hash::make($password),
                'phone' => $phone,
                'firebase_uid' => $firebaseUid,
                'avatar' => $avatar,
                'otp_challenge_id' => $challengeId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'metadata' => json_encode([
                    'initiated_at' => now()->toISOString(),
                ]),
                'expires_at' => now()->addSeconds($ttlSeconds),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $challenge;
        });

        $code = $this->otpEngine->issue(
            email: $email,
            purpose: OtpPurpose::REGISTER->value,
            userId: null,
            phone: $phone,
            challengeId: $challengeId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'challenge_id' => $challengeId,
                'registration_challenge_id' => $registrationChallenge->id,
            ],
            ttlSeconds: $ttlSeconds,
        );

        try {
            Mail::to($email)->send(new EmailVerificationMail($code, $this->otpEngine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim OTP registrasi.', [
                'email' => $email,
                'exception' => $throwable,
            ]);
            throw new RuntimeException('Gagal mengirim kode verifikasi. Silakan coba lagi.');
        }

        return [
            'challenge_id' => $challengeId,
            'registration_challenge_id' => $registrationChallenge->id,
            'email' => $email,
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'code_length' => $this->otpEngine->codeLength(),
        ];
    }

    public function verifyAndComplete(
        string $challengeId,
        string $code,
        ?string $deviceName = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $registrationChallenge = $this->registrationChallengeRepository->findById($challengeId);

        if (! $registrationChallenge) {
            throw new RuntimeException('Registrasi tidak ditemukan atau sudah kedaluwarsa.');
        }

        if ($registrationChallenge->isExpired()) {
            $this->registrationChallengeRepository->delete($challengeId);
            throw new RuntimeException('Registrasi telah kedaluwarsa. Silakan daftar ulang.');
        }

        $this->otpEngine->verifyAndConsume(
            email: $registrationChallenge->email,
            purpose: OtpPurpose::REGISTER->value,
            code: $code,
            challengeId: $registrationChallenge->otp_challenge_id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        $user = DB::transaction(function () use ($registrationChallenge): \App\Domains\Identity\User\Domain\Entities\User {
            $user = $this->userRepository->create(new CreateUserDTO(
                name: $registrationChallenge->name,
                email: $registrationChallenge->email,
                password: $registrationChallenge->password_hash,
                roleIds: [],
                isEmailVerified: true,
                isActive: true,
            ));
            $this->userRepository->assignRoleByName($user, 'buyer');

            $this->registrationChallengeRepository->delete($registrationChallenge->id);

            return $user->refresh()->load('roles:id,name,is_active');
        });

        $token = $this->issueToken->execute($user, $deviceName ?? 'marketplace-web', 'buyer');

        return [
            ...$this->payload->execute($user),
            'token_type' => 'Bearer',
            'access_token' => $token,
            'api_token' => $token,
        ];
    }

    public function resendOtp(
        string $challengeId,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): array {
        $registrationChallenge = $this->registrationChallengeRepository->findById($challengeId);

        if (! $registrationChallenge) {
            throw new RuntimeException('Registrasi tidak ditemukan atau sudah kedaluwarsa.');
        }

        if ($registrationChallenge->isExpired()) {
            $this->registrationChallengeRepository->delete($challengeId);
            throw new RuntimeException('Registrasi telah kedaluwarsa. Silakan daftar ulang.');
        }

        $code = $this->otpEngine->resend(
            email: $registrationChallenge->email,
            purpose: OtpPurpose::REGISTER->value,
            userId: null,
            phone: $registrationChallenge->phone,
            challengeId: $registrationChallenge->otp_challenge_id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'challenge_id' => $challengeId,
                'registration_challenge_id' => $registrationChallenge->id,
            ],
        );

        try {
            Mail::to($registrationChallenge->email)->send(new EmailVerificationMail($code, $this->otpEngine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim ulang OTP registrasi.', [
                'email' => $registrationChallenge->email,
                'exception' => $throwable,
            ]);
            throw new RuntimeException('Gagal mengirim kode verifikasi. Silakan coba lagi.');
        }

        return [
            'message' => 'Kode verifikasi baru telah dikirim.',
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
        ];
    }

    public function cleanupExpired(): int
    {
        return $this->registrationChallengeRepository->cleanupExpired();
    }
}