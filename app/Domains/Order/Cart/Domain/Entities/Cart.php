<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Domain\Entities;

use DomainException;

final class Cart
{
    /**
     * @param  CartItem[]  $items
     */
    public function __construct(
        private readonly int $id,
        private readonly string $userId,
        private array $items = []
    ) {}

    public function getId(): int
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    /**
     * @return CartItem[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    public function addItem(int $productVariantId, int $quantity, int $availableStock): void
    {
        // Cari apakah varian produk ini sudah ada di keranjang
        foreach ($this->items as $item) {
            if ($item->getProductVariantId() === $productVariantId) {
                $newQuantity = $item->getQuantity() + $quantity;
                if ($newQuantity > $availableStock) {
                    throw new DomainException('Stok tidak mencukupi untuk menambahkan barang.');
                }
                $item->changeQuantity($newQuantity);

                return;
            }
        }

        if ($quantity > $availableStock) {
            throw new DomainException('Stok varian produk tidak mencukupi.');
        }

        // Id 0 menandakan item baru yang belum tersimpan di database instan
        $this->items[] = new CartItem(0, $productVariantId, $quantity);
    }
}
