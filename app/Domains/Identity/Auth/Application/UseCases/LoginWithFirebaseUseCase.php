<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

final class LoginWithFirebaseUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly BuildAuthPayloadUseCase $payload,
        private readonly IssueApiTokenUseCase $issueToken,
    ) {}

    public function execute(
        array $firebaseUser,
        ?string $deviceName = null,
        string $requestedRole = 'buyer'
    ): array {
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

        $user = $this->userRepository->syncFromFirebase($firebaseUser);
        $activeRole = $this->resolveRole($user, $requestedRole);
        $token = $this->issueToken->execute(
            $user,
            $deviceName ?? 'marketplace-web',
            $activeRole
        );

        return [
            ...$this->payload->execute($user, $activeRole),
            'token_type' => 'Bearer',
            'api_token' => $token,
            'access_token' => $token,
        ];
    }

    private function resolveRole(User $user, string $requestedRole): string
    {
        $role = strtolower(trim($requestedRole)) ?: 'buyer';
        $user->loadMissing('roles:id,name');

        if (! $user->hasRole($role)) {
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
