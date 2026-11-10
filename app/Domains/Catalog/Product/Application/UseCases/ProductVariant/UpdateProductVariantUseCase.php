<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductVariant;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class UpdateProductVariantUseCase
{
    public function __construct(
        private readonly ProductVariantRepositoryInterface $variants
    ) {}

    public function execute(int|string $variantId, array $data): ProductVariant
    {
        return DB::transaction(function () use ($variantId, $data) {
            $current = $this->variants->findById((int) $variantId);
            abort_if(! $current, 404, 'Product variant not found.');

            $storeId = (int) $current->storeId();

            // Kalkulasi Nama
            $computedName = (string) ($data['name'] ?? $current->name());
            if ($computedName === '') {
                $computedName = $this->generateNameFallback($current, $data);
            }

            // Kalkulasi SKU
            $computedSku = (string) ($data['sku'] ?? $current->sku());
            if ($computedSku === '') {
                $computedSku = $this->generateSkuFallback($computedName, $storeId);
            }

            $variant = $this->variants->save(new ProductVariant(
                id: $current->id(),
                productId: $current->productId(),
                storeId: $storeId,
                sku: $computedSku,
                name: $computedName,
                price: (float) ($data['price'] ?? $current->price()),
                priceOriginal: array_key_exists('price_original', $data)
                    ? (isset($data['price_original']) ? (float) $data['price_original'] : null)
                    : $current->priceOriginal(),
                priceSale: array_key_exists('price_sale', $data)
                    ? (isset($data['price_sale']) ? (float) $data['price_sale'] : null)
                    : $current->priceSale(),
                stock: (int) $current->stock(),
                poStock: array_key_exists('po_stock', $data)
                    ? max(0, (int) $data['po_stock'])
                    : $current->poStock(),
                stockReserved: $current->stockReserved(),
                stockBooked: $current->stockBooked(),
                stockPreorder: $current->stockPreorder(),
                maxOrderQty: array_key_exists('max_order_qty', $data)
                    ? max(1, (int) $data['max_order_qty'])
                    : $current->maxOrderQty(),
                minStock: array_key_exists('min_stock', $data)
                    ? max(0, (int) $data['min_stock'])
                    : $current->minStock(),
                isDefault: array_key_exists('is_default', $data) ? (bool) $data['is_default'] : $current->isDefault()
            ));

            if (array_key_exists('values', $data)) {
                $this->variants->replaceValues(
                    variantId: (int) $variant->id(),
                    values: $data['values'] ?? []
                );
            }

            return $this->variants->findById((int) $variant->id());
        });
    }

    private function generateNameFallback(ProductVariant $current, array $data): string
    {
        $nameParts = ['Variant']; // Anda bisa meload entitas Product di sini jika ingin nama lengkap
        if (! empty($data['values']) && is_array($data['values'])) {
            foreach ($data['values'] as $val) {
                if (! empty($val['value'])) {
                    $nameParts[] = (string) $val['value'];
                }
            }
        }

        return implode(' - ', $nameParts);
    }

    private function generateSkuFallback(string $resolvedName, int $storeId): string
    {
        $base = Str::upper(Str::slug($resolvedName));
        $base = $base === '' ? 'VARIANT' : Str::substr($base, 0, 40);

        $date = now()->format('ymd');
        $counter = 1;

        do {
            $sku = $base.'-'.$date.'-'.str_pad((string) $counter, 4, '0', STR_PAD_LEFT);
            $exists = DB::table('product_variants')
                ->where('sku', $sku)
                ->where('store_id', $storeId)
                ->exists();
            $counter++;
        } while ($exists);

        return $sku;
    }
}
