<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class SwitchRoleUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private IssueApiTokenUseCase $issueToken,
        private BuildAuthPayloadUseCase $payload,
    ) {}

    public function execute(User $user, string $targetRole, ?string $deviceName): array
    {
        if (! (bool) $user->is_active || $user->isBanned()) {
            throw new AccessDeniedHttpException('Akun tidak memiliki akses aktif.');
        }

        $targetRole = strtolower(trim($targetRole));
        $user->loadMissing('roles:id,name');

        if (! $user->hasRole($targetRole)) {
            throw new AccessDeniedHttpException("Anda tidak memiliki hak akses sebagai {$targetRole}.");
        }

        if ($targetRole === 'seller' && ! $this->userRepository->hasSellerAccess($user)) {
            throw new AccessDeniedHttpException('Akses seller belum aktif atau toko belum tersedia.');
        }

        $newToken = $this->issueToken->execute($user, $deviceName, $targetRole);

        return [
            ...$this->payload->execute($user, $targetRole),
            'message' => "Berhasil beralih ke akses {$targetRole}.",
            'token_type' => 'Bearer',
            'access_token' => $newToken,
            'api_token' => $newToken,
        ];
    }
}
