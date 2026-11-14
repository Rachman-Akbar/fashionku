<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\UseCases;

use App\Domains\Catalog\Promotion\Application\Dtos\PromotionData;
use App\Domains\Catalog\Promotion\Application\Services\PromotionPaymentService;
use App\Domains\Catalog\Promotion\Domain\Entities\Promotion;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionRepositoryInterface;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class UpsertPromotionUseCase
{
    public function __construct(
        private PromotionRepositoryInterface $repository,
        private PromotionPaymentService $paymentService
    ) {}

    public function execute(PromotionData $dto, ?int $id = null): PromotionData
    {
        $existing = $id !== null ? $this->repository->findById($id, true) : null;

        if ($id !== null && ! $existing) {
            throw new InvalidArgumentException('Promosi tidak ditemukan.');
        }

        if ($this->repository->nameExists($dto->name, $id)) {
            throw new InvalidArgumentException("Nama promosi '{$dto->name}' sudah digunakan.");
        }

        if ($dto->promotionPaymentId) {
            $this->paymentService->approvedForPromotion($dto->promotionPaymentId, $id);
        }

        $this->validateTarget($dto);

        $entity = new Promotion(
            id: $id,
            promotionPaymentId: $dto->promotionPaymentId ?? $existing?->promotionPaymentId,
            name: $dto->name,
            imageUrl: $dto->imageUrl,
            mobileImageUrl: $dto->mobileImageUrl,
            clickAction: $dto->clickAction,
            targetId: in_array($dto->clickAction, ['product', 'category'], true) ? $dto->targetId : null,
            targetUrl: $dto->clickAction === 'url' ? $dto->targetUrl : null,
            sortOrder: $dto->sortOrder,
            isActive: $dto->isActive,
        );

        return PromotionData::fromArray($this->repository->save($entity)->toArray());
    }

    private function validateTarget(PromotionData $dto): void
    {
        if ($dto->clickAction === 'product') {
            if (! $dto->targetId) {
                throw new InvalidArgumentException('Produk target wajib dipilih.');
            }

            $exists = DB::table('products')
                ->where('id', $dto->targetId)
                ->where('is_active', true)
                ->where('status', 'published')
                ->whereNull('deleted_at')
                ->exists();

            if (! $exists) {
                throw new InvalidArgumentException('Produk target tidak valid.');
            }
        }

        if ($dto->clickAction === 'category') {
            if (! $dto->targetId || ! DB::table('categories')
                ->where('id', $dto->targetId)
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->exists()) {
                throw new InvalidArgumentException('Kategori target tidak valid.');
            }
        }

        if ($dto->clickAction === 'url' && ! $dto->targetUrl) {
            throw new InvalidArgumentException('URL target wajib diisi.');
        }
    }
}
