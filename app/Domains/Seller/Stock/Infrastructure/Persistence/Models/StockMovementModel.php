<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderItemModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class StockMovementModel extends Model
{
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'stock_movements';

    protected $fillable = [
        'store_id',
        'product_id',
        'variant_id',
        'order_id',
        'order_item_id',
        'movement_key',
        'type',
        'quantity_delta',
        'balance_after',
        'stock_dimension',
        'reference_type',
        'reference_id',
        'notes',
        'occurred_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'store_id' => 'integer',
        'product_id' => 'integer',
        'variant_id' => 'integer',
        'order_id' => 'integer',
        'order_item_id' => 'integer',
        'quantity_delta' => 'integer',
        'balance_after' => 'integer',
        'occurred_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariantModel::class, 'variant_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(OrderModel::class, 'order_id');
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItemModel::class, 'order_item_id');
    }
}
