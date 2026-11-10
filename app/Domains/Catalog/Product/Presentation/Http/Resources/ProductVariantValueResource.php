<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductVariantValueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $value = $this->resource;

        return [
            'id' => $value->id(),
            'variant_id' => $value->variantId(),
            'attribute_id' => $value->attributeId(),
            'attribute' => [
                'id' => $value->attributeId(),
                'name' => $value->attributeName(),
                'slug' => $value->attributeSlug(),
                'type' => $value->attributeType(),
            ],
            'value' => $value->value(),
        ];
    }
}
