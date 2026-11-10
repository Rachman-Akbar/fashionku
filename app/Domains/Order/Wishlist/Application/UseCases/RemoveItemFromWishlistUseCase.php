<?php

namespace App\Domains\Order\Wishlist\Application\UseCases;

use App\Domains\Order\Wishlist\Domain\Repositories\WishlistRepositoryInterface;
use DomainException;

class RemoveItemFromWishlistUseCase
{
    private WishlistRepositoryInterface $repository;

    public function __construct(WishlistRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(string $userId, int $productId): void
    {
        $wishlist = $this->repository->findByUserId($userId);

        if (! $wishlist) {
            throw new DomainException('Wishlist tidak ditemukan.');
        }

        $wishlist->removeProduct($productId);

        $this->repository->save($wishlist);
    }
}
