<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'items' => CartItemResource::collection($this->resource['items'] ?? []),
            'total_items' => $this->resource['total_items'] ?? 0,
            'total_price' => $this->resource['total_price'] ?? 0,
        ];
    }
}
