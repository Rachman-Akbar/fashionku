<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use App\Domains\Catalog\Product\Domain\Entities\Product;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers\ProductMapper;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class EloquentProductRepository implements ProductRepositoryInterface
{
    public function getAll(array $filters = []): Collection
    {
        $query = $this->buildListQuery($filters);
        $this->applySorting($query, $filters);

        return $query
            ->get()
            ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model));
    }

    public function cursorPaginate(array $filters = [], int $perPage = 24): CursorPaginator
    {
        $query = $this->buildListQuery($filters);
        $this->applySorting($query, $filters);

        $paginator = $query
            ->cursorPaginate(
                max(1, min(50, $perPage)),
                ['*'],
                'cursor'
            );

        return $paginator;
    }

    public function paginate(array $filters = [], int $perPage = 20, int $page = 1): LengthAwarePaginator
    {
        $query = $this->buildListQuery($filters);
        $this->applySorting($query, $filters);

        $paginator = $query
            ->paginate(
                max(1, min(100, $perPage)),
                ['*'],
                'page',
                max(1, $page)
            );

        $paginator->setCollection(
            $paginator->getCollection()
                ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model))
        );

        return $paginator;
    }

    public function facets(array $filters = []): array
    {
        $filters['status'] = $filters['status'] ?? 'published';
        $filters['is_active'] = true;

        $facets = [
            'locations' => [],
            'store_types' => ['regular', 'official', 'power_merchant'],
            'price_range' => null,
        ];

        $facets['locations'] = $this->facetLocations($filters);
        $facets['price_range'] = $this->facetPriceRange($filters);

        return $facets;
    }

    private function facetLocations(array $filters): array
    {
        $query = ProductModel::query()
            ->join('stores', 'stores.id', '=', 'products.store_id')
            ->select('stores.city', 'stores.province')
            ->whereNotNull('stores.city')
            ->distinct();

        $this->applyPublicStoreFilter($query);
        $this->applyCommonFilters($query, $filters, false);

        return $query
            ->get()
            ->map(static fn (ProductModel $model): array => array_values(array_filter([
                $model->city,
                $model->province,
            ])))
            ->flatten()
            ->unique()
            ->filter()
            ->sort()
            ->values()
            ->all();
    }

    private function facetPriceRange(array $filters): ?array
    {
        $query = ProductModel::query()
            ->join('product_variants', 'product_variants.product_id', '=', 'products.id')
            ->where('product_variants.is_default', true);

        $this->applyPublicStoreFilter($query);
        $this->applyCommonFilters($query, $filters, false);

        $minPrice = (clone $query)->min('product_variants.price');
        $maxPrice = (clone $query)->max('product_variants.price');

        if ($minPrice === null || $maxPrice === null) {
            return null;
        }

        return [
            'min' => (float) $minPrice,
            'max' => (float) $maxPrice,
        ];
    }

    public function findById(int $id, bool $includeInactive = false): ?Product
    {
        $model = ProductModel::query()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->when(! $includeInactive, function (Builder $query): void {
                $query->active()->where('products.status', 'published');
                $this->applyPublicStoreFilter($query);
            })
            ->with($this->relationsForDetail($includeInactive))
            ->find($id);

        return $model ? ProductMapper::toEntity($model) : null;
    }

    public function findBySlug(string $slug, bool $includeInactive = false): ?Product
    {
        $model = ProductModel::query()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->when(! $includeInactive, function (Builder $query): void {
                $query->active()->where('products.status', 'published');
                $this->applyPublicStoreFilter($query);
            })
            ->with($this->relationsForDetail($includeInactive))
            ->where('slug', $slug)
            ->first();

        return $model ? ProductMapper::toEntity($model) : null;
    }

    public function nameExistsForStore(string $name, int $storeId, ?int $ignoreId = null): bool
    {
        return ProductModel::withTrashed()
            ->where('store_id', $storeId)
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function findPublishedByStoreId(int $storeId): Collection
    {
        return ProductModel::query()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->active()
            ->whereHas('store', fn (Builder $query) => $query->publiclyAvailable())
            ->with($this->relationsForList(['include' => 'summary']))
            ->where('store_id', $storeId)
            ->where('products.status', 'published')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model));
    }

    public function findPublishedByCategorySlug(
        string $categorySlug,
        array $filters = []
    ): Collection {
        $category = CategoryModel::query()
            ->active()
            ->whereHas('catalogGroup', fn (Builder $query) => $query->active())
            ->where(function (Builder $query) use ($categorySlug): void {
                $query->where('slug', $categorySlug)
                    ->orWhere('full_slug', $categorySlug);
            })
            ->first();

        $categoryIds = $category
            ? $this->getCategoryAndDescendantIdsById((int) $category->id)
            : [];

        $query = ProductModel::query()
            ->active()
            ->whereHas('store', fn (Builder $query) => $query->publiclyAvailable())
            ->with($this->relationsForList($filters))
            ->where('products.status', 'published');

        $this->applyCategoryIdsFilter($query, $categoryIds);
        $this->applyOptionalFilters($query, $filters);

        return $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model));
    }

    public function findPublishedByCategoryPath(
        string $path,
        array $filters,
        bool $includeDescendants
    ): Collection {
        $category = CategoryModel::query()
            ->active()
            ->whereHas('catalogGroup', fn (Builder $query) => $query->active())
            ->where('full_slug', $path)
            ->first();

        if (! $category) {
            abort(404, 'Category not found.');
        }

        $categoryIds = $includeDescendants
            ? $this->getCategoryAndDescendantIdsById((int) $category->id)
            : [(int) $category->id];

        $query = ProductModel::query()
            ->active()
            ->whereHas('store', fn (Builder $query) => $query->publiclyAvailable())
            ->with($this->relationsForList($filters))
            ->where('products.status', 'published');

        $this->applyCategoryIdsFilter($query, $categoryIds);
        $this->applyOptionalFilters($query, $filters);

        return $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model));
    }

    public function findByCategory(
        int $categoryId,
        array $filters,
        bool $includeDescendants
    ): Collection {
        $categoryIds = $includeDescendants
            ? $this->getCategoryAndDescendantIdsById($categoryId)
            : [$categoryId];

        $query = ProductModel::query()
            ->active()
            ->whereHas('store', fn (Builder $query) => $query->publiclyAvailable())
            ->with($this->relationsForList($filters))
            ->where('products.status', 'published');

        $this->applyCategoryIdsFilter($query, $categoryIds);
        $this->applyOptionalFilters($query, $filters);

        return $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ProductModel $model): Product => ProductMapper::toEntity($model));
    }

    public function save(Product $product): Product
    {
        $model = $product->id()
            ? ProductModel::query()->find($product->id())
            : null;

        if (! $model) {
            $model = ProductMapper::toModel($product);
        } else {
            $model->store_id = $product->storeId();
            $model->primary_category_id = $product->primaryCategoryId();
            $model->name = $product->name();
            $model->slug = $product->slug();
            $model->description = $product->description();
            $model->brand = $product->brand();
            $model->thumbnail = $product->thumbnail();
            $model->status = $product->status();
            $model->is_active = $product->isActive();
        }

        $model->save();

        $categoryIds = $product->categoryIds();

        if ($product->primaryCategoryId() && ! in_array($product->primaryCategoryId(), $categoryIds, true)) {
            $categoryIds[] = $product->primaryCategoryId();
        }

        $syncPayload = [];

        foreach (array_values(array_unique($categoryIds)) as $categoryId) {
            $syncPayload[$categoryId] = [
                'is_primary' => (int) ($categoryId === $product->primaryCategoryId()),
            ];
        }

        $model->categories()->sync($syncPayload);
        $model->load($this->relationsForDetail(true));

        return ProductMapper::toEntity($model);
    }

    public function delete(int $id): bool
    {
        $model = ProductModel::query()->find($id);

        return $model ? (bool) $model->delete() : false;
    }

    private function buildListQuery(array $filters): Builder
    {
        $includeInactive = (bool) ($filters['include_inactive'] ?? false);
        $query = ProductModel::query()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with($this->relationsForList($filters, $includeInactive));

        if (! $includeInactive) {
            $this->applyPublicStoreFilter($query);
        }

        $this->applyCommonFilters($query, $filters, $includeInactive);

        return $query;
    }

    private function relationsForList(array $filters = [], bool $includeInactive = false): array
    {
        $include = (string) ($filters['include'] ?? $filters['view'] ?? 'summary');

        if ($include === 'full') {
            return $this->relationsForDetail($includeInactive);
        }

        return [
            'store:id,name,slug,logo,city,province,status,is_active',
            'images' => fn ($query) => $query
                ->select(['id', 'product_id', 'url', 'alt_text', 'is_primary', 'sort_order', 'created_at', 'updated_at'])
                ->orderByDesc('is_primary')
                ->orderBy('sort_order')
                ->orderBy('id'),
            'variants' => fn ($query) => $query
                ->select(['id', 'product_id', 'store_id', 'sku', 'name', 'price', 'stock', 'is_default', 'created_at', 'updated_at'])
                ->orderByDesc('is_default')
                ->orderBy('id'),
        ];
    }

    private function relationsForDetail(bool $includeInactive = false): array
    {
        return [
            'primaryCategory' => fn ($query) => $query->when(! $includeInactive, fn ($query) => $query
                ->active()
                ->whereHas('catalogGroup', fn ($groupQuery) => $groupQuery->active())),
            'categories' => fn ($query) => $query->when(! $includeInactive, fn ($query) => $query
                ->active()
                ->whereHas('catalogGroup', fn ($groupQuery) => $groupQuery->active())),
            'store',
            'attributeValues.attribute',
            'variants.values.attribute',
            'images',
        ];
    }

    private function applyCommonFilters(Builder $query, array $filters, bool $includeInactive): void
    {
        if (! empty($filters['status'])) {
            $status = Str::lower(trim((string) $filters['status']));
            $query->where('products.status', $status);
        }

        if (array_key_exists('is_active', $filters)) {
            $query->where(
                'products.is_active',
                filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
                    ?? (bool) $filters['is_active']
            );
        } elseif (! $includeInactive) {
            $query->active();
        }

        if (! empty($filters['category_id']) || ! empty($filters['category_ids'])) {
            $categoryIds = array_values(array_filter(array_map(
                'intval',
                (array) ($filters['category_ids'] ?? [$filters['category_id']])
            )));
            $categoryIds = array_values(array_unique($categoryIds));

            $includeDescendants = filter_var(
                $filters['include_descendants'] ?? true,
                FILTER_VALIDATE_BOOLEAN
            );
            $resolved = [];

            foreach ($categoryIds as $categoryId) {
                $resolved = array_merge(
                    $resolved,
                    $includeDescendants
                        ? $this->getCategoryAndDescendantIdsById($categoryId)
                        : [$categoryId]
                );
            }

            $resolved = array_values(array_unique($resolved));
            $this->applyCategoryIdsFilter($query, $resolved);
        } else {
            $categorySlug = trim((string) ($filters['category_slug'] ?? $filters['category'] ?? ''));

            if ($categorySlug !== '') {
                $category = CategoryModel::query()
                    ->active()
                    ->whereHas('catalogGroup', fn (Builder $categoryQuery) => $categoryQuery->active())
                    ->where(function (Builder $categoryQuery) use ($categorySlug): void {
                        $categoryQuery
                            ->where('slug', $categorySlug)
                            ->orWhere('full_slug', $categorySlug);
                    })
                    ->first();

                $categoryIds = $category
                    ? $this->getCategoryAndDescendantIdsById((int) $category->id)
                    : [];

                $this->applyCategoryIdsFilter($query, $categoryIds);
            }
        }

        $this->applyOptionalFilters($query, $filters);
    }

    private function applyOptionalFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['store_id'])) {
            $query->where('products.store_id', (int) $filters['store_id']);
        }

        $storeType = Str::lower(trim((string) ($filters['store_type'] ?? '')));

        if (in_array($storeType, ['regular', 'official', 'power_merchant'], true)) {
            $query->whereHas('store', fn (Builder $storeQuery) => $storeQuery->where('stores.store_type', $storeType));
        }

        $locations = $this->normalizeListFilter($filters['locations'] ?? null);

        if ($locations !== []) {
            $query->whereHas('store', function (Builder $storeQuery) use ($locations): void {
                $storeQuery->where(function (Builder $query) use ($locations): void {
                    foreach ($locations as $index => $location) {
                        $wrapped = trim((string) $location);
                        $query->when($index === 0, static fn (Builder $query) => $query->where(function (Builder $query) use ($wrapped): void {
                            $query->where('city', 'like', "%{$wrapped}%")
                                ->orWhere('province', 'like', "%{$wrapped}%");
                        }), static fn (Builder $query) => $query->orWhere(function (Builder $query) use ($wrapped): void {
                            $query->where('city', 'like', "%{$wrapped}%")
                                ->orWhere('province', 'like', "%{$wrapped}%");
                        }));
                    }
                });
            });
        }

        if (filter_var($filters['has_discount'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereHas('variants', function (Builder $variantQuery): void {
                $variantQuery->whereNotNull('price_original')
                    ->whereColumn('price_original', '>', 'price');
            });
        }

        $name = trim((string) ($filters['name'] ?? ''));

        if ($name !== '') {
            $query->where('products.name', 'like', '%'.$name.'%');
        }

        $mode = Str::lower(trim((string) ($filters['mode'] ?? '')));

        if ($mode === 'variant') {
            $query->has('variants', '>', 1);
        } elseif ($mode === 'simple') {
            $query->has('variants', '<=', 1);
        }

        $this->applyVariantRangeFilter($query, 'price', $filters['price_min'] ?? $filters['min_price'] ?? null, $filters['price_max'] ?? $filters['max_price'] ?? null);
        $this->applyVariantRangeFilter($query, 'stock', $filters['stock_min'] ?? null, $filters['stock_max'] ?? null);

        if (filter_var($filters['low_stock'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereHas('variants', function (Builder $variantQuery): void {
                $variantQuery
                    ->where('min_stock', '>', 0)
                    ->whereColumn('stock', '<=', 'min_stock');
            });
        }

        if (filter_var($filters['safe_stock'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereDoesntHave('variants', function (Builder $variantQuery): void {
                $variantQuery
                    ->where('min_stock', '>', 0)
                    ->whereColumn('stock', '<=', 'min_stock');
            });
        }

        if (! empty($filters['seller_id'])) {
            $sellerId = (string) $filters['seller_id'];
            $query->whereHas('store', fn (Builder $storeQuery) => $storeQuery->where('user_id', $sellerId));
        }

        $catalogGroupId = $this->resolveCatalogGroupId($filters);

        if ($catalogGroupId !== null) {
            $this->applyCatalogGroupFilter($query, $catalogGroupId);
        }

        $search = trim((string) ($filters['search'] ?? $filters['q'] ?? ''));

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('products.name', 'like', '%'.$search.'%')
                    ->orWhere('products.slug', 'like', '%'.$search.'%')
                    ->orWhere('products.description', 'like', '%'.$search.'%')
                    ->orWhere('products.brand', 'like', '%'.$search.'%')
                    ->orWhereHas('variants', fn (Builder $query) => $query->where('sku', 'like', '%'.$search.'%'));
            });
        }
    }

    private function applyVariantRangeFilter(
        Builder $query,
        string $column,
        mixed $minimum,
        mixed $maximum
    ): void {
        if (! in_array($column, ['price', 'stock'], true)) {
            return;
        }

        $subquery = fn () => ProductVariantModel::query()
            ->select($column)
            ->whereColumn('product_id', 'products.id')
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->limit(1);

        if ($minimum !== null && $minimum !== '' && is_numeric($minimum)) {
            $query->where($subquery(), '>=', (float) $minimum);
        }

        if ($maximum !== null && $maximum !== '' && is_numeric($maximum)) {
            $query->where($subquery(), '<=', (float) $maximum);
        }
    }

    private function applySorting(Builder $query, array $filters): void
    {
        $sortBy = Str::lower(trim((string) ($filters['sort_by'] ?? $filters['sort'] ?? '')));
        $direction = Str::lower(trim((string) ($filters['sort_direction'] ?? 'desc'))) === 'asc'
            ? 'asc'
            : 'desc';

        if ($sortBy === '' || $sortBy === 'relevance') {
            $query->orderByDesc('products.is_active')
                ->orderByDesc('products.created_at')
                ->orderByDesc('products.id');

            return;
        }

        if ($sortBy === 'rating_desc' || $sortBy === 'most_reviewed') {
            $query->leftJoinSub(
                ProductReviewModel::query()
                    ->select('product_id as sort_product_id')
                    ->selectRaw('AVG(rating) as avg_rating')
                    ->selectRaw('COUNT(*) as review_count')
                    ->where('is_active', 1)
                    ->whereNull('deleted_at')
                    ->groupBy('sort_product_id'),
                'review_agg',
                fn ($join) => $join->on('review_agg.sort_product_id', '=', 'products.id')
            )->addSelect('review_agg.avg_rating as avg_rating')
                ->orderByDesc('review_agg.avg_rating')
                ->orderByDesc('products.id');

            return;
        }

        if ($sortBy === 'price_asc' || $sortBy === 'price_desc') {
            $priceDirection = $sortBy === 'price_asc' ? 'asc' : 'desc';

            $query->leftJoinSub(
                ProductVariantModel::query()
                    ->select('product_id as sort_product_id')
                    ->selectRaw('price')
                    ->where('is_default', 1),
                'price_variant',
                fn ($join) => $join->on('price_variant.sort_product_id', '=', 'products.id')
            )->addSelect('price_variant.price as price')
                ->orderBy('price_variant.price', $priceDirection)
                ->orderBy('products.id', $priceDirection);

            return;
        }

        if ($sortBy === 'latest') {
            $query->orderByDesc('products.created_at')->orderByDesc('products.id');

            return;
        }

        if ($sortBy === 'store_name') {
            $query->leftJoinSub(
                StoreModel::query()
                    ->select('id as sort_store_id')
                    ->addSelect('name as sort_store_name'),
                'stores_sort',
                fn ($join) => $join->on('stores_sort.sort_store_id', '=', 'products.store_id')
            )->addSelect('stores_sort.sort_store_name as sort_store_name')
                ->orderBy('stores_sort.sort_store_name', $direction)
                ->orderBy('products.id', $direction);
        } elseif ($sortBy === 'price' || $sortBy === 'stock') {
            $query->leftJoinSub(
                ProductVariantModel::query()
                    ->select('product_id as sort_product_id')
                    ->selectRaw($sortBy)
                    ->where('is_default', 1),
                'variant_sort',
                fn ($join) => $join->on('variant_sort.sort_product_id', '=', 'products.id')
            )->addSelect('variant_sort.'.$sortBy.' as '.$sortBy)
                ->orderBy('variant_sort.'.$sortBy, $direction)
                ->orderBy('products.id', $direction);
        } elseif ($sortBy === 'mode') {
            $query->leftJoinSub(
                ProductVariantModel::query()
                    ->select('product_id as sort_product_id')
                    ->selectRaw('COUNT(*) as variants_count')
                    ->groupBy('sort_product_id'),
                'variant_counts',
                fn ($join) => $join->on('variant_counts.sort_product_id', '=', 'products.id')
            )->addSelect('variant_counts.variants_count as variants_count')
                ->orderBy('variant_counts.variants_count', $direction)
                ->orderBy('products.id', $direction);
        } else {
            $allowed = ['id', 'name', 'status', 'is_active', 'created_at', 'updated_at'];
            $column = in_array($sortBy, $allowed, true) ? $sortBy : 'created_at';
            $query->orderBy('products.'.$column, $direction);
        }

        if ($sortBy !== 'id') {
            $query->orderBy('products.id', $direction);
        }
    }

    private function normalizeListFilter(mixed $value): array
    {
        if (is_array($value)) {
            $items = array_values($value);
        } else {
            $items = preg_split('/[\s,]+/', trim((string) ($value ?? '')), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        }

        return array_values(array_filter(array_unique(array_map(
            static fn (mixed $item): string => trim((string) $item),
            $items
        )), static fn (string $item): bool => $item !== ''));
    }

    private function applyCategoryIdsFilter(Builder $query, array $categoryIds): void
    {
        $categoryIds = array_values(array_unique(array_map('intval', $categoryIds)));

        if ($categoryIds === []) {
            $query->whereRaw('1 = 0');

            return;
        }

        $query->where(function (Builder $query) use ($categoryIds): void {
            $query
                ->whereIn('primary_category_id', $categoryIds)
                ->orWhereHas('categories', fn (Builder $query) => $query->whereIn('categories.id', $categoryIds));
        });
    }

    private function applyCatalogGroupFilter(Builder $query, int $catalogGroupId): void
    {
        $query->where(function (Builder $query) use ($catalogGroupId): void {
            $query
                ->whereHas('primaryCategory', fn (Builder $query) => $query->where('catalog_group_id', $catalogGroupId))
                ->orWhereHas('categories', fn (Builder $query) => $query->where('categories.catalog_group_id', $catalogGroupId));
        });
    }

    private function resolveCatalogGroupId(array $filters): ?int
    {
        if (! empty($filters['catalog_group_id'])) {
            return (int) $filters['catalog_group_id'];
        }

        $slug = trim((string) ($filters['catalog_group_slug'] ?? ''));

        if ($slug === '') {
            return null;
        }

        $id = DB::table('catalog_groups')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        return $id ? (int) $id : null;
    }

    private function getCategoryAndDescendantIdsById(int $categoryId): array
    {
        $categoryExists = CategoryModel::query()
            ->active()
            ->whereHas('catalogGroup', fn (Builder $query) => $query->active())
            ->whereKey($categoryId)
            ->exists();

        if (! $categoryExists) {
            return [];
        }

        $ids = [$categoryId];
        $parentIds = [$categoryId];

        while ($parentIds !== []) {
            $childIds = CategoryModel::query()
                ->active()
                ->whereIn('parent_id', $parentIds)
                ->pluck('id')
                ->map(fn ($id): int => (int) $id)
                ->all();

            $childIds = array_values(array_diff($childIds, $ids));

            if ($childIds === []) {
                break;
            }

            $ids = array_merge($ids, $childIds);
            $parentIds = $childIds;
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }

    private function applyPublicStoreFilter(Builder $query): void
    {
        $query->whereHas('store', fn (Builder $storeQuery) => $storeQuery->publiclyAvailable());
    }
}
