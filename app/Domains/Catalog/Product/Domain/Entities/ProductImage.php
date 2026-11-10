<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Entities;

final class ProductImage
{
    public function __construct(
        private ?int $id,
        private int $productId,
        private string $url,
        private ?string $altText = null,
        private bool $isPrimary = false,
        private int $sortOrder = 0,
        private ?string $createdAt = null,
        private ?string $updatedAt = null
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function productId(): int
    {
        return $this->productId;
    }

    public function url(): string
    {
        return $this->url;
    }

    public function altText(): ?string
    {
        return $this->altText;
    }

    public function isPrimary(): bool
    {
        return $this->isPrimary;
    }

    public function sortOrder(): int
    {
        return $this->sortOrder;
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
