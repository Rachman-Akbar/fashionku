<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\ProductVariant;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateProductVariantUseCase
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly ProductVariantRepositoryInterface $variants
    ) {}

    public function execute(int $productId, array $data): ProductVariant
    {
        return DB::transaction(function () use ($productId, $data) {
            $product = $this->products->findById($productId);
            abort_if(! $product, 404, 'Product not found.');

            $storeId = (int) $product->storeId();

            // 1. Ambil nama otomatis (Gabungan Nama Produk + Atribut)
            $name = $this->resolveName($product, $data);

            // 2. Ambil SKU otomatis menggunakan nama yang sudah diracik
            $sku = $this->resolveSku($name, $data, $storeId);

            $variant = $this->variants->save(new ProductVariant(
                id: null,
                productId: $productId,
                storeId: $storeId,
                sku: $sku,   // AMAN: Menggunakan variabel hasil kalkulasi, bukan $data['sku'] langsung
                name: $name, // AMAN: Menggunakan variabel hasil kalkulasi, bukan $data['name'] langsung
                price: (float) ($data['price'] ?? 0),
                priceOriginal: isset($data['price_original']) ? (float) $data['price_original'] : null,
                priceSale: isset($data['price_sale']) ? (float) $data['price_sale'] : null,
                stock: 0,
                poStock: max(0, (int) ($data['po_stock'] ?? 0)),
                stockReserved: 0,
                stockBooked: 0,
                stockPreorder: 0,
                maxOrderQty: max(1, (int) ($data['max_order_qty'] ?? 999999)),
                minStock: max(0, (int) ($data['min_stock'] ?? 0)),
                isDefault: (bool) ($data['is_default'] ?? false)
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

    private function resolveName(Product $product, array $data): string
    {
        if (! empty($data['name'])) {
            return (string) $data['name'];
        }

        $nameParts = [$product->name()];

        if (! empty($data['values']) && is_array($data['values'])) {
            foreach ($data['values'] as $val) {
                if (! empty($val['value'])) {
                    $nameParts[] = (string) $val['value'];
                }
            }
        }

        return implode(' - ', $nameParts);
    }

    private function resolveSku(string $resolvedName, array $data, int $storeId): string
    {
        if (! empty($data['sku'])) {
            return (string) $data['sku'];
        }

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
