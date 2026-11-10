<?php

namespace App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Models\CatalogGroupModel;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Mappers\CategoryMapper;

final class CatalogGroupMapper
{
    public static function toEntity(CatalogGroupModel $model): CatalogGroup
    {
        $categories = [];

        if ($model->relationLoaded('categories')) {
            $categories = $model->categories
                ->map(fn ($cat) => CategoryMapper::toEntity($cat))
                ->all();
        }

        return new CatalogGroup(
            id: $model->id,
            name: $model->name,
            slug: $model->slug,
            isActive: (bool) $model->is_active,
            categories: $categories
        );
    }

    public static function toModel(CatalogGroup $group): CatalogGroupModel
    {
        $model = new CatalogGroupModel([
            'name' => $group->name(),
            'slug' => $group->slug(),
            'is_active' => $group->isActive(),
        ]);

        // Krusial untuk CRUD Update: Pasang kembali ID jika entitas memilikinya
        if ($group->id() !== null) {
            $model->id = $group->id();
            $model->exists = true;
        }

        return $model;
    }

    public static function toEntityFromArray(array|object $data): CatalogGroup
    {
        if ($data instanceof \__PHP_Incomplete_Class) {
            throw new \RuntimeException(
                'Corrupted cache detected. Please clear cache.'
            );
        }

        $data = (array) $data;

        $categories = collect($data['categories'] ?? [])
            ->map(fn ($cat) => CategoryMapper::toEntityFromArray((array) $cat))
            ->all();

        return new CatalogGroup(
            id: $data['id'] ?? null,
            name: $data['name'],
            slug: $data['slug'],
            isActive: (bool) ($data['is_active'] ?? true),
            categories: $categories
        );
    }
}
