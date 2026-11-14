<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Controllers;

use App\Domains\Seller\Finance\Application\Services\SellerFinanceDashboardService;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerFinanceDashboardController extends Controller
{
    public function __construct(
        private SellerFinanceDashboardService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => ['nullable', 'in:daily,weekly,monthly,yearly'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'integer', 'min:2000,max:2100'],
            'granularity' => ['nullable', 'in:day,month,year'],
        ]);

        $period = $request->query('period', 'monthly');
        $granularity = $request->query('granularity', 'day');

        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;

        if (! $dateFrom && ($validated['month'] ?? null)) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && ($validated['year'] ?? null)) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getDashboard($period, $dateFrom, $dateTo, $granularity),
        ]);
    }

    public function orderTrend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => ['nullable', 'in:daily,weekly,monthly,yearly'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'integer', 'min:2000,max:2100'],
            'granularity' => ['nullable', 'in:day,month,year'],
        ]);

        $period = $request->query('period', 'monthly');
        $granularity = $request->query('granularity', 'day');

        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;

        if (! $dateFrom && ($validated['month'] ?? null)) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && ($validated['year'] ?? null)) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getOrderTrend($period, $dateFrom, $dateTo, $granularity),
        ]);
    }

    public function cashflow(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'integer', 'min:2000,max:2100'],
            'granularity' => ['nullable', 'in:day,month,year'],
        ]);

        $dateFrom = $validated['date_from'] ?? $validated['from_date'] ?? null;
        $dateTo = $validated['date_to'] ?? $validated['to_date'] ?? null;

        if (! $dateFrom && ($validated['month'] ?? null)) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && ($validated['year'] ?? null)) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        $granularity = $validated['granularity'] ?? 'day';

        return response()->json([
            'success' => true,
            'data' => $this->service->getCashflow($dateFrom, $dateTo, $granularity),
        ]);
    }
}
