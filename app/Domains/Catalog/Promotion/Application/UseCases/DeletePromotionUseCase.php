<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\UseCases;

use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionRepositoryInterface;
use InvalidArgumentException;

final class DeletePromotionUseCase
{
    public function __construct(private PromotionRepositoryInterface $repository) {}

    public function execute(int $id, ?int $sellerStoreId = null): bool
    {
        $promotion = $this->repository->findById($id, true);

        if (! $promotion) {
            throw new InvalidArgumentException('Promosi tidak ditemukan.');
        }

        if ($sellerStoreId !== null && $promotion->storeId !== $sellerStoreId) {
            throw new InvalidArgumentException('Anda tidak memiliki akses ke promosi ini.');
        }

        return $this->repository->delete($id);
    }
}
