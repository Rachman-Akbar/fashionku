<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class FinancialPaymentHistoryModel extends Model
{
    protected $table = 'financial_payment_histories';

    protected $fillable = ['financial_transaction_id', 'store_id', 'recorded_by', 'amount', 'balance_before', 'balance_after', 'payment_method', 'reference_number', 'notes', 'paid_at'];

    protected $casts = ['amount' => 'decimal:2', 'balance_before' => 'decimal:2', 'balance_after' => 'decimal:2', 'paid_at' => 'datetime'];
}
