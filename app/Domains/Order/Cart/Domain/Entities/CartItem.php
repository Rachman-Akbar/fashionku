<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Domain\Entities;

use DomainException;

final class CartItem
{
    public function __construct(
        private readonly int $id,
        private readonly int $productVariantId,
        private int $quantity
    ) {
        if ($quantity <= 0) {
            throw new DomainException('Kuantitas item harus lebih dari 0.');
        }
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProductVariantId(): int
    {
        return $this->productVariantId;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function changeQuantity(int $newQuantity): void
    {
        if ($newQuantity <= 0) {
            throw new DomainException('Kuantitas tidak valid.');
        }
        $this->quantity = $newQuantity;
    }
}
