<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories\EloquentUserDeviceRepository;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use RuntimeException;

final readonly class AccountDeletionUseCase
{
    public function __construct(
        private OtpSecurityEngine $otpEngine,
        private UserRepositoryInterface $userRepository,
        private EloquentUserDeviceRepository $deviceRepository,
    ) {}

    public function requestDeletionOtp(User $user, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak aktif.'],
            ]);
        }

        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                'account' => ['Akun diblokir.'],
            ]);
        }

        $code = $this->otpEngine->issue(
            email: $user->email,
            purpose: OtpPurpose::DELETE_ACCOUNT->value,
            userId: (string) $user->id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'requested_at' => now()->toISOString(),
            ],
        );

        try {
            Mail::to($user->email)->send(new EmailVerificationMail($code, $this->otpEngine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim OTP hapus akun.', [
                'user_id' => $user->id,
                'exception' => $throwable,
            ]);
            throw new RuntimeException('Gagal mengirim kode verifikasi. Silakan coba lagi.');
        }

        return [
            'message' => 'Kode verifikasi penghapusan akun telah dikirim ke email Anda.',
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'code_length' => $this->otpEngine->codeLength(),
        ];
    }

    public function deleteAccount(User $user, string $code, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak aktif.'],
            ]);
        }

        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                'account' => ['Akun diblokir.'],
            ]);
        }

        $this->otpEngine->verifyAndConsume(
            email: $user->email,
            purpose: OtpPurpose::DELETE_ACCOUNT->value,
            code: $code,
            userId: (string) $user->id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        $userId = (string) $user->id;

        DB::transaction(function () use ($userId, $user): void {
            $this->revokeAllTokens($user);
            $this->revokeAllDevices($userId);
            $this->anonymizeUserData($user);
            $this->userRepository->delete($userId);
        });

        return [
            'success' => true,
            'message' => 'Akun berhasil dihapus secara permanen.',
        ];
    }

    public function resendDeletionOtp(User $user, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak aktif.'],
            ]);
        }

        $code = $this->otpEngine->resend(
            email: $user->email,
            purpose: OtpPurpose::DELETE_ACCOUNT->value,
            userId: (string) $user->id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'resent_at' => now()->toISOString(),
            ],
        );

        try {
            Mail::to($user->email)->send(new EmailVerificationMail($code, $this->otpEngine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim ulang OTP hapus akun.', [
                'user_id' => $user->id,
                'exception' => $throwable,
            ]);
            throw new RuntimeException('Gagal mengirim kode verifikasi. Silakan coba lagi.');
        }

        return [
            'message' => 'Kode verifikasi baru telah dikirim.',
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
        ];
    }

    private function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    private function revokeAllDevices(string $userId): void
    {
        $this->deviceRepository->revokeAllForUser($userId);
    }

    private function anonymizeUserData(User $user): void
    {
        $user->forceFill([
            'email' => 'deleted_' . $user->id . '@deleted.local',
            'name' => 'Deleted User',
            'firebase_uid' => null,
            'avatar' => null,
            'is_email_verified' => false,
            'is_active' => false,
            'password' => null,
            'has_set_password' => false,
            'banned_at' => now(),
        ])->save();
    }
}