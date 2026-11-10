<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Entities;

final class ProductVariant
{
    public function __construct(
        private readonly ?int $id,
        private readonly int $productId,
        private readonly int $storeId, // Ditambahkan sesuai perubahan tabel database
        private readonly string $sku,
        private readonly string $name,
        private readonly float $price,
        private readonly int $stock,
        private readonly ?int $poStock = 0,
        private readonly ?int $stockReserved = 0,
        private readonly ?int $stockBooked = 0,
        private readonly ?int $stockPreorder = 0,
        private readonly ?int $maxOrderQty = 999999,
        private readonly ?int $minStock = 0,
        private readonly ?bool $allowsPreorder = null,
        private readonly bool $isDefault = false,
        private readonly ?float $priceOriginal = null,
        private readonly ?float $priceSale = null,
        private readonly array $values = [],
        private readonly ?string $createdAt = null,
        private readonly ?string $updatedAt = null
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function productId(): int
    {
        return $this->productId;
    }

    public function storeId(): int
    {
        return $this->storeId;
    }

    public function sku(): string
    {
        return $this->sku;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function price(): float
    {
        return $this->price;
    }

    public function stock(): int
    {
        return $this->stock;
    }

    public function poStock(): int
    {
        return (int) $this->poStock;
    }

    public function stockReserved(): int
    {
        return (int) $this->stockReserved;
    }

    public function stockBooked(): int
    {
        return (int) $this->stockBooked;
    }

    public function stockPreorder(): int
    {
        return (int) $this->stockPreorder;
    }

    public function maxOrderQty(): int
    {
        return (int) $this->maxOrderQty;
    }

    public function minStock(): int
    {
        return (int) $this->minStock;
    }

    public function allowsPreorder(): ?bool
    {
        return $this->allowsPreorder;
    }

    public function availableStock(): int
    {
        return max(0, $this->stock() - $this->stockReserved() - $this->stockBooked());
    }

    public function totalStock(): int
    {
        return $this->stock() + $this->poStock();
    }

    public function isDefault(): bool
    {
        return $this->isDefault;
    }

    public function priceOriginal(): ?float
    {
        return $this->priceOriginal;
    }

    public function priceSale(): ?float
    {
        return $this->priceSale;
    }

    public function values(): array
    {
        return $this->values;
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
