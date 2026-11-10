<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Resources;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ProductVariant $variant */
        $variant = $this->resource;
        $internal = self::isInternalRequest($request);
        $available = $variant->availableStock();

        return [
            'id' => $variant->id(),
            'product_id' => $variant->productId(),

            // TAMBAHAN: Menyertakan store_id sesuai arsitektur database baru
            'store_id' => $variant->storeId(),

            'sku' => $variant->sku(),
            'name' => $variant->name(),
            'price' => $variant->price(),
            'price_original' => $variant->priceOriginal(),
            'price_sale' => $variant->priceSale(),
            'stock' => $internal ? $variant->stock() : $available,
            'available_stock' => $available,
            'allows_preorder' => (bool) $variant->allowsPreorder(),
            'max_order_qty' => $variant->maxOrderQty(),
            'min_stock' => $variant->minStock(),
            'po_stock' => $internal ? $variant->poStock() : null,
            'stock_reserved' => $internal ? $variant->stockReserved() : null,
            'stock_booked' => $internal ? $variant->stockBooked() : null,
            'stock_preorder' => $internal ? $variant->stockPreorder() : null,
            'total_stock' => $internal ? $variant->totalStock() : $available,
            'is_default' => $variant->isDefault(),
            'values' => ProductVariantValueResource::collection($variant->values()),
            'created_at' => $variant->createdAt(),
            'updated_at' => $variant->updatedAt(),
        ];
    }

    public static function isInternalRequest(Request $request): bool
    {
        $user = $request->user();

        if ($user === null) {
            return false;
        }

        $abilities = $user->currentAccessToken()?->abilities ?? [];

        return (bool) array_filter(
            $abilities,
            fn (string $ability): bool => in_array($ability, ['active-role:seller', 'active-role:admin'], true),
        );
    }
}
