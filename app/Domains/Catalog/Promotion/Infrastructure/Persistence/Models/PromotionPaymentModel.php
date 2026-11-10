<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

final class PromotionPaymentModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'promotion_payments';

    protected $fillable = [
        'store_id',
        'user_id',
        'payment_number',
        'package_name',
        'amount',
        'payment_method',
        'proof_url',
        'status',
        'rejection_reason',
        'paid_at',
        'reviewed_at',
        'reviewed_by',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'store_id' => 'integer',
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function promotion(): HasOne
    {
        return $this->hasOne(PromotionModel::class, 'promotion_payment_id');
    }
}
