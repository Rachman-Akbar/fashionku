<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Presentation\Http\Controllers;

use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use App\Domains\Seller\Stock\Presentation\Http\Requests\StockAdjustmentRequest;
use App\Domains\Seller\Stock\Presentation\Http\Resources\StockMovementResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class StockMovementController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private StockMovementService $service) {}

    public function index(Request $request): JsonResponse
    {
        $rows = $this->service->paginate(
            $request->only(['type', 'product_id', 'variant_id', 'date_from', 'date_to', 'search']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $this->sellerStoreScope($request)
        );

        return StockMovementResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(StockAdjustmentRequest $request): JsonResponse
    {
        try {
            $row = $this->service->adjust($request->validated(), $this->sellerStoreScope($request));

            return (new StockMovementResource($row))->additional(['success' => true, 'message' => 'Perubahan stok berhasil dicatat.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    private function sellerStoreScope(Request $request): ?int
    {
        return $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
    }
}
