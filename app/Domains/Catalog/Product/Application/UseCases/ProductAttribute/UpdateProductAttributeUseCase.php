<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductAttribute;

use App\Domains\Catalog\Product\Domain\Entities\ProductAttribute;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;

final class UpdateProductAttributeUseCase
{
    public function __construct(
        private readonly ProductAttributeRepositoryInterface $attributes
    ) {}

    public function execute(int|string $id, array $data): ProductAttribute
    {
        $current = $this->attributes->findById((int) $id);

        abort_if(! $current, 404, 'Product attribute not found.');

        return $this->attributes->save(new ProductAttribute(
            id: $current->id(),
            name: (string) ($data['name'] ?? $current->name()),
            slug: (string) ($data['slug'] ?? $current->slug()),
            type: (string) ($data['type'] ?? $current->type())
        ));
    }
}
