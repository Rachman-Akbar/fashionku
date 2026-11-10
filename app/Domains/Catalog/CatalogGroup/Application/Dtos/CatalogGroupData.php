<?php

namespace App\Domains\Catalog\CatalogGroup\Application\Dtos;

final readonly class CatalogGroupData
{
    public function __construct(
        private ?string $name,
        private ?string $slug,
        private ?bool $isActive,
        private bool $hasName,
        private bool $hasSlug,
        private bool $hasIsActive
    ) {}

    public static function fromArray(array $data): self
    {
        $hasName = array_key_exists('name', $data);
        $hasSlug = array_key_exists('slug', $data);
        $hasIsActive = array_key_exists('is_active', $data) || array_key_exists('isActive', $data);

        return new self(
            name: $hasName ? self::normalizeString($data['name']) : null,
            slug: $hasSlug ? self::normalizeString($data['slug']) : null,
            isActive: $hasIsActive ? self::normalizeBoolean($data['is_active'] ?? $data['isActive'] ?? null) : null,
            hasName: $hasName,
            hasSlug: $hasSlug,
            hasIsActive: $hasIsActive
        );
    }

    public function hasName(): bool
    {
        return $this->hasName;
    }

    public function hasSlug(): bool
    {
        return $this->hasSlug;
    }

    public function hasIsActive(): bool
    {
        return $this->hasIsActive;
    }

    public function name(): ?string
    {
        return $this->name;
    }

    public function slug(): ?string
    {
        return $this->slug;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function nameOr(string $default): string
    {
        return $this->name ?? $default;
    }

    public function slugOr(?string $default): ?string
    {
        return $this->slug ?? $default;
    }

    public function isActiveOr(bool $default): bool
    {
        return $this->isActive ?? $default;
    }

    private static function normalizeString(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private static function normalizeBoolean(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
