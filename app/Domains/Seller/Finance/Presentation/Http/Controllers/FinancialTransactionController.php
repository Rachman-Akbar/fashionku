<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Controllers;

use App\Domains\Seller\Finance\Application\Services\FinancialTransactionService;
use App\Domains\Seller\Finance\Presentation\Http\Requests\FinancialTransactionRequest;
use App\Domains\Seller\Finance\Presentation\Http\Resources\FinancialTransactionResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class FinancialTransactionController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private FinancialTransactionService $service) {}

    public function index(Request $request): JsonResponse
    {
        $rows = $this->service->paginate(
            $request->only(['type', 'status', 'is_active', 'date_from', 'date_to', 'search']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $this->sellerStoreScope($request)
        );

        return FinancialTransactionResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(FinancialTransactionRequest $request): JsonResponse
    {
        try {
            $row = $this->service->save($request->validated(), null, $this->sellerStoreScope($request));

            return (new FinancialTransactionResource($row))->additional(['success' => true, 'message' => 'Transaksi keuangan berhasil dibuat.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return $this->invalid($exception);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            return (new FinancialTransactionResource($this->service->find($id, $this->sellerStoreScope($request))))->additional(['success' => true])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function update(FinancialTransactionRequest $request, int $id): JsonResponse
    {
        try {
            $row = $this->service->save($request->validated(), $id, $this->sellerStoreScope($request));

            return (new FinancialTransactionResource($row))->additional(['success' => true, 'message' => 'Transaksi keuangan berhasil diperbarui.'])->response();
        } catch (InvalidArgumentException $exception) {
            return $this->invalid($exception);
        }
    }

    public function recordPayment(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'paid_at' => ['nullable', 'date'],
        ]);

        try {
            $row = $this->service->recordPayment($id, (float) $validated['amount'], $this->sellerStoreScope($request), $validated);

            return (new FinancialTransactionResource($row))->additional(['success' => true, 'message' => 'Pembayaran berhasil dicatat.'])->response();
        } catch (InvalidArgumentException $exception) {
            return $this->invalid($exception);
        }
    }

    public function paymentHistory(Request $request, int $id): JsonResponse
    {
        try {
            return response()->json(['success' => true, 'data' => $this->service->paymentHistory($id, $this->sellerStoreScope($request))]);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->service->delete($id, $this->sellerStoreScope($request));

            return response()->json(['success' => true, 'message' => 'Transaksi keuangan berhasil dihapus.']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    private function sellerStoreScope(Request $request): ?int
    {
        return $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
    }

    private function invalid(InvalidArgumentException $exception): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
    }
}
