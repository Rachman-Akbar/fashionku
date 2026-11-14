<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Infrastructure\Persistence\Models;

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
    ];

    public function parentOrder(): BelongsTo
    {
        return $this->belongsTo(OrderModel::class, 'order_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItemModel::class, 'sub_order_id');
    }
}
