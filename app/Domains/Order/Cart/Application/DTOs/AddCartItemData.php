<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\DTOs;

final class AddCartItemData
{
    public function __construct(
        public string $userId,
        public int $productVariantId,
        public int $quantity
    ) {}
}
