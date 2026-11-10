<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Services;

use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Carbon\Carbon;

class HutangPiutangService
{
    public function getSummary(int $storeId): array
    {
        $base = FinancialTransactionModel::where('store_id', $storeId)
            ->whereIn('type', ['payable', 'receivable'])
            ->where('is_active', true);

        $totals = (clone $base)
            ->selectRaw('type, COUNT(*) as count, SUM(amount) as total, SUM(paid_amount) as paid')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        $statusCounts = (clone $base)
            ->selectRaw('type, status, COUNT(*) as count')
            ->groupBy('type', 'status')
            ->get()
            ->groupBy('type');

        $build = fn (string $type): array => [
            'total' => round((float) ($totals[$type]->total ?? 0), 2),
            'paid' => round((float) ($totals[$type]->paid ?? 0), 2),
            'remaining' => round((float) (($totals[$type]->total ?? 0) - ($totals[$type]->paid ?? 0)), 2),
            'count' => (int) ($totals[$type]->count ?? 0),
            'open_count' => (int) ($statusCounts[$type]->firstWhere('status', 'open')?->count ?? 0)
                + (int) ($statusCounts[$type]->firstWhere('status', 'partial')?->count ?? 0),
            'paid_count' => (int) ($statusCounts[$type]->firstWhere('status', 'paid')?->count ?? 0),
        ];

        return [
            'payable' => $build('payable'),
            'receivable' => $build('receivable'),
        ];
    }

    public function getAging(int $storeId): array
    {
        $today = Carbon::today();

        $payables = FinancialTransactionModel::where('store_id', $storeId)
            ->where('type', 'payable')
            ->whereIn('status', ['open', 'partial'])
            ->where('is_active', true)
            ->get();

        $receivables = FinancialTransactionModel::where('store_id', $storeId)
            ->where('type', 'receivable')
            ->whereIn('status', ['open', 'partial'])
            ->where('is_active', true)
            ->get();

        return [
            'payable_aging' => $this->calculateAging($payables, $today),
            'receivable_aging' => $this->calculateAging($receivables, $today),
        ];
    }

    public function getDetail(int $storeId, string $type): array
    {
        $transactions = FinancialTransactionModel::with(['payments' => fn ($q) => $q->orderBy('paid_at')])
            ->where('store_id', $storeId)
            ->where('type', $type)
            ->whereIn('status', ['open', 'partial'])
            ->where('is_active', true)
            ->orderBy('due_date')
            ->get();

        return $transactions->map(function ($t) {
            $history = $t->payments;

            return [
                'id' => $t->id,
                'reference_number' => $t->reference_number,
                'title' => $t->title,
                'description' => $t->description,
                'amount' => $t->amount,
                'paid_amount' => $t->paid_amount,
                'remaining' => max(0, $t->amount - $t->paid_amount),
                'status' => $t->status,
                'due_date' => $t->due_date,
                'occurred_at' => $t->occurred_at,
                'days_overdue' => $t->due_date
                    ? max(0, Carbon::parse($t->due_date)->diffInDays(now()))
                    : null,
                'installments' => $history->map(fn ($h) => [
                    'amount' => $h->amount,
                    'balance_before' => $h->balance_before,
                    'balance_after' => $h->balance_after,
                    'payment_method' => $h->payment_method,
                    'reference_number' => $h->reference_number,
                    'notes' => $h->notes,
                    'paid_at' => $h->paid_at,
                ])->all(),
                'installment_count' => $history->count(),
            ];
        })->all();
    }

    public function exportReport(int $storeId, string $type, ?string $fromDate = null, ?string $toDate = null): string
    {
        $query = FinancialTransactionModel::where('store_id', $storeId)
            ->where('type', $type)
            ->where('is_active', true);

        if ($fromDate) {
            $query->where('occurred_at', '>=', Carbon::parse($fromDate)->startOfDay());
        }
        if ($toDate) {
            $query->where('occurred_at', '<=', Carbon::parse($toDate)->endOfDay());
        }

        $transactions = $query->orderBy('occurred_at')->get();

        $typeName = $type === 'payable' ? 'Hutang' : 'Piutang';
        $csv = "No,Ref Number,Tanggal,Judul,Total,Jumlah Bayar,Sisa,Tanggal Jatuh Tempo,Status\n";

        foreach ($transactions as $i => $t) {
            $csv .= implode(',', [
                $i + 1,
                '"'.$t->reference_number.'"',
                '"'.$t->occurred_at.'"',
                '"'.addslashes($t->title).'"',
                $t->amount,
                $t->paid_amount,
                max(0, $t->amount - $t->paid_amount),
                '"'.($t->due_date ?? '-').'"',
                '"'.$t->status.'"',
            ])."\n";
        }

        return $csv;
    }

    private function calculateAging($transactions, Carbon $today): array
    {
        $buckets = [
            'current' => ['count' => 0, 'total' => 0.0],
            '1_30_days' => ['count' => 0, 'total' => 0.0],
            '31_60_days' => ['count' => 0, 'total' => 0.0],
            '61_90_days' => ['count' => 0, 'total' => 0.0],
            'over_90_days' => ['count' => 0, 'total' => 0.0],
        ];

        foreach ($transactions as $t) {
            $remaining = max(0, (float) $t->amount - (float) $t->paid_amount);

            if (! $t->due_date) {
                $buckets['current']['count']++;
                $buckets['current']['total'] += $remaining;

                continue;
            }

            $daysOverdue = max(0, $today->diffInDays(Carbon::parse($t->due_date)));

            if ($daysOverdue <= 0) {
                $key = 'current';
            } elseif ($daysOverdue <= 30) {
                $key = '1_30_days';
            } elseif ($daysOverdue <= 60) {
                $key = '31_60_days';
            } elseif ($daysOverdue <= 90) {
                $key = '61_90_days';
            } else {
                $key = 'over_90_days';
            }

            $buckets[$key]['count']++;
            $buckets[$key]['total'] += $remaining;
        }

        return collect($buckets)->map(fn ($b) => [
            'count' => $b['count'],
            'total' => round($b['total'], 2),
        ])->all();
    }
}
