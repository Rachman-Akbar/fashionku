<?php

declare(strict_types=1);

namespace App\Domains\Order\Wishlist\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Wishlist\Domain\Entities\Wishlist;
use App\Domains\Order\Wishlist\Domain\Repositories\WishlistRepositoryInterface;
use App\Domains\Order\Wishlist\Infrastructure\Persistence\Mappers\WishlistMapper;
use Illuminate\Support\Facades\DB;

final class EloquentWishlistRepository implements WishlistRepositoryInterface
{
    public function findByUserId(string $userId): ?Wishlist
    {
        $wishlistRow = DB::table('wishlists')->where('user_id', $userId)->first();

        return $wishlistRow ? WishlistMapper::toDomain($wishlistRow) : null;
    }

    public function findItemsByUserId(string $userId): array
    {
        return DB::table('wishlist_items')
            ->join('wishlists', 'wishlist_items.wishlist_id', '=', 'wishlists.id')
            ->join('products', 'wishlist_items.product_id', '=', 'products.id')
            ->join('stores', 'stores.id', '=', 'products.store_id')
            ->where('wishlists.user_id', $userId)
            ->where('products.is_active', true)
            ->where('products.status', 'published')
            ->whereNull('products.deleted_at')
            ->where('stores.status', 'approved')
            ->where('stores.is_active', true)
            ->whereNull('stores.deleted_at')
            ->select([
                'products.id',
                'products.name',
                'products.slug',
                'products.brand',
                'products.thumbnail',
                'products.status',
            ])
            ->get()
            ->all();
    }

    public function save(Wishlist $wishlist): void
    {
        DB::transaction(function () use ($wishlist): void {
            DB::table('wishlists')->updateOrInsert(
                ['id' => $wishlist->getId()],
                [
                    'user_id' => $wishlist->getUserId(),
                    'name' => $wishlist->getName(),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            DB::table('wishlist_items')
                ->where('wishlist_id', $wishlist->getId())
                ->delete();

            foreach ($wishlist->getItems() as $item) {
                DB::table('wishlist_items')->insert([
                    'wishlist_id' => $wishlist->getId(),
                    'product_id' => $item->getProductId(),
                    'added_at' => now(),
                ]);
            }
        });
    }
}
