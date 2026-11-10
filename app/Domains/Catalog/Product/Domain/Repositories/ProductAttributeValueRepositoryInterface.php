<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Repositories;

interface ProductAttributeValueRepositoryInterface
{
    public function replaceForProduct(int $productId, array $values): void;
}
