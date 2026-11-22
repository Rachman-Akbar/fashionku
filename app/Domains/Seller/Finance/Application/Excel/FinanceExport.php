<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FinanceExport extends BaseExport
{
    public function __construct(protected ?Collection $transactions = null) {}

    public function collection(): Collection
    {
        return $this->transactions ?? DB::table('financial_transactions')
            ->leftJoin('users', 'users.id', '=', 'financial_transactions.user_id')
            ->leftJoin('orders', 'orders.id', '=', 'financial_transactions.order_id')
            ->select(
                'financial_transactions.*',
                'users.name as counterparty_name',
                'orders.order_number'
            )
            ->orderBy('financial_transactions.occurred_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'kode_keuangan',
            'tanggal',
            'kategori',
            'tipe',
            'judul',
            'deskripsi',
            'jumlah',
            'terbayar',
            'status',
            'jatuh_tempo',
            'tanggal_terbayar',
            'kode_referensi',
            'pihak_ke',
            'catatan',
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->reference_number ?? '',
            $transaction->occurred_at ? \Carbon\Carbon::parse($transaction->occurred_at)->format('Y-m-d') : '',
            $transaction->category ?? '',
            $transaction->type ?? '',
            $transaction->title ?? '',
            $transaction->description ?? '',
            $transaction->amount ?? 0,
            $transaction->paid_amount ?? 0,
            $transaction->status ?? 'pending',
            $transaction->due_date ? \Carbon\Carbon::parse($transaction->due_date)->format('Y-m-d') : '',
            $transaction->settled_at ? \Carbon\Carbon::parse($transaction->settled_at)->format('Y-m-d') : '',
            $transaction->order_id ? $transaction->order_number : '',
            $transaction->counterparty_name ?? '',
            $transaction->description ?? '',
        ];
    }
}
