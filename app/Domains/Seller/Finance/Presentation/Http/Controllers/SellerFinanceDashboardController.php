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
        $storeId = $request->route('storeId') ?? $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan.',
            ], 404);
        }

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

        // Resolve month/year into date_from/date_to if provided.
        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;

        if (! $dateFrom && $validated['month']) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && $validated['year']) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        $dashboard = $this->service->getDashboard(
            $storeId,
            $period,
            $dateFrom,
            $dateTo,
            $granularity
        );

        return response()->json([
            'success' => true,
            'data' => $dashboard,
        ]);
    }

    public function orderTrend(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan.',
            ], 404);
        }

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

        if (! $dateFrom && $validated['month']) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && $validated['year']) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getOrderTrend(
                $storeId,
                $period,
                $dateFrom,
                $dateTo,
                $granularity
            ),
        ]);
    }

    public function cashflow(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'integer', 'min:2000,max:2100'],
            'granularity' => ['nullable', 'in:day,month,year'],
        ]);

        // Backward compatibility: from_date/to_date → date_from/date_to.
        $dateFrom = $validated['date_from'] ?? $validated['from_date'] ?? null;
        $dateTo = $validated['date_to'] ?? $validated['to_date'] ?? null;

        if (! $dateFrom && $validated['month']) {
            $dateFrom = Carbon::parse($validated['month'] . '-01')->startOfMonth()->toDateString();
            $dateTo = Carbon::parse($validated['month'] . '-01')->endOfMonth()->toDateString();
        } elseif (! $dateFrom && $validated['year']) {
            $dateFrom = Carbon::parse("{$validated['year']}-01-01")->startOfYear()->toDateString();
            $dateTo = Carbon::parse("{$validated['year']}-12-31")->endOfYear()->toDateString();
        }

        $granularity = $validated['granularity'] ?? 'day';

        $cashflow = $this->service->getCashflow(
            $storeId,
            $dateFrom,
            $dateTo,
            $granularity
        );

        return response()->json([
            'success' => true,
            'data' => $cashflow,
        ]);
    }
}
