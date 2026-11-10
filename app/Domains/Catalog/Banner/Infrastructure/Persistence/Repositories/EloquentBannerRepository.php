<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Banner\Domain\Entities\Banner;
use App\Domains\Catalog\Banner\Domain\Repositories\BannerRepositoryInterface;
use App\Domains\Catalog\Banner\Infrastructure\Persistence\Mappers\BannerMapper;
use App\Domains\Catalog\Banner\Infrastructure\Persistence\Models\BannerModel;
use Illuminate\Support\Str;

final class EloquentBannerRepository implements BannerRepositoryInterface
{
    public function getAll(array $filters = []): array
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return BannerModel::query()
            ->with('store:id,name,slug,status,is_active')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when(! empty($filters['store_id']), fn ($query) => $query->where('store_id', (int) $filters['store_id']))
            ->when(array_key_exists('is_active', $filters) && $filters['is_active'] !== '', function ($query) use ($filters): void {
                $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
            })
            ->orderBy('store_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (BannerModel $model): Banner => BannerMapper::toEntity($model))
            ->all();
    }

    public function getByStoreId(int $storeId, bool $includeInactive = false): array
    {
        return BannerModel::query()
            ->where('store_id', $storeId)
            ->when(! $includeInactive, fn ($query) => $query
                ->active()
                ->whereHas('store', fn ($storeQuery) => $storeQuery->publiclyAvailable()))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (BannerModel $model): Banner => BannerMapper::toEntity($model))
            ->all();
    }

    public function findById(int $id, bool $includeInactive = true): ?Banner
    {
        $model = BannerModel::query()
            ->when(! $includeInactive, fn ($query) => $query
                ->active()
                ->whereHas('store', fn ($storeQuery) => $storeQuery->publiclyAvailable()))
            ->find($id);

        return $model ? BannerMapper::toEntity($model) : null;
    }

    public function nameExistsForStore(string $name, int $storeId, ?int $ignoreId = null): bool
    {
        return BannerModel::withTrashed()
            ->where('store_id', $storeId)
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn ($query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function save(Banner $banner): Banner
    {
        $data = [
            'store_id' => $banner->storeId,
            'name' => $banner->name,
            'image_url' => $banner->imageUrl,
            'sort_order' => $banner->sortOrder,
            'is_active' => $banner->isActive,
        ];

        $model = $banner->id
            ? BannerModel::query()->findOrFail($banner->id)
            : new BannerModel;

        $model->fill($data)->save();

        return BannerMapper::toEntity($model->refresh());
    }

    public function delete(int $id): bool
    {
        $model = BannerModel::query()->find($id);

        return $model ? (bool) $model->delete() : false;
    }
}
