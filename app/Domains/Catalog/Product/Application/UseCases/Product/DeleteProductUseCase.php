<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\Product;

use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;

final class DeleteProductUseCase
{
    public function __construct(
        private readonly ProductRepositoryInterface $products
    ) {}

    public function execute(int|string $id): void
    {
        $deleted = $this->products->delete((int) $id);

        abort_if(! $deleted, 404, 'Product not found.');
    }
}
