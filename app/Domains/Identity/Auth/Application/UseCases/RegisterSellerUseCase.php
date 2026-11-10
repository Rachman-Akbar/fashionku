<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\DTOs\RegisterSellerDTO;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class RegisterSellerUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private IssueApiTokenUseCase $issueToken,
        private BuildAuthPayloadUseCase $payload
    ) {}

    public function execute(string $userId, array $data, ?string $deviceName): array
    {
        $user = $this->userRepository->findById($userId);
        if (! $user) {
            throw new \RuntimeException('User tidak ditemukan.');
        }

        return DB::transaction(function () use ($user, $data, $deviceName) {
            $dto = new RegisterSellerDTO(
                storeName: trim($data['store_name']),
                slug: Str::slug($data['store_name']).'-'.Str::random(5),
                phone: $data['phone'] ?? null,
                city: $data['city'] ?? null,
                province: $data['province'] ?? null,
                address: $data['address'] ?? null
            );

            $this->userRepository->registerStore($user->id, $dto);

            $this->userRepository->assignRoleByName($user, 'seller');

            $token = $this->issueToken->execute($user, $deviceName ?? 'marketplace-web', 'seller');

            return [
                ...$this->payload->execute($user->refresh(), 'seller'),
                'token_type' => 'Bearer',
                'access_token' => $token,
                'api_token' => $token,
            ];
        });
    }
}
