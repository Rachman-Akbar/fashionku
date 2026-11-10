<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\Product;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;

final class GetProductBySlugQuery
{
    public function __construct(
        private readonly ProductRepositoryInterface $products
    ) {}

    public function execute(string $slug): ?Product
    {
        return $this->products->findBySlug($slug);
    }
}
