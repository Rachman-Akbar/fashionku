<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\UseCases;

use App\Domains\Identity\Auth\Application\DTOs\RegisterSellerDTO;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Seller\Stores\Application\DTOs\StoreData;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;
use App\Domains\Seller\Stores\Domain\Services\FashionStoreResolver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Single-store marketplace: hanya satu toko yang boleh ada.
 * Jika toko sudah ada, user diberi akses seller ke toko tersebut (tanpa membuat toko baru).
 */
final readonly class CreateStoreUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private StoreRepositoryInterface $storeRepository,
    ) {}

    public function execute(string $userId, array $data, ?string $deviceName = null): StoreData
    {
        $dto = new RegisterSellerDTO(
            storeName: $data['store_name'],
            slug: Str::slug($data['store_name']),
            description: $data['description'] ?? null,
            shortDescription: $data['short_description'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
            city: $data['city'] ?? null,
            province: $data['province'] ?? null,
            address: $data['address'] ?? null,
            logo: $data['logo'] ?? null,
            bannerUrl: $data['banner_url'] ?? null,
            detail: $data['detail'] ?? []
        );

        $storeId = DB::transaction(function () use ($userId, $dto): int {
            $user = $this->userRepository->findById($userId) ?? throw new RuntimeException('User tidak ditemukan.');

            $existing = FashionStoreResolver::resolve();
            if ($existing !== null) {
                $this->userRepository->assignRoleByName($user, 'seller');

                return (int) $existing->id;
            }

            $newId = $this->userRepository->registerStore($userId, $dto);
            DB::table('stores')->where('id', $newId)->update([
                'status' => 'approved',
                'updated_at' => now(),
            ]);
            $this->userRepository->assignRoleByName($user, 'seller');

            return (int) $newId;
        });

        $store = $this->storeRepository->findById($storeId);
        if (! $store) {
            throw new RuntimeException('Toko gagal dimuat.');
        }

        return StoreData::fromEntity($store);
    }
}
