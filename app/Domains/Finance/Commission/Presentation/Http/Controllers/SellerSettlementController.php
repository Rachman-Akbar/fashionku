<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Presentation\Http\Controllers;

use App\Domains\Finance\Commission\Application\Services\SellerSettlementService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerSettlementController extends Controller
{
    public function __construct(
        private SellerSettlementService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id;

        $settlements = $this->service->getStoreSettlements(
            $storeId,
            $request->only(['status', 'from_date', 'to_date']),
            min(100, max(1, (int) $request->query('per_page', 20)))
        );

        return response()->json([
            'success' => true,
            'data' => $settlements->through(fn ($s) => [
                'id' => $s->id,
                'settlement_number' => $s->settlementNumber,
                'order_id' => $s->orderId,
                'gross_amount' => $s->grossAmount,
                'admin_fee' => $s->adminFee,
                'shipping_fee' => $s->shippingFee,
                'net_amount' => $s->netAmount,
                'status' => $s->status,
                'settled_at' => $s->settledAt,
                'created_at' => $s->createdAt,
            ]),
            'balance' => $this->service->getStoreBalance($storeId),
        ]);
    }

    public function balance(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id;

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $this->service->getStoreBalance($storeId),
            ],
        ]);
    }

    public function settle(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id;

        $settled = $this->service->settlePendingSettlements($storeId);

        return response()->json([
            'success' => true,
            'message' => 'Settlement berhasil diproses.',
            'data' => [
                'settled_amount' => $settled,
                'new_balance' => $this->service->getStoreBalance($storeId),
            ],
        ]);
    }
}
