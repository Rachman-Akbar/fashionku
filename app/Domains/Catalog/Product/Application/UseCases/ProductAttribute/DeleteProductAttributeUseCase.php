<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductAttribute;

use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;

final class DeleteProductAttributeUseCase
{
    public function __construct(
        private readonly ProductAttributeRepositoryInterface $attributes
    ) {}

    public function execute(int|string $id): void
    {
        $attribute = $this->attributes->findById((int) $id);

        abort_if(! $attribute, 404, 'Product attribute not found.');

        $this->attributes->delete((int) $id);
    }
}
