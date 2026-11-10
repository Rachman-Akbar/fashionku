<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Models;

use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellerSettlementModel extends Model
{
    use SoftDeletes;

    protected $table = 'seller_settlements';

    protected $fillable = [
        'store_id',
        'order_id',
        'sub_order_id',
        'settlement_number',
        'gross_amount',
        'admin_fee',
        'shipping_fee',
        'net_amount',
        'status',
        'settled_at',
        'notes',
        'metadata',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'admin_fee' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'settled_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(StoreModel::class);
    }

    public function order()
    {
        return $this->belongsTo(OrderModel::class);
    }

    public function subOrder()
    {
        return $this->belongsTo(SubOrderModel::class);
    }
}
