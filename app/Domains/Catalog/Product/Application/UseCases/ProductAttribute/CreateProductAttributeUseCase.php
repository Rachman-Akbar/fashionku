<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductAttribute;

use App\Domains\Catalog\Product\Domain\Entities\ProductAttribute;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;
use Illuminate\Support\Str;

final class CreateProductAttributeUseCase
{
    public function __construct(
        private readonly ProductAttributeRepositoryInterface $attributes
    ) {}

    public function execute(array $data): ProductAttribute
    {
        return $this->attributes->save(new ProductAttribute(
            id: null,
            name: (string) $data['name'],
            slug: (string) ($data['slug'] ?? Str::slug((string) $data['name'])),
            type: (string) ($data['type'] ?? 'select')
        ));
    }
}
