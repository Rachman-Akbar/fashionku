<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderItemModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProductReviewModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'product_reviews';

    protected $fillable = [
        'product_id',
        'order_id',
        'order_item_id',
        'user_id',
        'rating',
        'review',
        'media',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'order_id' => 'integer',
        'order_item_id' => 'integer',
        'rating' => 'integer',
        'media' => 'array',
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(OrderModel::class, 'order_id');
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItemModel::class, 'order_item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
