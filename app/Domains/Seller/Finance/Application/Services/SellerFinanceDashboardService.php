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

        $transactions = FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $startDate)
            ->where('occurred_at', '<=', $endDate)
            ->where('is_active', true)
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');
        $payable = $transactions->where('type', 'payable')->sum('amount');
        $receivable = $transactions->where('type', 'receivable')->sum('amount');
        $payablePaid = $transactions->where('type', 'payable')->sum('paid_amount');
        $receivablePaid = $transactions->where('type', 'receivable')->sum('paid_amount');

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
            'recent_transactions' => $transactions->sortByDesc('occurred_at')->take(10)->map(fn ($t) => [
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

        $transactions = FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $from)
            ->where('occurred_at', '<=', $to)
            ->where('is_active', true)
            ->orderBy('occurred_at')
            ->get();

        $dailyData = [];
        $current = $from->copy();
        $end = Carbon::parse($toDate);

        while ($current->lte($end)) {
            $dayStr = $current->toDateString();
            $dayTransactions = $transactions->filter(fn ($t) => Carbon::parse($t->occurred_at)->toDateString() === $dayStr);

            $dailyData[] = [
                'date' => $dayStr,
                'income' => round($dayTransactions->where('type', 'income')->sum('amount'), 2),
                'expense' => round($dayTransactions->where('type', 'expense')->sum('amount'), 2),
                'payable' => round($dayTransactions->where('type', 'payable')->sum('amount'), 2),
                'receivable' => round($dayTransactions->where('type', 'receivable')->sum('amount'), 2),
            ];

            $current->addDay();
        }

        return [
            'date_from' => $fromDate,
            'date_to' => $toDate,
            'granularity' => $granularity,
            'daily' => $dailyData,
            'totals' => [
                'income' => round($transactions->where('type', 'income')->sum('amount'), 2),
                'expense' => round($transactions->where('type', 'expense')->sum('amount'), 2),
                'payable' => round($transactions->where('type', 'payable')->sum('amount'), 2),
                'receivable' => round($transactions->where('type', 'receivable')->sum('amount'), 2),
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

    private function getDailyCashflow(Carbon $startDate, Carbon $endDate): array
    {
        $transactions = FinancialTransactionModel::query()
            ->where('occurred_at', '>=', $startDate)
            ->where('occurred_at', '<=', $endDate)
            ->where('is_active', true)
            ->get();

        $daily = $transactions->groupBy(fn ($t) => Carbon::parse($t->occurred_at)->toDateString());

        return collect($daily)->map(fn ($dayTransactions, $date) => [
            'date' => $date,
            'income' => round($dayTransactions->where('type', 'income')->sum('amount'), 2),
            'expense' => round($dayTransactions->where('type', 'expense')->sum('amount'), 2),
        ])->sortBy('date')->values()->all();
    }
}
