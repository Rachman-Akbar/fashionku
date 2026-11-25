<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories\EloquentUserDeviceRepository;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class AccountDeletionUseCase
{
    public function __construct(
        private OtpSecurityEngine $otpEngine,
        private UserRepositoryInterface $userRepository,
        private EloquentUserDeviceRepository $deviceRepository,
    ) {}

    public function requestDeletionOtp(User $user, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        return $this->deleteAccount($user, null, $ipAddress, $userAgent);
    }

    public function deleteAccount(User $user, ?string $code = null, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak aktif.'],
            ]);
        }

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
        ])->save();
    }
}