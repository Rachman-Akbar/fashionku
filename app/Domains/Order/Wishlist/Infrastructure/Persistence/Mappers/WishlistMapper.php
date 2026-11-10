<?php

namespace App\Domains\Order\Wishlist\Infrastructure\Persistence\Mappers;

use App\Domains\Order\Wishlist\Domain\Entities\Wishlist;
use Illuminate\Support\Facades\DB;

class WishlistMapper
{
    public static function toDomain(object $wishlistRow): Wishlist
    {
        $wishlist = new Wishlist($wishlistRow->id, $wishlistRow->user_id, $wishlistRow->name);

        $items = DB::table('wishlist_items')->where('wishlist_id', $wishlistRow->id)->get();
        foreach ($items as $item) {
            $wishlist->addProduct($item->product_id);
        }

        return $wishlist;
    }
}
