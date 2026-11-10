<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Entities;

final class Product
{
    public function __construct(
        private readonly ?int $id,
        private readonly int $storeId,
        private readonly ?int $primaryCategoryId,
        private readonly string $name,
        private readonly string $slug,
        private readonly ?string $description,
        private readonly ?string $brand,
        private readonly ?string $thumbnail,
        private readonly string $status,
        private readonly bool $isActive,
        private readonly array $categoryIds = [],
        private readonly array $attributeValues = [],
        private readonly array $variants = [],
        private readonly array $images = [],
        private readonly array $store = [],
        private readonly float $averageRating = 0.0,
        private readonly int $reviewCount = 0,
        private readonly ?string $createdAt = null,
        private readonly ?string $updatedAt = null
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function storeId(): int
    {
        return $this->storeId;
    }

    public function primaryCategoryId(): ?int
    {
        return $this->primaryCategoryId;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function slug(): string
    {
        return $this->slug;
    }

    public function description(): ?string
    {
        return $this->description;
    }

    public function brand(): ?string
    {
        return $this->brand;
    }

    public function thumbnail(): ?string
    {
        return $this->thumbnail;
    }

    public function status(): string
    {
        return $this->status;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function categoryIds(): array
    {
        return $this->categoryIds;
    }

    public function attributeValues(): array
    {
        return $this->attributeValues;
    }

    public function variants(): array
    {
        return $this->variants;
    }

    public function images(): array
    {
        return $this->images;
    }

    public function store(): array
    {
        return $this->store;
    }

    public function averageRating(): float
    {
        return $this->averageRating;
    }

    public function reviewCount(): int
    {
        return $this->reviewCount;
    }

    public function createdAt(): ?string
    {
        return $this->createdAt;
    }

    public function updatedAt(): ?string
    {
        return $this->updatedAt;
    }
}
