<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\UseCases;

use App\Domains\Seller\Stores\Application\DTOs\StoreData;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;
use App\Domains\Shared\Moderation\Application\Services\ModerationChatService;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class UpdateStoreUseCase
{
    public function __construct(
        private StoreRepositoryInterface $storeRepository,
        private ModerationChatService $moderationChat
    ) {}

    public function execute(int $storeId, string $currentUserId, string $role, array $data): StoreData
    {
        $store = $this->storeRepository->findById($storeId);

        if (! $store) {
            throw new NotFoundHttpException("Toko dengan ID [{$storeId}] tidak ditemukan.");
        }

        if ($role !== 'admin' && $role !== 'seller') {
            throw new AccessDeniedHttpException('Anda tidak memiliki akses untuk mengubah toko ini.');
        }

        $store->updateDetails(
            name: $data['store_name'] ?? $store->name(),
            slug: $store->slug(),
            description: $data['description'] ?? $store->description(),
            shortDescription: $data['short_description'] ?? $store->shortDescription(),
            phone: $data['phone'] ?? $store->phone(),
            email: $data['email'] ?? $store->email(),
            city: $data['city'] ?? $store->city(),
            province: $data['province'] ?? $store->province(),
            address: $data['address'] ?? $store->address(),
            logo: $data['logo'] ?? $store->logo(),
            bannerUrl: $data['banner_url'] ?? $store->bannerUrl(),
            isActive: array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $store->isActive()
        );

        $previousStatus = $store->status();

        if ($role === 'admin' && isset($data['status'])) {
            $store->changeStatus((string) $data['status']);
        }

        $storeData = StoreData::fromEntity($this->storeRepository->update($store, $data['detail'] ?? null));

        if ($role === 'admin' && isset($data['status']) && $data['status'] !== $previousStatus && in_array($data['status'], ['approved', 'suspended'], true)) {
            $this->moderationChat->notifyStoreStatus(
                (int) $storeData->id,
                (string) $data['status'],
                $currentUserId,
                is_string($data['message'] ?? null) ? $data['message'] : null
            );
        }

        return $storeData;
    }
}
