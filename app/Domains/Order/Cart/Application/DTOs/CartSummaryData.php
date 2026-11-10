<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\DTOs;

final class CartSummaryData
{
    /**
     * @param array<int, array{
     * variant_id: int,
     * name: string,
     * sku: string,
     * price: int,
     * quantity: int,
     * subtotal: int,
     * attributes: array<string, string>
     * }> $items
     */
    public function __construct(
        public array $items,
        public int $totalItems,
        public int $totalPrice
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'items' => $this->items,
            'total_items' => $this->totalItems,
            'total_price' => $this->totalPrice,
        ];
    }
}
