<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\Product;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;

final class GetProductQuery
{
    public function __construct(
        private readonly ProductRepositoryInterface $products
    ) {}

    public function execute(int $id, bool $includeInactive = false): ?Product
    {
        return $this->products->findById($id, $includeInactive);
    }
}
