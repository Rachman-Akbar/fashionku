<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductAttribute;

interface ProductAttributeRepositoryInterface
{
    public function paginate(int $perPage = 15);

    public function findById(int $id): ?ProductAttribute;

    public function findBySlug(string $slug): ?ProductAttribute;

    public function save(ProductAttribute $attribute): ProductAttribute;

    public function delete(int $id): void;
}
