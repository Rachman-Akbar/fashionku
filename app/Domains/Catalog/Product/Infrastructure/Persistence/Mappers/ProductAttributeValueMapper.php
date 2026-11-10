<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Product\Domain\Entities\ProductAttributeValue;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductAttributeValueModel;

final class ProductAttributeValueMapper
{
    public static function toEntity(ProductAttributeValueModel $model): ProductAttributeValue
    {
        $attribute = $model->relationLoaded('attribute') ? $model->attribute : null;

        return new ProductAttributeValue(
            id: (int) $model->id,
            productId: (int) $model->product_id,
            attributeId: (int) $model->attribute_id,
            value: (string) $model->value,
            attributeName: $attribute?->name,
            attributeSlug: $attribute?->slug,
            attributeType: $attribute?->type
        );
    }
}
