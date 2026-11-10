<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Domain\Entities;

final class CatalogGroup
{
    public function __construct(
        private ?int $id,
        private string $name,
        private string $slug,
        private bool $isActive = true,
        private array $categories = []
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function slug(): string
    {
        return $this->slug;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function categories(): array
    {
        return $this->categories;
    }

    public function rename(string $name): void
    {
        $this->name = $name;
    }

    public function changeSlug(string $slug): void
    {
        $this->slug = $slug;
    }

    public function changeIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    public function changeCategories(array $categories): void
    {
        $this->categories = $categories;
    }

    public function updateData(array $data): void
    {
        if (array_key_exists('name', $data)) {
            $this->rename((string) $data['name']);
        }

        if (array_key_exists('slug', $data)) {
            $this->changeSlug((string) $data['slug']);
        }

        if (array_key_exists('is_active', $data)) {
            $this->changeIsActive((bool) $data['is_active']);
        }

        if (array_key_exists('categories', $data)) {
            $this->changeCategories((array) $data['categories']);
        }
    }
}
