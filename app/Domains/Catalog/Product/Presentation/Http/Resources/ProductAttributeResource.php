<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductAttributeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $attribute = $this->resource;

        return [
            'id' => $attribute->id(),
            'name' => $attribute->name(),
            'slug' => $attribute->slug(),
            'type' => $attribute->type(),
        ];
    }
}
