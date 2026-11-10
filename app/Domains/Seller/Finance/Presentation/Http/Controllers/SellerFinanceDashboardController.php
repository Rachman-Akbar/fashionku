<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Controllers;

use App\Domains\Seller\Finance\Application\Services\SellerFinanceDashboardService;
use App\Http\Controllers\Controller;
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
        ]);

        $period = $request->query('period', 'monthly');

        $dashboard = $this->service->getDashboard(
            $storeId,
            $period,
            $validated['date_from'] ?? null,
            $validated['date_to'] ?? null
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
        ]);

        $period = $request->query('period', 'monthly');

        return response()->json([
            'success' => true,
            'data' => $this->service->getOrderTrend(
                $storeId,
                $period,
                $validated['date_from'] ?? null,
                $validated['date_to'] ?? null
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
            'from_date' => ['required', 'date'],
            'to_date' => ['required', 'date', 'after_or_equal:from_date'],
        ]);

        $cashflow = $this->service->getCashflow(
            $storeId,
            $validated['from_date'],
            $validated['to_date']
        );

        return response()->json([
            'success' => true,
            'data' => $cashflow,
        ]);
    }
}
