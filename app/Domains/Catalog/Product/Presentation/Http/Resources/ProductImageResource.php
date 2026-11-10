<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->resource;

        return [
            'id' => $image->id(),
            'product_id' => $image->productId(),
            'url' => $image->url(),
            'alt_text' => $image->altText(),
            'is_primary' => $image->isPrimary(),
            'sort_order' => $image->sortOrder(),
        ];
    }
}
