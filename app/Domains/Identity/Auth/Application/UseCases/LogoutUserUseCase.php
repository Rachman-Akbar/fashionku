<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Cache;

final class LogoutUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(User $user, string $type = 'current'): int
    {
        $deletedCount = 1;

        if ($type === 'current') {
            $this->userRepository->deleteCurrentToken($user);
        } elseif ($type === 'other') {
            $deletedCount = $this->userRepository->logoutOtherDevices($user);
        } elseif ($type === 'all') {
            $deletedCount = $user->tokens()->delete();
        }

        Cache::forget("auth_payload_{$user->id}");

        return (int) $deletedCount;
    }
}
