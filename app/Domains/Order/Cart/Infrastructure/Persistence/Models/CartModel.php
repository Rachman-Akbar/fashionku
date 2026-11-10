<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class CartModel extends Model
{
    protected $table = 'carts';

    protected $fillable = [
        'user_id',
    ];

    /**
     * @return HasMany<CartItemModel, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItemModel::class, 'cart_id');
    }
}
