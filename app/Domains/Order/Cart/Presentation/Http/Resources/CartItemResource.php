<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'cart_item_id' => $this->resource['cart_item_id'],
            'variant_id' => $this->resource['variant_id'],
            'product_id' => $this->resource['product_id'],
            'store_id' => $this->resource['store_id'],
            'store_name' => $this->resource['store_name'],
            'product_name' => $this->resource['product_name'],
            'name' => $this->resource['name'],
            'sku' => $this->resource['sku'],
            'price' => $this->resource['price'],
            'stock' => $this->resource['stock'],
            'weight' => $this->resource['weight'],
            'thumbnail' => $this->resource['thumbnail'],
            'quantity' => $this->resource['quantity'],
            'subtotal' => $this->resource['subtotal'],
            'attributes' => $this->resource['attributes'] ?? [],
        ];
    }
}
