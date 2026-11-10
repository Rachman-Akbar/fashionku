<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\Persistence\Repositories;

use App\Domains\Seller\Stores\Domain\Entities\Store as StoreEntity;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Mappers\StoreMapper;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class EloquentStoreRepository implements StoreRepositoryInterface
{
    private const DEFAULT_PER_PAGE = 8;

    private const MAX_PER_PAGE = 100;

    public function paginate(array $filters = [], int $perPage = self::DEFAULT_PER_PAGE): LengthAwarePaginator
    {
        $query = StoreModel::query()
            ->with('owner:id,name,email')
            ->select($this->storeListColumns());

        $this->applyStoreFilters($query, $filters);
        $this->applyStoreSorting($query, $filters);

        $paginator = $query
            ->paginate($this->resolvePerPage($filters, $perPage));

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StoreModel $model): StoreEntity => StoreMapper::toEntity($model))
        );

        return $paginator;
    }

    public function findById(int $id): ?StoreEntity
    {
        $model = StoreModel::query()->with(['detail', 'owner:id,name,email'])->find($id);

        return $model ? StoreMapper::toEntity($model) : null;
    }

    public function findBySlug(string $slug, bool $publicOnly = false): ?StoreEntity
    {
        $model = StoreModel::query()
            ->with('detail')
            ->when($publicOnly, fn (Builder $query) => $query
                ->publiclyAvailable())
            ->where('slug', trim($slug))
            ->first();

        return $model ? StoreMapper::toEntity($model) : null;
    }

    public function create(StoreEntity $store): StoreEntity
    {
        $model = StoreModel::query()->create(StoreMapper::toModel($store));
        $model->load('detail');

        return StoreMapper::toEntity($model);
    }

    public function update(StoreEntity $store, ?array $detailData = null): StoreEntity
    {
        $model = StoreModel::query()->with('detail')->findOrFail($store->id());
        $model->fill(StoreMapper::toModel($store))->save();

        if ($detailData !== null) {
            $current = $model->detail;
            $model->detail()->updateOrCreate(
                ['store_id' => $model->id],
                [
                    'owner_name' => $detailData['owner_name'] ?? $current?->owner_name,
                    'owner_phone' => $detailData['owner_phone'] ?? $current?->owner_phone,
                    'description' => $detailData['description'] ?? $current?->description,
                    'shipping_policy' => $detailData['shipping_policy'] ?? $current?->shipping_policy,
                    'return_policy' => $detailData['return_policy'] ?? $current?->return_policy,
                    'open_days' => $detailData['open_days'] ?? $current?->open_days,
                    'open_time' => $detailData['open_time'] ?? $current?->open_time,
                    'close_time' => $detailData['close_time'] ?? $current?->close_time,
                    'whatsapp_url' => $detailData['whatsapp_url'] ?? $current?->whatsapp_url,
                    'instagram_url' => $detailData['instagram_url'] ?? $current?->instagram_url,
                    'tiktok_url' => $detailData['tiktok_url'] ?? $current?->tiktok_url,
                    'website_url' => $detailData['website_url'] ?? $current?->website_url,
                ]
            );
        }

        $model->load('detail');

        return StoreMapper::toEntity($model);
    }

    public function listProductsByStoreSlug(string $slug, array $filters = []): CursorPaginator
    {
        $storeId = DB::table('stores')
            ->where('slug', trim($slug))
            ->whereRaw('LOWER(TRIM(status)) IN (?, ?)', ['approved', 'active'])
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if (! $storeId) {
            return new CursorPaginator(collect(), $filters['per_page'] ?? 24, $filters['cursor'] ?? null);
        }

        $perPage = max(1, min(50, (int) ($filters['per_page'] ?? 24)));

        return DB::table('products')
            ->join('stores', 'stores.id', '=', 'products.store_id')
            ->leftJoin('product_variants', function ($join): void {
                $join->on('product_variants.product_id', '=', 'products.id')
                    ->where('product_variants.is_default', '=', 1);
            })
            ->where('products.store_id', $storeId)
            ->where('products.is_active', true)
            ->whereRaw('LOWER(TRIM(products.status)) = ?', ['published'])
            ->whereNull('products.deleted_at')
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function ($query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function ($query) use ($search): void {
                    $query->where('products.name', 'like', "%{$search}%")
                        ->orWhere('products.brand', 'like', "%{$search}%");
                });
            })
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
                'product_variants.sku',
                'product_variants.price',
                'product_variants.stock',
            ])
            ->orderByDesc('products.created_at')
            ->orderByDesc('products.id')
            ->cursorPaginate($perPage);
    }

    private function applyStoreFilters(Builder $query, array $filters): void
    {
        $search = trim((string) ($filters['search'] ?? $filters['q'] ?? ''));

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $storeType = Str::lower(trim((string) ($filters['store_type'] ?? '')));

        if (in_array($storeType, ['regular', 'official', 'power_merchant'], true)) {
            $query->where('store_type', $storeType);
        }

        $locations = $this->normalizeListFilter($filters['locations'] ?? null);

        if ($locations !== []) {
            $query->where(function (Builder $query) use ($locations): void {
                foreach ($locations as $i => $location) {
                    $query->orWhere(function (Builder $query) use ($location): void {
                        $query->where('city', 'like', "%{$location}%")
                            ->orWhere('province', 'like', "%{$location}%");
                    });
                }
            });
        } elseif (($single = trim((string) ($filters['location'] ?? $filters['city'] ?? ''))) !== '') {
            $query->where(function (Builder $query) use ($single): void {
                $query->where('city', 'like', "%{$single}%")
                    ->orWhere('province', 'like', "%{$single}%");
            });
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', (string) $filters['status']);
        }

        if (array_key_exists('is_active', $filters) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if ((bool) ($filters['public_only'] ?? false)) {
            $query->publiclyAvailable();
        }
    }

    private function applyStoreSorting(Builder $query, array $filters): void
    {
        $direction = Str::lower(trim((string) ($filters['sort_direction'] ?? 'desc'))) === 'asc'
            ? 'asc'
            : 'desc';

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $sort = Str::lower(trim((string) ($filters['sort'] ?? '')));

        if ($sort === 'latest') {
            $query->orderByDesc('created_at')->orderByDesc('id');

            return;
        }

        $sortBy = $sort !== '' ? $sort : Str::lower(trim((string) ($filters['sort_by'] ?? 'created_at')));

        if ($sortBy === 'name') {
            $query->orderBy('name', $direction);
        } elseif ($sortBy === 'city') {
            $query->orderBy('city', $direction);
        } elseif ($sortBy === 'is_active') {
            $query->orderBy('is_active', $direction);
        } else {
            $query->orderBy('created_at', $direction);
        }

        if ($sortBy !== 'created_at') {
            $query->orderByDesc('id');
        }
    }

    private function resolvePerPage(array $filters, int $fallback): int
    {
        $perPage = (int) ($filters['per_page'] ?? $fallback);

        return min(max($perPage, 1), self::MAX_PER_PAGE);
    }

    private function normalizeListFilter(mixed $value): array
    {
        if (is_string($value)) {
            $value = [$value];
        }

        if (! is_array($value)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map(
            fn (mixed $item): string => trim((string) $item),
            $value
        ))));
    }

    private function storeListColumns(): array
    {
        return [
            'id',
            'user_id',
            'name',
            'slug',
            'description',
            'short_description',
            'phone',
            'email',
            'city',
            'province',
            'address',
            'status',
            'is_active',
            'store_type',
            'logo',
            'banner_url',
            'created_at',
            'updated_at',
        ];
    }
}
