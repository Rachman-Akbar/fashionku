<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariantValue;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantValueModel;

final class ProductVariantValueMapper
{
    public static function toEntity(ProductVariantValueModel $model): ProductVariantValue
    {
        $attribute = $model->relationLoaded('attribute') ? $model->attribute : null;

        return new ProductVariantValue(
            id: (int) $model->id,
            variantId: (int) $model->variant_id,
            attributeId: (int) $model->attribute_id,
            value: (string) $model->value,
            attributeName: $attribute?->name,
            attributeSlug: $attribute?->slug,
            attributeType: $attribute?->type
        );
    }
}
