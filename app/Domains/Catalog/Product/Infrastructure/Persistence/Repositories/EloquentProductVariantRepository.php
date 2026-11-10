<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers\ProductVariantMapper;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantValueModel;

final class EloquentProductVariantRepository implements ProductVariantRepositoryInterface
{
    public function paginate(int $productId, int $perPage = 15)
    {
        return ProductVariantModel::query()
            ->with(['values.attribute', 'product'])
            ->where('product_id', $productId)
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->paginate($perPage)
            ->through(fn ($item) => ProductVariantMapper::toEntity($item));
    }

    public function findById(int $id): ?ProductVariant
    {
        $model = ProductVariantModel::query()
            ->with(['values.attribute', 'product'])
            ->find($id);

        return $model ? ProductVariantMapper::toEntity($model) : null;
    }

    public function save(ProductVariant $variant): ProductVariant
    {
        $model = $variant->id()
            ? ProductVariantModel::query()->find($variant->id())
            : new ProductVariantModel;

        if (! $model) {
            $model = new ProductVariantModel;
        }

        $model->product_id = $variant->productId();
        $model->store_id = $variant->storeId(); // Ditambahkan untuk mengamankan validasi SKU per toko
        $model->sku = $variant->sku();
        $model->name = $variant->name();
        $model->price = $variant->price();
        $model->price_original = $variant->priceOriginal();
        $model->price_sale = $variant->priceSale();
        $model->stock = $variant->stock();
        $model->po_stock = $variant->poStock();
        $model->stock_reserved = $variant->stockReserved();
        $model->stock_booked = $variant->stockBooked();
        $model->stock_preorder = $variant->stockPreorder();
        $model->max_order_qty = $variant->maxOrderQty();
        $model->min_stock = $variant->minStock();
        $model->is_default = $variant->isDefault();
        $model->save();

        if ($variant->isDefault()) {
            ProductVariantModel::query()
                ->where('product_id', $variant->productId())
                ->where('id', '!=', $model->id)
                ->update(['is_default' => false]);
        }

        $model->load(['values.attribute', 'product']);

        return ProductVariantMapper::toEntity($model);
    }

    public function replaceValues(int $variantId, array $values): void
    {
        ProductVariantValueModel::query()
            ->where('variant_id', $variantId)
            ->delete();

        $usedAttributeIds = [];

        foreach ($values as $value) {
            if (! isset($value['attribute_id']) || ! array_key_exists('value', $value)) {
                continue;
            }

            $attributeId = (int) $value['attribute_id'];
            if (in_array($attributeId, $usedAttributeIds, true)) {
                continue;
            }

            $usedAttributeIds[] = $attributeId;

            ProductVariantValueModel::query()->create([
                'variant_id' => $variantId,
                'attribute_id' => $attributeId,
                'value' => (string) $value['value'],
            ]);
        }
    }

    public function delete(int $id): void
    {
        ProductVariantModel::query()->where('id', $id)->delete();
    }
}
