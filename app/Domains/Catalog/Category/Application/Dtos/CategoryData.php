<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Dtos;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use Illuminate\Support\Str;
use InvalidArgumentException;

final readonly class CategoryData
{
    private function __construct(
        private ?int $catalogGroupId,
        private bool $hasCatalogGroupId,
        private ?int $parentId,
        private bool $hasParentId,
        private ?string $name,
        private bool $hasName,
        private ?string $slug,
        private bool $hasSlug,
        private ?string $imageUrl,
        private bool $hasImageUrl,
        private ?string $iconUrl,
        private bool $hasIconUrl,
        private ?int $sortOrder,
        private bool $hasSortOrder,
        private ?bool $isActive,
        private bool $hasIsActive,
        private ?bool $isVisibleInMenu,
        private bool $hasIsVisibleInMenu,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            catalogGroupId: self::nullableInt($data, 'catalog_group_id'),
            hasCatalogGroupId: array_key_exists('catalog_group_id', $data),
            parentId: self::nullableInt($data, 'parent_id'),
            hasParentId: array_key_exists('parent_id', $data),
            name: self::nullableString($data, 'name'),
            hasName: array_key_exists('name', $data),
            slug: self::nullableString($data, 'slug'),
            hasSlug: array_key_exists('slug', $data),
            imageUrl: self::nullableString($data, 'image_url'),
            hasImageUrl: array_key_exists('image_url', $data),
            iconUrl: self::nullableString($data, 'icon_url'),
            hasIconUrl: array_key_exists('icon_url', $data),
            sortOrder: self::nullableInt($data, 'sort_order'),
            hasSortOrder: array_key_exists('sort_order', $data),
            isActive: self::nullableBool($data, 'is_active'),
            hasIsActive: array_key_exists('is_active', $data),
            isVisibleInMenu: self::nullableBool($data, 'is_visible_in_menu'),
            hasIsVisibleInMenu: array_key_exists('is_visible_in_menu', $data),
        );
    }

    public function hasParentId(): bool
    {
        return $this->hasParentId;
    }

    public function parentId(): ?int
    {
        return $this->parentId;
    }

    public function toCreatePayload(?Category $parent): array
    {
        $name = $this->requireName();

        return [
            'catalog_group_id' => $parent?->catalogGroupId() ?? $this->requireCatalogGroupId(),
            'name' => $name,
            'slug' => $this->slugOrGenerated($name),
            'sort_order' => $this->sortOrder ?? 0,
            'is_active' => $this->isActive ?? true,
            'is_visible_in_menu' => $this->isVisibleInMenu ?? true,
            'image_url' => $this->imageUrl,
            'icon_url' => $this->iconUrl,
        ];
    }

    public function toUpdatePayload(Category $category): array
    {
        $payload = [];

        if ($this->hasCatalogGroupId && $this->catalogGroupId !== null) {
            $payload['catalog_group_id'] = $this->catalogGroupId;
        }

        if ($this->hasParentId) {
            $payload['parent_id'] = $this->parentId;
        }

        if ($this->hasName) {
            $payload['name'] = $this->requireName();
        }

        if ($this->hasSlug || $this->hasName) {
            $baseName = $payload['name'] ?? $category->name();
            $payload['slug'] = $this->slugOrGenerated($baseName);
        }

        if ($this->hasImageUrl) {
            $payload['image_url'] = $this->imageUrl;
        }

        if ($this->hasIconUrl) {
            $payload['icon_url'] = $this->iconUrl;
        }

        if ($this->hasSortOrder) {
            $payload['sort_order'] = $this->sortOrder ?? 0;
        }

        if ($this->hasIsActive) {
            $payload['is_active'] = $this->isActive ?? false;
        }

        if ($this->hasIsVisibleInMenu) {
            $payload['is_visible_in_menu'] = $this->isVisibleInMenu ?? false;
        }

        return $payload;
    }

    private function requireName(): string
    {
        if ($this->name === null) {
            throw new InvalidArgumentException('Nama kategori wajib diisi.');
        }

        return $this->name;
    }

    private function requireCatalogGroupId(): int
    {
        if ($this->catalogGroupId === null || $this->catalogGroupId <= 0) {
            throw new InvalidArgumentException('Catalog group wajib diisi untuk kategori utama.');
        }

        return $this->catalogGroupId;
    }

    private function slugOrGenerated(string $name): string
    {
        return $this->slug ?: Str::slug($name);
    }

    private static function nullableInt(array $data, string $key): ?int
    {
        if (! array_key_exists($key, $data)) {
            return null;
        }

        if ($data[$key] === null || $data[$key] === '') {
            return null;
        }

        return (int) $data[$key];
    }

    private static function nullableString(array $data, string $key): ?string
    {
        if (! array_key_exists($key, $data)) {
            return null;
        }

        if ($data[$key] === null) {
            return null;
        }

        $value = trim((string) $data[$key]);

        return $value === '' ? null : $value;
    }

    private static function nullableBool(array $data, string $key): ?bool
    {
        if (! array_key_exists($key, $data)) {
            return null;
        }

        if ($data[$key] === null || $data[$key] === '') {
            return null;
        }

        $value = filter_var($data[$key], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        return $value ?? false;
    }
}
