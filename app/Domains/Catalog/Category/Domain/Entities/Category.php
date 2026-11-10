<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Domain\Entities;

final class Category
{
    public function __construct(
        private ?int $id,
        private int $catalogGroupId,
        private ?int $parentId,
        private string $name,
        private string $slug,
        private string $fullSlug,
        private ?string $imageUrl,
        private ?string $iconUrl,
        private int $level,
        private int $sortOrder,
        private int $productsCount,
        private bool $isActive,
        private bool $isVisibleInMenu,
        private array $children = [],
    ) {}

    public static function createNew(
        int $catalogGroupId,
        ?Category $parent,
        string $name,
        string $slug,
        int $sortOrder = 0,
        bool $isActive = true,
        bool $isVisibleInMenu = true,
        ?string $imageUrl = null,
        ?string $iconUrl = null,
    ): self {
        $level = $parent ? $parent->level() + 1 : 1;
        $parentId = $parent?->id();
        $finalCatalogGroupId = $parent?->catalogGroupId() ?? $catalogGroupId;
        $fullSlug = $parent ? $parent->fullSlug().'/'.$slug : $slug;

        return new self(
            id: null,
            catalogGroupId: $finalCatalogGroupId,
            parentId: $parentId,
            name: $name,
            slug: $slug,
            fullSlug: $fullSlug,
            imageUrl: $imageUrl,
            iconUrl: $iconUrl,
            level: $level,
            sortOrder: $sortOrder,
            productsCount: 0,
            isActive: $isActive,
            isVisibleInMenu: $isVisibleInMenu,
            children: [],
        );
    }

    public function updateData(array $data, ?Category $parent = null): void
    {
        if (array_key_exists('name', $data)) {
            $this->name = (string) $data['name'];
        }

        if (array_key_exists('slug', $data)) {
            $this->slug = (string) $data['slug'];
        }

        if (array_key_exists('image_url', $data)) {
            $this->imageUrl = $data['image_url'];
        }

        if (array_key_exists('icon_url', $data)) {
            $this->iconUrl = $data['icon_url'];
        }

        if (array_key_exists('sort_order', $data)) {
            $this->sortOrder = (int) $data['sort_order'];
        }

        if (array_key_exists('is_active', $data)) {
            $this->isActive = (bool) $data['is_active'];
        }

        if (array_key_exists('is_visible_in_menu', $data)) {
            $this->isVisibleInMenu = (bool) $data['is_visible_in_menu'];
        }

        if (array_key_exists('catalog_group_id', $data) && $data['catalog_group_id'] !== null) {
            $this->catalogGroupId = (int) $data['catalog_group_id'];
        }

        if (array_key_exists('parent_id', $data)) {
            if ($parent) {
                $this->syncWithParent($parent);
            } else {
                $this->parentId = null;
                $this->level = 1;
                $this->fullSlug = $this->slug;
            }

            return;
        }

        if ($parent) {
            $this->syncWithParent($parent);

            return;
        }

        if ($this->parentId === null) {
            $this->fullSlug = $this->slug;
        }
    }

    public function syncWithParent(Category $parent): void
    {
        $this->parentId = $parent->id();
        $this->catalogGroupId = $parent->catalogGroupId();
        $this->level = $parent->level() + 1;
        $this->fullSlug = $parent->fullSlug().'/'.$this->slug;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function setChildren(array $children): void
    {
        $this->children = $children;
    }

    public function addChild(Category $category): void
    {
        $this->children[] = $category;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function catalogGroupId(): int
    {
        return $this->catalogGroupId;
    }

    public function parentId(): ?int
    {
        return $this->parentId;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function slug(): string
    {
        return $this->slug;
    }

    public function fullSlug(): string
    {
        return $this->fullSlug;
    }

    public function imageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function iconUrl(): ?string
    {
        return $this->iconUrl;
    }

    public function level(): int
    {
        return $this->level;
    }

    public function sortOrder(): int
    {
        return $this->sortOrder;
    }

    public function productsCount(): int
    {
        return $this->productsCount;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function isVisibleInMenu(): bool
    {
        return $this->isVisibleInMenu;
    }

    public function children(): array
    {
        return $this->children;
    }
}
