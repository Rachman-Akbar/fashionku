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

        $store = $model->relationLoaded('store') && $model->store
            ? [
                'id' => (int) $model->store->id,
                'name' => (string) $model->store->name,
                'slug' => (string) $model->store->slug,
                'logo' => $model->store->logo,
                'city' => $model->store->city,
                'province' => $model->store->province,
                'status' => (string) $model->store->status,
                'is_active' => (bool) $model->store->is_active,
                'store_type' => (string) ($model->store->store_type ?? 'regular'),
            ]
            : [];

        return new Product(
            id: (int) $model->id,
            storeId: (int) $model->store_id,
            primaryCategoryId: $model->primary_category_id ? (int) $model->primary_category_id : null,
            name: (string) $model->name,
            slug: (string) $model->slug,
            description: $model->description,
            brand: $model->brand,
            thumbnail: $model->thumbnail,
            status: (string) $model->status,
            isActive: (bool) $model->is_active,
            categoryIds: $categoryIds,
            attributeValues: $attributeValues,
            variants: $variants,
            images: $images,
            store: $store,
            averageRating: round((float) ($model->reviews_avg_rating ?? 0), 2),
            reviewCount: (int) ($model->reviews_count ?? 0),
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString()
        );
    }

    public static function toModel(Product $product): ProductModel
    {
        $model = new ProductModel;

        $model->store_id = $product->storeId();
        $model->primary_category_id = $product->primaryCategoryId();
        $model->name = $product->name();
        $model->slug = $product->slug();
        $model->description = $product->description();
        $model->brand = $product->brand();
        $model->thumbnail = $product->thumbnail();
        $model->status = $product->status();
        $model->is_active = $product->isActive();

        return $model;
    }
}
