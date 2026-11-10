<?php

namespace App\Domains\Order\Wishlist\Application\DTOs;

class WishlistInputDto
{
    // Ganti int menjadi string
    public function __construct(
        public readonly string $userId,
        public readonly int $productId
    ) {}
}
