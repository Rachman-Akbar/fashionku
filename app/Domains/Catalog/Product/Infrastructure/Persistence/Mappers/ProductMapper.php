<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;

final class ProductMapper
{
    public static function toEntity(ProductModel $model): Product
    {
        $categoryIds = $model->relationLoaded('categories')
            ? $model->categories->pluck('id')->map(fn ($id) => (int) $id)->all()
            : [];

        $attributeValues = $model->relationLoaded('attributeValues')
            ? $model->attributeValues->map(fn ($item) => ProductAttributeValueMapper::toEntity($item))->all()
            : [];

        $variants = $model->relationLoaded('variants')
            ? $model->variants->map(fn ($item) => ProductVariantMapper::toEntity($item))->all()
            : [];

        $images = $model->relationLoaded('images')
            ? $model->images->map(fn ($item) => ProductImageMapper::toEntity($item))->all()
            : [];

        return new Product(
            id: (int) $model->id,
            primaryCategoryId: $model->primary_category_id ? (int) $model->primary_category_id : null,
            name: (string) $model->name,
            slug: (string) $model->slug,
            description: $model->description,
            brand: $model->brand,
            thumbnail: $model->thumbnail,
            isActive: (bool) $model->is_active,
            categoryIds: $categoryIds,
            attributeValues: $attributeValues,
            variants: $variants,
            images: $images,
            averageRating: round((float) ($model->reviews_avg_rating ?? 0), 2),
            reviewCount: (int) ($model->reviews_count ?? 0),
            soldCount: (int) ($model->sold_count ?? 0),
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
            code: $model->code !== null ? (string) $model->code : null,
            createdBy: $model->created_by !== null ? (string) $model->created_by : null,
            updatedBy: $model->updated_by !== null ? (string) $model->updated_by : null
        );
    }

    public static function toModel(Product $product): ProductModel
    {
        $model = new ProductModel;

        $model->primary_category_id = $product->primaryCategoryId();
        $model->primary_category_id = $product->primaryCategoryId();
        $model->name = $product->name();
        $model->slug = $product->slug();
        $model->description = $product->description();
        $model->brand = $product->brand();
        $model->thumbnail = $product->thumbnail();
        $model->is_active = $product->isActive();

        return $model;
    }
}
