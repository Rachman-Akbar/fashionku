<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductVariant;

use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;

final class DeleteProductVariantUseCase
{
    public function __construct(
        private readonly ProductVariantRepositoryInterface $variants
    ) {}

    public function execute(int|string $id): void
    {
        $variant = $this->variants->findById((int) $id);

        abort_if(! $variant, 404, 'Product variant not found.');

        $this->variants->delete((int) $id);
    }
}
