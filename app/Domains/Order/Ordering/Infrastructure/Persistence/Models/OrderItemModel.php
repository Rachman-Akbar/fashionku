<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemModel extends Model
{
    protected $table = 'order_items';

    protected $guarded = ['id'];

    public function subOrder(): BelongsTo
    {
        return $this->belongsTo(SubOrderModel::class, 'sub_order_id');
    }
}
