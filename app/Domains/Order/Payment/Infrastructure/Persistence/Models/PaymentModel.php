<?php

namespace App\Domains\Order\Payment\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentModel extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'order_number',
        'transaction_id',
        'payment_method',
        'amount',
        'status',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'amount' => 'float',
    ];
}
