<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Services;

use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Carbon\Carbon;

class SellerFinanceDashboardService
{
    public function getDashboard(?string $period = null, ?string $dateFrom = null, ?string $dateTo = null, ?string $granularity = null): array
    {
        $period = $period ?? 'monthly';
        $granularity = $granularity ?? 'day';
        [$startDate, $endDate] = $this->resolveRange($period, $dateFrom, $dateTo);

        // Ringkasan dihitung lewat satu query agregat; hanya 10 transaksi terakhir
        // yang dimuat ke memori.
        $summaryRow = FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $startDate)
            ->where('occurred_at', '<=', $endDate)
            ->where('is_active', true)
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->selectRaw("SUM(CASE WHEN type = 'payable' THEN amount ELSE 0 END) as payable")
            ->selectRaw("SUM(CASE WHEN type = 'receivable' THEN amount ELSE 0 END) as receivable")
            ->selectRaw("SUM(CASE WHEN type = 'payable' THEN paid_amount ELSE 0 END) as payable_paid")
            ->selectRaw("SUM(CASE WHEN type = 'receivable' THEN paid_amount ELSE 0 END) as receivable_paid")
            ->first();

        $income = (float) ($summaryRow->income ?? 0);
        $expense = (float) ($summaryRow->expense ?? 0);
        $payable = (float) ($summaryRow->payable ?? 0);
        $receivable = (float) ($summaryRow->receivable ?? 0);
        $payablePaid = (float) ($summaryRow->payable_paid ?? 0);
        $receivablePaid = (float) ($summaryRow->receivable_paid ?? 0);

        $recent = FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $startDate)
            ->where('occurred_at', '<=', $endDate)
            ->where('is_active', true)
            ->orderByDesc('occurred_at')
            ->limit(10)
            ->get();

        return [
            'period' => $dateFrom ? 'custom' : $period,
            'granularity' => $granularity,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'summary' => [
                'income' => round($income, 2),
                'expense' => round($expense, 2),
                'profit' => round($income - $expense, 2),
                'payable_total' => round($payable, 2),
                'payable_paid' => round($payablePaid, 2),
                'payable_remaining' => round($payable - $payablePaid, 2),
                'receivable_total' => round($receivable, 2),
                'receivable_paid' => round($receivablePaid, 2),
                'receivable_remaining' => round($receivable - $receivablePaid, 2),
            ],
            'recent_transactions' => $recent->map(fn ($t) => [
                'id' => $t->id,
                'reference_number' => $t->reference_number,
                'type' => $t->type,
                'title' => $t->title,
                'amount' => $t->amount,
                'status' => $t->status,
                'occurred_at' => $t->occurred_at,
            ])->values()->all(),
            'daily_cashflow' => $this->getDailyCashflow($startDate, $endDate),
        ];
    }

    public function getOrderTrend(?string $period = null, ?string $dateFrom = null, ?string $dateTo = null, ?string $granularity = null): array
    {
        $period = $period ?? 'monthly';
        $granularity = $granularity ?? 'day';
        [$startDate, $endDate] = $this->resolveRange($period, $dateFrom, $dateTo);

        $rows = SubOrderModel::query()
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->selectRaw('DATE(created_at) as day, COUNT(*) as orders')
            ->selectRaw("SUM(CASE WHEN status != 'cancelled' THEN total_items_price + shipping_cost ELSE 0 END) as revenue")
            ->selectRaw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $trend = [];
        $current = $startDate->copy();

        while ($current->lte($endDate)) {
            $dayStr = $current->toDateString();
            $row = $rows[$dayStr] ?? null;

            $trend[] = [
                'date' => $dayStr,
                'orders' => (int) ($row->orders ?? 0),
                'revenue' => round((float) ($row->revenue ?? 0), 2),
                'completed' => (int) ($row->completed ?? 0),
            ];

            $current->addDay();
        }

        return [
            'period' => $dateFrom ? 'custom' : $period,
            'granularity' => $granularity,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'points' => $trend,
        ];
    }

    public function getCashflow(string $fromDate, string $toDate, ?string $granularity = null): array
    {
        $granularity = $granularity ?? 'day';
        $from = Carbon::parse($fromDate)->startOfDay();
        $to = Carbon::parse($toDate)->endOfDay();

        // Satu query agregat (GROUP BY DATE) alih-alih memuat seluruh transaksi
        // ke memori lalu dikelompokkan per hari.
        $rows = $this->aggregateDaily($from, $to);

        $dailyData = [];
        $current = $from->copy();
        $end = Carbon::parse($toDate);

        while ($current->lte($end)) {
            $dayStr = $current->toDateString();
            $row = $rows[$dayStr] ?? null;

            $dailyData[] = [
                'date' => $dayStr,
                'income' => round((float) ($row->income ?? 0), 2),
                'expense' => round((float) ($row->expense ?? 0), 2),
                'payable' => round((float) ($row->payable ?? 0), 2),
                'receivable' => round((float) ($row->receivable ?? 0), 2),
            ];

            $current->addDay();
        }

        return [
            'date_from' => $fromDate,
            'date_to' => $toDate,
            'granularity' => $granularity,
            'daily' => $dailyData,
            'totals' => [
                'income' => round($rows->sum('income'), 2),
                'expense' => round($rows->sum('expense'), 2),
                'payable' => round($rows->sum('payable'), 2),
                'receivable' => round($rows->sum('receivable'), 2),
            ],
        ];
    }

    private function resolveRange(string $period, ?string $dateFrom, ?string $dateTo): array
    {
        if ($dateFrom) {
            return [
                Carbon::parse($dateFrom)->startOfDay(),
                $dateTo ? Carbon::parse($dateTo)->endOfDay() : now(),
            ];
        }

        return [
            $this->getStartDate($period),
            now(),
        ];
    }

    private function getStartDate(string $period): Carbon
    {
        return match ($period) {
            'daily' => Carbon::today(),
            'weekly' => Carbon::now()->startOfWeek(),
            'monthly' => Carbon::now()->startOfMonth(),
            'yearly' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };
    }

    /**
     * Agregasi cashflow harian lewat satu query GROUP BY (tanpa N query per hari).
     *
     * @return \Illuminate\Support\Collection<string, object>
     */
    private function aggregateDaily(Carbon $from, Carbon $to)
    {
        return FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $from)
            ->where('occurred_at', '<=', $to)
            ->where('is_active', true)
            ->selectRaw('DATE(occurred_at) as day')
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->selectRaw("SUM(CASE WHEN type = 'payable' THEN amount ELSE 0 END) as payable")
            ->selectRaw("SUM(CASE WHEN type = 'receivable' THEN amount ELSE 0 END) as receivable")
            ->groupBy('day')
            ->get()
            ->keyBy('day');
    }

    private function getDailyCashflow(Carbon $startDate, Carbon $endDate): array
    {
        $rows = $this->aggregateDaily($startDate, $endDate);

        $daily = [];
        $current = $startDate->copy();

        while ($current->lte($endDate)) {
            $dayStr = $current->toDateString();
            $row = $rows[$dayStr] ?? null;

            $daily[] = [
                'date' => $dayStr,
                'income' => round((float) ($row->income ?? 0), 2),
                'expense' => round((float) ($row->expense ?? 0), 2),
            ];

            $current->addDay();
        }

        return $daily;
    }
}
