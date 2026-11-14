<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\Product;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeValueRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductImageRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class CreateProductUseCase
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly ProductVariantRepositoryInterface $variants,
        private readonly ProductAttributeValueRepositoryInterface $attributeValues,
        private readonly ProductImageRepositoryInterface $productImages,
        private readonly CodePatternService $codePatterns) {}

    public function execute(array $data): Product
    {
        return DB::transaction(function () use ($data): Product {
            $name = trim((string) preg_replace('/\s+/u', ' ', (string) $data['name']));

            if ($this->products->nameExists($name)) {
                throw new InvalidArgumentException("Nama produk '{$name}' sudah digunakan.");
            }

            $sku = $this->resolveSku($data);
            $product = $this->products->save(new Product(
                id: null,
                primaryCategoryId: isset($data['primary_category_id']) ? (int) $data['primary_category_id'] : null,
                name: $name,
                slug: (string) ($data['slug'] ?? Str::slug($name)),
                description: $data['description'] ?? null,
                brand: $data['brand'] ?? null,
                thumbnail: $data['thumbnail'] ?? null,
                status: (string) ($data['status'] ?? 'published'),
                isActive: (bool) ($data['is_active'] ?? true),
                categoryIds: array_map('intval', $data['category_ids'] ?? [])
            ));

            if (! empty($data['images'])) {
                $this->productImages->replaceForProduct((int) $product->id(), $data['images']);
            }

            if (! empty($data['attribute_values'])) {
                $this->attributeValues->replaceForProduct(
                    (int) $product->id(),
                    $this->normalizeAttributeValues($data['attribute_values'])
                );
            }

            if (empty($data['variants'])) {
                $this->variants->save(new ProductVariant(
                    id: null,
                    productId: (int) $product->id(),
                    sku: $sku,
                    name: $name,
                    price: (float) ($data['price'] ?? 0),
                    priceOriginal: isset($data['price_original']) ? (float) $data['price_original'] : null,
                    priceSale: isset($data['price_sale']) ? (float) $data['price_sale'] : null,
                    stock: max(0, (int) ($data['stock'] ?? 0)),
                    poStock: max(0, (int) ($data['po_stock'] ?? 0)),
                    maxOrderQty: max(1, (int) ($data['max_order_qty'] ?? 999999)),
                    minStock: max(0, (int) ($data['min_stock'] ?? 0)),
                    isDefault: true
                ));
            } else {
                foreach ($data['variants'] as $index => $variantData) {
                    $variantSku = trim((string) ($variantData['sku'] ?? ''));
                    $variantName = trim((string) preg_replace('/\s+/u', ' ', (string) ($variantData['name'] ?? '')));

                    $variant = $this->variants->save(new ProductVariant(
                        id: null,
                        productId: (int) $product->id(),
                        sku: $variantSku !== '' ? $variantSku : ($index === 0 ? $sku : $this->generateSku($variantData + $data)),
                        name: $variantName !== '' ? $variantName : $name,
                        price: (float) ($variantData['price'] ?? 0),
                        priceOriginal: isset($variantData['price_original']) ? (float) $variantData['price_original'] : null,
                        priceSale: isset($variantData['price_sale']) ? (float) $variantData['price_sale'] : null,
                        stock: max(0, (int) ($variantData['stock'] ?? 0)),
                        poStock: max(0, (int) ($variantData['po_stock'] ?? 0)),
                        maxOrderQty: max(1, (int) ($variantData['max_order_qty'] ?? 999999)),
                        minStock: max(0, (int) ($variantData['min_stock'] ?? 0)),
                        isDefault: array_key_exists('is_default', $variantData)
                            ? (bool) $variantData['is_default']
                            : $index === 0
                    ));

                    if (! empty($variantData['values'])) {
                        $this->variants->replaceValues((int) $variant->id(), $variantData['values']);
                    }
                }
            }

            return $this->products->findById((int) $product->id(), true);
        });
    }

    private function resolveSku(array $payload): string
    {
        $sku = isset($payload['sku']) && is_string($payload['sku']) ? trim($payload['sku']) : '';

        return $sku !== '' ? $sku : $this->generateSku($payload);
    }

    private function generateSku(array $payload): string
    {
        return $this->codePatterns->unique('sku', [
            'name' => (string) ($payload['name'] ?? ''),
            'brand' => (string) ($payload['brand'] ?? ''),
            'category' => empty($payload['primary_category_id']) ? '' : 'CAT'.(string) $payload['primary_category_id'],
            'type' => 'SKU',
            'seq' => (int) DB::table('product_variants')->count() + 1,
        ], fn (string $sku): bool => DB::table('product_variants')->where('sku', $sku)->exists());
    }

    private function normalizeAttributeValues(array $items): array
    {
        $rows = [];

        foreach ($items as $item) {
            if (! isset($item['attribute_id'])) {
                continue;
            }

            if (isset($item['values']) && is_array($item['values'])) {
                foreach ($item['values'] as $value) {
                    $rows[] = ['attribute_id' => (int) $item['attribute_id'], 'value' => (string) $value];
                }

                continue;
            }

            if (array_key_exists('value', $item)) {
                $rows[] = ['attribute_id' => (int) $item['attribute_id'], 'value' => (string) $item['value']];
            }
        }

        return $rows;
    }
}
