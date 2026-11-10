<?php

namespace App\Domains\Order\Wishlist\Application\UseCases;

use App\Domains\Order\Wishlist\Domain\Repositories\WishlistRepositoryInterface;

class GetWishlistUseCase
{
    private WishlistRepositoryInterface $repository;

    public function __construct(WishlistRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(string $userId): array
    {
        return $this->repository->findItemsByUserId($userId);
    }
}
