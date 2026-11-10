<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Mappers\CategoryMapper;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function findById(int $id, bool $includeInactive = false): ?Category
    {
        $model = $this->query($includeInactive)
            ->with(['childrenTree' => fn ($query) => $includeInactive ? $query : $query->active()])
            ->find($id);

        return $model ? CategoryMapper::toEntity($model) : null;
    }

    public function findBySlug(string $slug, bool $includeInactive = false): ?Category
    {
        $slug = $this->normalizePath($slug);

        if ($slug === '') {
            return null;
        }

        $model = $this->query($includeInactive)
            ->with(['childrenTree' => fn ($query) => $includeInactive ? $query : $query->active()])
            ->where('slug', $slug)
            ->first();

        return $model ? CategoryMapper::toEntity($model) : null;
    }

    public function findByPath(string $path, bool $includeInactive = false): ?Category
    {
        $path = $this->normalizePath($path);

        if ($path === '') {
            return null;
        }

        $model = $this->query($includeInactive)
            ->with(['childrenTree' => fn ($query) => $includeInactive ? $query : $query->active()])
            ->where(function (Builder $query) use ($path): void {
                $query->where('full_slug', $path);

                if (! str_contains($path, '/')) {
                    $query->orWhere('slug', $path);
                }
            })
            ->first();

        return $model ? CategoryMapper::toEntity($model) : null;
    }

    public function findByFullSlug(string $fullSlug, bool $includeInactive = false): ?Category
    {
        return $this->findByPath($fullSlug, $includeInactive);
    }

    public function listTree(bool $includeInactive = false): array
    {
        return $this->buildTreeFromRows(
            $this->categoryRows(false, $includeInactive)
        );
    }

    public function listMenuTree(): array
    {
        return $this->buildTreeFromRows(
            $this->categoryRows(true, false)
        );
    }

    public function findChildrenByParentId(int $parentId, bool $includeInactive = true): array
    {
        return $this->query($includeInactive)
            ->where('parent_id', $parentId)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (CategoryModel $model): Category => CategoryMapper::toEntity($model))
            ->all();
    }

    public function isDescendantOf(int $categoryId, int $possibleDescendantId): bool
    {
        if ($categoryId === $possibleDescendantId) {
            return false;
        }

        $current = CategoryModel::query()->find($possibleDescendantId);

        while ($current && $current->parent_id !== null) {
            if ((int) $current->parent_id === $categoryId) {
                return true;
            }

            $current = CategoryModel::query()->find((int) $current->parent_id);
        }

        return false;
    }

    public function maxDepthFrom(int $categoryId): int
    {
        $childIds = CategoryModel::query()
            ->where('parent_id', $categoryId)
            ->pluck('id')
            ->map(fn (mixed $id): int => (int) $id)
            ->all();

        if ($childIds === []) {
            return 1;
        }

        $maxDepth = 1;

        foreach ($childIds as $childId) {
            $maxDepth = max($maxDepth, 1 + $this->maxDepthFrom($childId));
        }

        return $maxDepth;
    }

    public function nameExistsInParent(
        int $catalogGroupId,
        ?int $parentId,
        string $name,
        ?int $ignoreId = null
    ): bool {
        return CategoryModel::withTrashed()
            ->where('catalog_group_id', $catalogGroupId)
            ->when(
                $parentId === null,
                fn (Builder $query) => $query->whereNull('parent_id'),
                fn (Builder $query) => $query->where('parent_id', $parentId)
            )
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function save(Category $category): Category
    {
        $model = $category->id()
            ? CategoryModel::query()->findOrFail($category->id())
            : new CategoryModel;

        $model->catalog_group_id = $category->catalogGroupId();
        $model->parent_id = $category->parentId();
        $model->parent_scope_id = $category->parentId() ?? 0;
        $model->level = $category->level();
        $model->sort_order = $category->sortOrder();
        $model->is_active = $category->isActive();
        $model->is_visible_in_menu = $category->isVisibleInMenu();
        $model->name = $category->name();
        $model->slug = $category->slug();
        $model->full_slug = $category->fullSlug();
        $model->image_url = $category->imageUrl();
        $model->icon_url = $category->iconUrl();
        $model->save();

        $this->clearCache();

        return CategoryMapper::toEntity(
            $model->refresh()->load('childrenTree')
        );
    }

    public function delete(int $id): bool
    {
        $model = CategoryModel::query()->find($id);

        if (! $model) {
            return false;
        }

        $deleted = (bool) $model->delete();

        if ($deleted) {
            $this->clearCache();
        }

        return $deleted;
    }

    private function query(bool $includeInactive): Builder
    {
        $query = CategoryModel::query();

        if ($includeInactive) {
            return $query;
        }

        return $query
            ->active()
            ->whereHas('catalogGroup', fn (Builder $groupQuery) => $groupQuery->active());
    }

    private function normalizePath(string $path): string
    {
        return trim(rawurldecode($path), '/');
    }

    private function categoryRows(bool $menuOnly, bool $includeInactive): array
    {
        return Cache::remember(
            $this->categoryRowsCacheKey($menuOnly, $includeInactive),
            now()->addHour(),
            function () use ($menuOnly, $includeInactive): array {
                return $this->query($includeInactive)
                    ->select([
                        'id',
                        'catalog_group_id',
                        'parent_id',
                        'level',
                        'sort_order',
                        'is_active',
                        'is_visible_in_menu',
                        'name',
                        'slug',
                        'full_slug',
                        'image_url',
                        'icon_url',
                    ])
                    ->withCount([
                        'products' => fn ($query) => $includeInactive
                            ? $query
                            : $query
                                ->where('products.is_active', true)
                                ->whereRaw('LOWER(TRIM(products.status)) = ?', ['published'])
                                ->whereHas('store', fn (Builder $storeQuery) => $storeQuery->publiclyAvailable()),
                    ])
                    ->where('level', '<=', 3)
                    ->when($menuOnly, fn (Builder $query) => $query->where('is_visible_in_menu', true))
                    ->orderBy('level')
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (CategoryModel $model): array => [
                        'id' => (int) $model->id,
                        'catalog_group_id' => (int) $model->catalog_group_id,
                        'parent_id' => $model->parent_id !== null ? (int) $model->parent_id : null,
                        'level' => (int) $model->level,
                        'sort_order' => (int) $model->sort_order,
                        'is_active' => (bool) $model->is_active,
                        'is_visible_in_menu' => (bool) $model->is_visible_in_menu,
                        'name' => (string) $model->name,
                        'slug' => (string) $model->slug,
                        'full_slug' => (string) $model->full_slug,
                        'image_url' => $model->image_url,
                        'icon_url' => $model->icon_url,
                        'products_count' => (int) ($model->products_count ?? 0),
                    ])
                    ->all();
            }
        );
    }

    private function categoryRowsCacheKey(bool $menuOnly, bool $includeInactive): string
    {
        if ($menuOnly) {
            return 'catalog_categories_menu_rows_active_v3';
        }

        return $includeInactive
            ? 'catalog_categories_tree_rows_manage_v3'
            : 'catalog_categories_tree_rows_active_v3';
    }

    private function buildTreeFromRows(array $rows): array
    {
        $entities = [];
        $roots = [];

        foreach ($rows as $row) {
            $entities[(int) $row['id']] = CategoryMapper::toEntityFromArray($row);
        }

        foreach ($entities as $entity) {
            $parentId = $entity->parentId();

            if ($parentId !== null && isset($entities[$parentId])) {
                $entities[$parentId]->addChild($entity);

                continue;
            }

            $roots[] = $entity;
        }

        return $roots;
    }

    private function clearCache(): void
    {
        Cache::forget('catalog_categories_tree_rows_manage_v3');
        Cache::forget('catalog_categories_tree_rows_active_v3');
        Cache::forget('catalog_categories_menu_rows_active_v3');
    }
}
