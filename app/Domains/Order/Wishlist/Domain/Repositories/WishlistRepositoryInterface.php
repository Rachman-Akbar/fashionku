<?php

namespace App\Domains\Order\Wishlist\Domain\Repositories;

use App\Domains\Order\Wishlist\Domain\Entities\Wishlist;

interface WishlistRepositoryInterface
{
    public function findByUserId(string $userId): ?Wishlist;

    public function findItemsByUserId(string $userId): array; // Tambahan untuk Read CRUD

    public function save(Wishlist $wishlist): void;
}
