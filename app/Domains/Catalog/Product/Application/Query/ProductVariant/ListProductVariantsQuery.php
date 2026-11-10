<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\ProductVariant;

use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;

final class ListProductVariantsQuery
{
    public function __construct(
        private readonly ProductVariantRepositoryInterface $repository
    ) {}

    public function execute(int $productId, array $filters = [])
    {
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $this->repository->paginate($productId, $perPage);
    }
}
