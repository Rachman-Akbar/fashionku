<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Mappers\CatalogGroupMapper;
use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Models\CatalogGroupModel;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Mappers\CategoryMapper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class EloquentCatalogGroupRepository implements CatalogGroupRepositoryInterface
{
    public function getAll(array $filters = [], bool $includeInactive = false): Collection
    {
        $withCategories = filter_var(
            $filters['include_categories'] ?? true,
            FILTER_VALIDATE_BOOLEAN,
            FILTER_NULL_ON_FAILURE
        ) ?? true;
        $groups = $this->freshCatalogGroupsAsArray($filters, $includeInactive, $withCategories);

        return collect($groups)->map(
            fn (array $item): CatalogGroup => CatalogGroupMapper::toEntityFromArray($item)
        );
    }

    public function findById(int $id, bool $includeInactive = false): ?CatalogGroup
    {
        $model = $this->baseQuery(true, $includeInactive)->find($id);

        return $model ? CatalogGroupMapper::toEntityFromArray($this->mapGroupToArray($model)) : null;
    }

    public function findBySlug(string $slug, bool $includeInactive = false): ?CatalogGroup
    {
        $model = $this->baseQuery(true, $includeInactive)
            ->where('slug', $slug)
            ->first();

        return $model ? CatalogGroupMapper::toEntityFromArray($this->mapGroupToArray($model)) : null;
    }

    public function getCategoriesByGroupId(int $groupId): Collection
    {
        $model = CatalogGroupModel::query()->active()->findOrFail($groupId);

        return collect($this->mapCategoriesToArray(
            $model->categories()
                ->active()
                ->where('is_visible_in_menu', true)
                ->withCount([
                    'products' => fn ($query) => $query
                        ->where('products.is_active', true)
                        ->whereRaw('LOWER(TRIM(products.status)) = ?', ['published'])
                        ->whereHas('store', fn (Builder $storeQuery) => $storeQuery->publiclyAvailable()),
                ])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
        ))->map(fn (array $item) => CategoryMapper::toEntityFromArray($item));
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        return CatalogGroupModel::withTrashed()
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function save(CatalogGroup $catalogGroup): CatalogGroup
    {
        $model = $catalogGroup->id()
            ? CatalogGroupModel::query()->findOrFail($catalogGroup->id())
            : new CatalogGroupModel;

        $model->name = $catalogGroup->name();
        $model->slug = $catalogGroup->slug();
        $model->is_active = $catalogGroup->isActive();
        $model->save();
        $model->setRelation('categories', collect());

        return CatalogGroupMapper::toEntity($model);
    }

    public function delete(int $id): bool
    {
        $model = CatalogGroupModel::query()->find($id);

        if (! $model) {
            return false;
        }

        $deleted = (bool) $model->delete();

        return $deleted;
    }

    public function clearCache(): void {}

    private function baseQuery(bool $withCategories, bool $includeInactive): Builder
    {
        $query = CatalogGroupModel::query()->select(['id', 'name', 'slug', 'is_active']);

        if (! $includeInactive) {
            $query->active();
        }

        if (! $withCategories) {
            return $query;
        }

        return $query->with([
            'categories' => function ($query) use ($includeInactive): void {
                if (! $includeInactive) {
                    $query->active()->where('is_visible_in_menu', true);
                }

                $query
                    ->withCount([
                        'products' => fn ($products) => $includeInactive
                            ? $products
                            : $products
                                ->where('products.is_active', true)
                                ->whereRaw('LOWER(TRIM(products.status)) = ?', ['published'])
                                ->whereHas('store', fn (Builder $storeQuery) => $storeQuery->publiclyAvailable()),
                    ])
                    ->select([
                        'id',
                        'catalog_group_id',
                        'parent_id',
                        'name',
                        'slug',
                        'full_slug',
                        'image_url',
                        'icon_url',
                        'sort_order',
                        'level',
                        'is_active',
                        'is_visible_in_menu',
                    ])
                    ->orderBy('sort_order')
                    ->orderBy('name');
            },
        ]);
    }

    private function freshCatalogGroupsAsArray(
        array $filters,
        bool $includeInactive,
        bool $withCategories
    ): array {
        $models = $this->baseQuery($withCategories, $includeInactive)
            ->when(array_key_exists('is_active', $filters), function (Builder $query) use ($filters): void {
                $active = filter_var(
                    $filters['is_active'],
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE
                );
                $query->where('is_active', $active ?? (bool) $filters['is_active']);
            })
            ->orderBy('name')
            ->get();

        return $models->map(fn (CatalogGroupModel $model): array => $this->mapGroupToArray($model))->all();
    }

    private function mapGroupToArray(CatalogGroupModel $model): array
    {
        return [
            'id' => $model->id,
            'name' => $model->name,
            'slug' => $model->slug,
            'is_active' => (bool) $model->is_active,
            'categories' => $model->relationLoaded('categories')
                ? $this->mapCategoriesToArray($model->categories)
                : [],
        ];
    }

    private function mapCategoriesToArray(Collection $categories): array
    {
        return $categories->map(fn ($category): array => [
            'id' => $category->id,
            'catalog_group_id' => $category->catalog_group_id,
            'parent_id' => $category->parent_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'full_slug' => $category->full_slug,
            'image_url' => $category->image_url,
            'icon_url' => $category->icon_url,
            'level' => (int) $category->level,
            'sort_order' => (int) $category->sort_order,
            'products_count' => (int) ($category->products_count ?? 0),
            'is_active' => (bool) $category->is_active,
            'is_visible_in_menu' => (bool) $category->is_visible_in_menu,
            'children' => [],
        ])->all();
    }
}
