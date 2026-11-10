<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Product\Domain\Entities\ProductImage;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductImageModel;

final class ProductImageMapper
{
    public static function toEntity(ProductImageModel $model): ProductImage
    {
        return new ProductImage(
            id: (int) $model->id,
            productId: (int) $model->product_id,
            url: (string) $model->url,
            altText: $model->alt_text,
            isPrimary: (bool) $model->is_primary,
            sortOrder: (int) $model->sort_order,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString()
        );
    }
}
