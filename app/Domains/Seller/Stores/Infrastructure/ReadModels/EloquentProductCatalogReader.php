<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\ReadModels;

use App\Domains\Seller\Stores\Application\ReadModels\ProductCatalogReaderInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class EloquentProductCatalogReader implements ProductCatalogReaderInterface
{
    public function publishedProductsByStoreSlug(
        string $slug,
        array $filters = []
    ): Collection {
        $query = DB::table('products')
            ->join('stores', 'stores.id', '=', 'products.store_id')
            ->leftJoin('categories', 'categories.id', '=', 'products.primary_category_id')
            ->leftJoin('product_variants', function ($join): void {
                $join->on('product_variants.product_id', '=', 'products.id')
                    ->where('product_variants.is_default', true);
            })
            ->where('stores.slug', trim($slug))
            ->whereIn('stores.status', ['approved', 'active'])
            ->where('stores.is_active', true)
            ->whereNull('stores.deleted_at')
            ->where('products.is_active', true)
            ->whereRaw('LOWER(TRIM(products.status)) = ?', ['published'])
            ->whereNull('products.deleted_at')
            ->select([
                'products.id',
                'products.store_id',
                'products.primary_category_id',
                'stores.user_id as seller_id',
                'products.name',
                'products.slug',
                'products.description',
                'products.brand',
                'products.thumbnail',
                'products.status',
                'products.is_active',
                'products.created_at',
                'products.updated_at',
                'product_variants.sku as sku',
                'product_variants.price as price',
                'product_variants.stock as stock',
                DB::raw("JSON_OBJECT('id', categories.id, 'name', categories.name, 'slug', categories.slug, 'full_slug', categories.full_slug) as category"),
                DB::raw("JSON_OBJECT('id', stores.id, 'name', stores.name, 'slug', stores.slug, 'logo_url', stores.logo) as store"),
            ]);

        if (! empty($filters['search'])) {
            $query->where('products.name', 'like', '%'.trim((string) $filters['search']).'%');
        }

        if (! empty($filters['category_id'])) {
            $query->where('products.primary_category_id', (int) $filters['category_id']);
        }

        return $query
            ->orderByDesc('products.created_at')
            ->orderByDesc('products.id')
            ->get();
    }
}
