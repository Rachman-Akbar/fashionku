<?php

namespace App\Domains\Order\Wishlist\Domain\Entities;

use DomainException;

class Wishlist
{
    private string $id;

    private string $userId;

    private string $name;

    /** @var WishlistItem[] */
    private array $items = [];

    public function __construct(string $id, string $userId, string $name)
    {
        $this->id = $id;
        $this->userId = $userId;
        $this->name = $name;
    }

    public function addProduct(int $productId): void
    {
        foreach ($this->items as $item) {
            if ($item->getProductId() === $productId) {
                throw new DomainException('Produk sudah ada di dalam wishlist.');
            }
        }
        $this->items[] = new WishlistItem($productId);
    }

    public function removeProduct(int $productId): void
    {
        $initialCount = count($this->items);

        $this->items = array_filter($this->items, function ($item) use ($productId) {
            return $item->getProductId() !== $productId;
        });

        if (count($this->items) === $initialCount) {
            throw new DomainException('Produk tidak ditemukan di dalam wishlist Anda.');
        }
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /** @return WishlistItem[] */
    public function getItems(): array
    {
        return array_values($this->items);
    }
}
