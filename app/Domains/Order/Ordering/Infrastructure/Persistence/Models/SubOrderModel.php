<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Infrastructure\Persistence\Models;

use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubOrderModel extends Model
{
    protected $table = 'sub_orders';

    protected $guarded = ['id'];

    protected $casts = [
        'total_items_price' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'admin_fee' => 'decimal:2',
        'seller_net' => 'decimal:2',
    ];

    public function parentOrder(): BelongsTo
    {
        return $this->belongsTo(OrderModel::class, 'order_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItemModel::class, 'sub_order_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }
}
