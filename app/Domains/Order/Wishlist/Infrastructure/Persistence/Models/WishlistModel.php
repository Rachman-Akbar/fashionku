<?php

namespace App\Domains\Order\Wishlist\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

class WishlistModel extends Model
{
    protected $table = 'wishlists';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['id', 'user_id', 'name'];
}
