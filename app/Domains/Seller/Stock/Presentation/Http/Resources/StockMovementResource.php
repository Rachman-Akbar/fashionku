<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class StockMovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'store_name' => $this->store?->name,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'variant_id' => $this->variant_id,
            'variant_name' => $this->variant?->name,
            'sku' => $this->variant?->sku,
            'current_stock' => $this->variant?->stock,
            'current_available' => $this->variant
                ? (int) $this->variant->stock - (int) $this->variant->stock_reserved - (int) $this->variant->stock_booked
                : null,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'type' => $this->type,
            'quantity_delta' => $this->quantity_delta,
            'balance_after' => $this->balance_after,
            'stock_dimension' => $this->stock_dimension,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'notes' => $this->notes,
            'occurred_at' => $this->occurred_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
