<?php

namespace App\Domains\Order\Wishlist\Application\UseCases;

use App\Domains\Order\Wishlist\Application\DTOs\WishlistInputDto;
use App\Domains\Order\Wishlist\Domain\Entities\Wishlist;
use App\Domains\Order\Wishlist\Domain\Repositories\WishlistRepositoryInterface;
use Illuminate\Support\Str;

class AddItemToWishlistUseCase
{
    private WishlistRepositoryInterface $repository;

    public function __construct(WishlistRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(WishlistInputDto $dto): void
    {
        $wishlist = $this->repository->findByUserId($dto->userId);

        if (! $wishlist) {
            // Generate UUID baru jika user belum memiliki wishlist
            $wishlist = new Wishlist(Str::uuid()->toString(), $dto->userId, 'Utama');
        }

        $wishlist->addProduct($dto->productId);

        $this->repository->save($wishlist);
    }
}
