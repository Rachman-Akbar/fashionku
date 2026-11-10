<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Presentation\Http\Controllers;

use App\Domains\Finance\Commission\Application\Services\SellerSettlementService;
use App\Domains\Finance\Commission\Application\Services\SellerWithdrawalService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerWithdrawalController extends Controller
{
    public function __construct(
        private SellerWithdrawalService $withdrawalService,
        private SellerSettlementService $settlementService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $request->route('storeId') ?? $request->user()->store->id;
        $withdrawals = $this->withdrawalService->getStoreWithdrawals($storeId, $request->only(['status']), min(100, max(1, (int) $request->query('per_page', 20))));

        return response()->json([
            'success' => true,
            'data' => $withdrawals->through(fn ($w) => $this->mapWithdrawal($w)),
            'available_balance' => $this->settlementService->getStoreBalance($storeId),
            'total_withdrawn' => $this->withdrawalService->getTotalWithdrawn($storeId),
        ]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $withdrawals = $this->withdrawalService->getAllWithdrawals(
            $request->only(['status', 'store_id']),
            min(100, max(1, (int) $request->query('per_page', 20)))
        );

        return response()->json([
            'success' => true,
            'data' => $withdrawals->through(fn ($w) => $this->mapModel($w)),
            'pending_count' => $this->withdrawalService->getPendingCount(),
        ]);
    }

    private function mapModel($w): array
    {
        return [
            'id' => $w->id,
            'withdrawal_number' => $w->withdrawal_number,
            'store_id' => $w->store_id,
            'store_name' => $w->store?->name ?? $w->store_id,
            'amount' => (float) $w->amount,
            'method' => $w->method,
            'bank_details' => $w->bank_details,
            'status' => $w->status,
            'rejection_reason' => $w->rejection_reason,
            'processed_at' => $w->processed_at?->toDateTimeString(),
            'created_at' => $w->created_at?->toDateTimeString(),
        ];
    }

    private function mapWithdrawal($w): array
    {
        return [
            'id' => $w->id,
            'withdrawal_number' => $w->withdrawalNumber,
            'store_id' => $w->storeId,
            'store_name' => $w->store?->name ?? $w->storeId,
            'amount' => $w->amount,
            'method' => $w->method,
            'bank_details' => $w->bankDetails,
            'status' => $w->status,
            'rejection_reason' => $w->rejectionReason,
            'processed_at' => $w->processedAt,
            'created_at' => $w->createdAt,
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:10000'],
            'method' => ['required', 'string', 'in:bank_transfer,e_wallet,cash'],
            'bank_details' => ['nullable', 'array'],
            'bank_details.bank_name' => ['required_with:bank_details', 'string', 'max:100'],
            'bank_details.account_number' => ['required_with:bank_details', 'string', 'max:50'],
            'bank_details.account_name' => ['required_with:bank_details', 'string', 'max:100'],
        ]);

        $storeId = $request->user()->store->id;

        $validated['store_id'] = $storeId;
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending';
        $validated['created_by'] = $request->user()->id;

        $withdrawal = $this->withdrawalService->requestWithdrawal($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan penarikan berhasil diajukan.',
            'data' => [
                'id' => $withdrawal->id,
                'withdrawal_number' => $withdrawal->withdrawalNumber,
                'amount' => $withdrawal->amount,
                'status' => $withdrawal->status,
            ],
        ], 201);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $withdrawal = $this->withdrawalService->approveWithdrawal(
            $id,
            (string) $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Penarikan berhasil disetujui.',
            'data' => [
                'id' => $withdrawal->id,
                'status' => $withdrawal->status,
                'processed_at' => $withdrawal->processedAt,
            ],
        ]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $withdrawal = $this->withdrawalService->rejectWithdrawal(
            $id,
            $validated['reason'],
            (string) $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Penarikan berhasil ditolak.',
            'data' => [
                'id' => $withdrawal->id,
                'status' => $withdrawal->status,
                'rejection_reason' => $withdrawal->rejectionReason,
            ],
        ]);
    }
}
