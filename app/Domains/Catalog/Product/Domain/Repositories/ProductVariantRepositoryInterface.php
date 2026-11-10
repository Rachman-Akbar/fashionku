<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;

interface ProductVariantRepositoryInterface
{
    public function paginate(int $productId, int $perPage = 15);

    public function findById(int $id): ?ProductVariant;

    public function save(ProductVariant $variant): ProductVariant;

    public function replaceValues(int $variantId, array $values): void;

    public function delete(int $id): void;
}
