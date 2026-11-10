<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellerWithdrawalModel extends Model
{
    use SoftDeletes;

    protected $table = 'seller_withdrawals';

    protected $fillable = [
        'store_id',
        'user_id',
        'withdrawal_number',
        'amount',
        'method',
        'bank_details',
        'status',
        'rejection_reason',
        'processed_at',
        'processed_by',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'bank_details' => 'array',
        'is_active' => 'boolean',
        'processed_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(StoreModel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
