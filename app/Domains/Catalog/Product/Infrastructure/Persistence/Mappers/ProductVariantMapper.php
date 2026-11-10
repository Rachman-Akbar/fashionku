<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;

final class ProductVariantMapper
{
    public static function toEntity(ProductVariantModel $model): ProductVariant
    {
        $values = $model->relationLoaded('values')
            ? $model->values->map(fn ($item) => ProductVariantValueMapper::toEntity($item))->all()
            : [];

        return new ProductVariant(
            id: (int) $model->id,
            productId: (int) $model->product_id,
            storeId: (int) $model->store_id, // Ditambahkan pasca perubahan DB
            sku: (string) $model->sku,
            name: (string) $model->name,
            price: (float) $model->price,
            stock: (int) $model->stock,
            poStock: (int) $model->po_stock,
            stockReserved: (int) $model->stock_reserved,
            stockBooked: (int) $model->stock_booked,
            stockPreorder: (int) $model->stock_preorder,
            maxOrderQty: (int) $model->max_order_qty,
            minStock: (int) $model->min_stock,
            allowsPreorder: $model->product ? (bool) $model->product->allows_preorder : null,
            isDefault: (bool) $model->is_default,
            priceOriginal: isset($model->price_original) ? (float) $model->price_original : null,
            priceSale: isset($model->price_sale) ? (float) $model->price_sale : null,
            values: $values,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString()
        );
    }
}
