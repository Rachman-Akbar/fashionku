<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Domain\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class UserVoucher extends Model
{
    protected $table = 'user_vouchers';

    protected $fillable = [
        'user_id',
        'voucher_id',
        'source_type',
        'source_id',
        'status',
        'claimed_at',
        'used_at',
    ];

    protected $casts = [
        'voucher_id' => 'integer',
        'claimed_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }
}
