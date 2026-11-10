<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class LoginUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private BuildAuthPayloadUseCase $payload,
        private IssueApiTokenUseCase $issueToken,
    ) {}

    public function execute(
        string $email,
        string $password,
        ?string $deviceName,
        string $requestedRole = 'buyer'
    ): array {
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
        $token = $this->issueToken->execute($user, $deviceName, $activeRole);

        return [
            ...$this->payload->execute($user, $activeRole),
            'token_type' => 'Bearer',
            'access_token' => $token,
            'api_token' => $token,
        ];
    }

    private function resolveRole(User $user, string $requestedRole): string
    {
        $role = strtolower(trim($requestedRole)) ?: 'buyer';
        $user->loadMissing('roles:id,name');

        if (! $user->hasRole($role)) {
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
