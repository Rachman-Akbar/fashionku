<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\UseCases\Product;

use App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models\ProductCostingImpactModel;
use App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models\ProductCostingModel;
use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeValueRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductImageRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class UpdateProductUseCase
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly ProductVariantRepositoryInterface $variants,
        private readonly ProductAttributeValueRepositoryInterface $attributeValues,
        private readonly ProductImageRepositoryInterface $productImages,
        private readonly CodePatternService $codePatterns) {}

    public function execute(int|string $id, array $data): Product
    {
        return DB::transaction(function () use ($id, $data): Product {
            $current = $this->products->findById((int) $id, true);

            abort_if(! $current, 404, 'Product not found.');

            $name = trim((string) preg_replace('/\s+/u', ' ', (string) ($data['name'] ?? $current->name())));

            if ($this->products->nameExists($name, (int) $current->id())) {
                throw new InvalidArgumentException("Nama produk '{$name}' sudah digunakan.");
            }

            $product = $this->products->save(new Product(
                id: $current->id(),
                primaryCategoryId: array_key_exists('primary_category_id', $data)
                    ? ($data['primary_category_id'] ? (int) $data['primary_category_id'] : null)
                    : $current->primaryCategoryId(),
                name: $name,
                slug: (string) ($data['slug'] ?? $current->slug()),
                description: array_key_exists('description', $data) ? $data['description'] : $current->description(),
                brand: array_key_exists('brand', $data) ? $data['brand'] : $current->brand(),
                unit: array_key_exists('unit', $data) ? $this->nullableUnit($data['unit']) : $current->unit(),
                thumbnail: array_key_exists('thumbnail', $data) ? $data['thumbnail'] : $current->thumbnail(),
                isActive: array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $current->isActive(),
                categoryIds: array_key_exists('category_ids', $data)
                    ? array_map('intval', $data['category_ids'] ?? [])
                    : $current->categoryIds()
            ));

            if (! array_key_exists('variants', $data) && array_key_exists('sku', $data)) {
                $customSku = trim((string) $data['sku']);

                if ($customSku !== '') {
                    DB::table('product_variants')
                        ->where('product_id', $product->id())
                        ->where('is_default', true)
                        ->update(['sku' => $customSku, 'updated_at' => now()]);
                }
            }

            if (array_key_exists('variants', $data) && is_array($data['variants'])) {
                $costing = ProductCostingModel::query()->where('product_id', $product->id())->first();
                $currentVariants = collect($current->variants())->keyBy(
                    fn (ProductVariant $variant): int => (int) $variant->id()
                );
                $retainedIds = [];

                foreach ($data['variants'] as $index => $variantData) {
                    $variantId = ! empty($variantData['id']) ? (int) $variantData['id'] : null;
                    $oldVariant = $variantId ? $currentVariants->get($variantId) : null;

                    if ($variantId !== null && ! $oldVariant) {
                        throw new InvalidArgumentException('Variant tidak termasuk dalam produk yang sedang diperbarui.');
                    }

                    if ($variantId === null && ! empty($variantData['sku'])) {
                        $oldVariant = $currentVariants->first(
                            fn (ProductVariant $variant): bool => $variant->sku() === (string) $variantData['sku']
                        );
                        $variantId = $oldVariant?->id();
                    }

                    $computedSku = trim((string) ($variantData['sku'] ?? ($oldVariant?->sku() ?? '')));

                    if ($computedSku === '') {
                        $computedSku = $this->generateSku([
                            'name' => $variantData['name'] ?? $product->name(),
                            'brand' => $product->brand(),
                            'primary_category_id' => $product->primaryCategoryId(),
                        ]);
                    }

                    $saved = $this->variants->save(new ProductVariant(
                        id: $variantId,
                        productId: (int) $product->id(),
                        sku: $computedSku,
                        name: trim((string) preg_replace('/\s+/u', ' ', (string) ($variantData['name'] ?? ($oldVariant?->name() ?? $product->name())))),
                        price: (float) ($variantData['price'] ?? ($oldVariant?->price() ?? 0.0)),
                        priceOriginal: array_key_exists('price_original', $variantData)
                            ? (isset($variantData['price_original']) ? (float) $variantData['price_original'] : null)
                            : ($oldVariant?->priceOriginal() ?? null),
                        priceSale: array_key_exists('price_sale', $variantData)
                            ? (isset($variantData['price_sale']) ? (float) $variantData['price_sale'] : null)
                            : ($oldVariant?->priceSale() ?? null),
                        stock: (int) ($oldVariant?->stock() ?? 0),
                        poStock: array_key_exists('po_stock', $variantData)
                            ? max(0, (int) $variantData['po_stock'])
                            : ($oldVariant?->poStock() ?? 0),
                        maxOrderQty: array_key_exists('max_order_qty', $variantData)
                            ? max(1, (int) $variantData['max_order_qty'])
                            : ($oldVariant?->maxOrderQty() ?? 999999),
                        minStock: array_key_exists('min_stock', $variantData)
                            ? max(0, (int) $variantData['min_stock'])
                            : ($oldVariant?->minStock() ?? 0),
                        isDefault: $index === 0
                    ));

                    $savedId = (int) $saved->id();
                    $retainedIds[] = $savedId;

                    $oldSellingPrice = $oldVariant
                        ? ($oldVariant->priceSale() ?? $oldVariant->price())
                        : null;
                    $newSellingPrice = $saved->priceSale() ?? $saved->price();

                    if ($oldVariant && abs($newSellingPrice - $oldSellingPrice) >= 0.01) {
                        $hpp = (float) ($costing?->hpp ?? 0);
                        $materialCost = (float) ($costing?->material_cost ?? 0);
                        $suggestedPrice = (float) ($costing?->suggested_price ?? 0);

                        ProductCostingImpactModel::query()->create([
                            'product_id' => $product->id(),
                            'product_variant_id' => $savedId,
                            'old_material_cost' => $materialCost,
                            'new_material_cost' => $materialCost,
                            'old_hpp' => $hpp,
                            'new_hpp' => $hpp,
                            'hpp_change_amount' => 0,
                            'hpp_change_percent' => 0,
                            'old_suggested_price' => $suggestedPrice,
                            'new_suggested_price' => $suggestedPrice,
                            'old_selling_price' => $oldSellingPrice,
                            'new_selling_price' => $newSellingPrice,
                            'trigger_type' => 'product_price_change',
                            'occurred_at' => now(),
                        ]);
                    }

                    if (array_key_exists('values', $variantData)) {
                        $this->variants->replaceValues($savedId, $variantData['values'] ?? []);
                    }
                }

                foreach ($currentVariants as $currentVariant) {
                    if (! in_array((int) $currentVariant->id(), $retainedIds, true)) {
                        if ($currentVariant->stock() > 0 || $currentVariant->poStock() > 0) {
                            throw new InvalidArgumentException('Stok variant harus 0 sebelum variant dihapus. Kurangi stok melalui Persediaan terlebih dahulu.');
                        }
                        $this->variants->delete((int) $currentVariant->id());
                    }
                }
            }

            if (array_key_exists('images', $data)) {
                $this->productImages->replaceForProduct((int) $product->id(), $data['images'] ?? []);
            }

            if (array_key_exists('attribute_values', $data)) {
                $this->attributeValues->replaceForProduct(
                    (int) $product->id(),
                    $this->normalizeAttributeValues($data['attribute_values'] ?? [])
                );
            }

            return $this->products->findById((int) $product->id(), true);
        });
    }

    /**
     * Satuan disimpan sebagai teks bebas: string kosong dianggap "tanpa satuan".
     */
    private function nullableUnit(mixed $value): ?string
    {
        $unit = trim((string) $value);

        return $unit !== '' ? mb_substr($unit, 0, 30) : null;
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
