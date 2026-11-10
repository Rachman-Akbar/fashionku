<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Resources;

use App\Domains\Catalog\Product\Domain\Entities\ProductVariant;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers\ProductMapper;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->resource instanceof ProductModel
            ? ProductMapper::toEntity($this->resource)
            : $this->resource;
        $variants = $product->variants();
        $targetVariant = null;

        foreach ($variants as $variant) {
            if ($variant instanceof ProductVariant && $variant->isDefault()) {
                $targetVariant = $variant;
                break;
            }
        }

        if ($targetVariant === null && $variants !== []) {
            $targetVariant = $variants[0];
        }

        $store = $product->store();
        $internal = ProductVariantResource::isInternalRequest($request);
        $available = $targetVariant ? $targetVariant->availableStock() : 0;
        $targetMaxOrderQty = $targetVariant ? $targetVariant->maxOrderQty() : 999999;
        $targetAllowsPreorder = $targetVariant ? $targetVariant->allowsPreorder() : false;
        $targetMinStock = $targetVariant ? $targetVariant->minStock() : 0;

        return [
            'id' => $product->id(),
            'store_id' => $product->storeId(),
            'store' => $store !== [] ? $store : null,
            'store_name' => $store['name'] ?? null,
            'store_slug' => $store['slug'] ?? null,
            'store_logo' => $store['logo'] ?? null,
            'store_city' => $store['city'] ?? null,
            'store_province' => $store['province'] ?? null,
            'primary_category_id' => $product->primaryCategoryId(),
            'name' => $product->name(),
            'slug' => $product->slug(),
            'sku' => $targetVariant ? $targetVariant->sku() : null,
            'price' => $targetVariant ? $targetVariant->price() : 0.0,
            'stock' => $targetVariant ? $targetVariant->stock() : 0,
            'available_stock' => $available,
            'allows_preorder' => (bool) $targetAllowsPreorder,
            'max_order_qty' => $targetMaxOrderQty,
            'min_stock' => $targetMinStock,
            'po_stock' => $internal && $targetVariant ? $targetVariant->poStock() : null,
            'total_stock' => $internal && $targetVariant ? $targetVariant->totalStock() : $available,
            'average_rating' => $product->averageRating(),
            'review_count' => $product->reviewCount(),
            'description' => $product->description(),
            'brand' => $product->brand(),
            'thumbnail' => $product->thumbnail(),
            'status' => $product->status(),
            'is_active' => $product->isActive(),
            'category_ids' => $product->categoryIds(),
            'images' => ProductImageResource::collection($product->images()),
            'attribute_values' => ProductAttributeValueResource::collection($product->attributeValues()),
            'variants' => ProductVariantResource::collection($product->variants()),
            'created_at' => $product->createdAt(),
            'updated_at' => $product->updatedAt(),
        ];
    }
}
