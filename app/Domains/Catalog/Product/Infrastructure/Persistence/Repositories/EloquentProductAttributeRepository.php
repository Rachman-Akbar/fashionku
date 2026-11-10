<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductAttribute;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers\ProductAttributeMapper;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductAttributeModel;

final class EloquentProductAttributeRepository implements ProductAttributeRepositoryInterface
{
    public function paginate(int $perPage = 15)
    {
        return ProductAttributeModel::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->through(fn ($item) => ProductAttributeMapper::toEntity($item));
    }

    public function findById(int $id): ?ProductAttribute
    {
        $model = ProductAttributeModel::query()->find($id);

        return $model ? ProductAttributeMapper::toEntity($model) : null;
    }

    public function findBySlug(string $slug): ?ProductAttribute
    {
        $model = ProductAttributeModel::query()
            ->where('slug', $slug)
            ->first();

        return $model ? ProductAttributeMapper::toEntity($model) : null;
    }

    public function save(ProductAttribute $attribute): ProductAttribute
    {
        $model = $attribute->id()
            ? ProductAttributeModel::query()->find($attribute->id())
            : new ProductAttributeModel;

        if (! $model) {
            $model = new ProductAttributeModel;
        }

        $model->name = $attribute->name();
        $model->slug = $attribute->slug();
        $model->type = $attribute->type();
        $model->save();

        return ProductAttributeMapper::toEntity($model);
    }

    public function delete(int $id): void
    {
        ProductAttributeModel::query()->where('id', $id)->delete();
    }
}
