<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Domain\ValueObjects;

final class VariantDetails
{
    public function __construct(
        private readonly int $id,
        private readonly int $productId,
        private readonly string $name,
        private readonly string $productName,
        private readonly int $storeId,
        private readonly string $storeName,
        private readonly string $sku,
        private readonly Money $price,
        private readonly int $stock,
        private readonly int $weight,
        private readonly ?string $thumbnail,
        private readonly array $attributes = []
    ) {}

    public function getId(): int
    {
        return $this->id;
    }

    public function getProductId(): int
    {
        return $this->productId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getProductName(): string
    {
        return $this->productName;
    }

    public function getStoreId(): int
    {
        return $this->storeId;
    }

    public function getStoreName(): string
    {
        return $this->storeName;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getPrice(): Money
    {
        return $this->price;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function getWeight(): int
    {
        return $this->weight;
    }

    public function getThumbnail(): ?string
    {
        return $this->thumbnail;
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }
}
