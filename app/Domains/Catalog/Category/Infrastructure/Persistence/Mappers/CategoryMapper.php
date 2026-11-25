<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;

final class CategoryMapper
{
    public static function toEntity(CategoryModel $model): Category
    {
        $children = [];

        if ($model->relationLoaded('childrenTree')) {
            $children = $model->childrenTree
                ->map(fn (CategoryModel $child) => self::toEntity($child))
                ->all();
        }

        if ($model->relationLoaded('children')) {
            $children = $model->children
                ->map(fn (CategoryModel $child) => self::toEntity($child))
                ->all();
        }

        return new Category(
            id: (int) $model->id,
            parentId: $model->parent_id !== null ? (int) $model->parent_id : null,
            name: (string) $model->name,
            slug: (string) $model->slug,
            fullSlug: (string) $model->full_slug,
            imageUrl: $model->image_url,
            iconUrl: $model->icon_url,
            level: (int) $model->level,
            sortOrder: (int) $model->sort_order,
            productsCount: (int) ($model->getAttribute('products_count') ?? 0),
            isActive: (bool) $model->is_active,
            isVisibleInMenu: (bool) $model->is_visible_in_menu,
            children: $children,
            parentScopeId: (int) ($model->parent_scope_id ?? 0),
            parent: $model->relationLoaded('parent') && $model->parent
                ? ['id' => $model->parent->id, 'name' => $model->parent->name]
                : null,
            createdByUser: $model->created_by
                ? ['id' => $model->created_by, 'name' => $model->relationLoaded('creator') ? $model->creator?->name : null]
                : null,
            updatedByUser: $model->updated_by
                ? ['id' => $model->updated_by, 'name' => $model->relationLoaded('updater') ? $model->updater?->name : null]
                : null,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
            deletedAt: $model->deleted_at?->toDateTimeString(),
        );
    }

    public static function toEntityFromArray(array|object $data): Category
    {
        $data = (array) $data;

        // Tambahkan pengecekan $data['children'] untuk menangkap kategori turunan
        $categoriesData = $data['children'] ?? $data['children_tree'] ?? [];

        // Map secara rekursif
        $children = collect($categoriesData)
            ->map(fn ($child) => self::toEntityFromArray((array) $child))
            ->all();

        return new Category(
            id: isset($data['id']) ? (int) $data['id'] : null,
            parentId: isset($data['parent_id']) ? (int) $data['parent_id'] : null,
            name: (string) ($data['name'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            fullSlug: (string) ($data['full_slug'] ?? ''),
            imageUrl: $data['image_url'] ?? null,
            iconUrl: $data['icon_url'] ?? null,
            level: (int) ($data['level'] ?? 1),
            sortOrder: (int) ($data['sort_order'] ?? 0),
            productsCount: (int) ($data['products_count'] ?? 0),
            isActive: (bool) ($data['is_active'] ?? true),
            isVisibleInMenu: (bool) ($data['is_visible_in_menu'] ?? true),
            children: $children,
            parentScopeId: isset($data['parent_scope_id']) ? (int) $data['parent_scope_id'] : null,
            parent: $data['parent'] ?? null,
            createdByUser: $data['created_by_user'] ?? null,
            updatedByUser: $data['updated_by_user'] ?? null,
            createdAt: $data['created_at'] ?? null,
            updatedAt: $data['updated_at'] ?? null,
            deletedAt: $data['deleted_at'] ?? null,
        );
    }
}
