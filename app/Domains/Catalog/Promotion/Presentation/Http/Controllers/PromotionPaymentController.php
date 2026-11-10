<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Presentation\Http\Controllers;

use App\Domains\Catalog\Promotion\Application\Services\PromotionPaymentService;
use App\Domains\Catalog\Promotion\Presentation\Http\Requests\PromotionPaymentRequest;
use App\Domains\Catalog\Promotion\Presentation\Http\Resources\PromotionPaymentResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class PromotionPaymentController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private PromotionPaymentService $service) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
        $rows = $this->service->paginate(
            $request->only(['status', 'available', 'search']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $storeId
        );

        return PromotionPaymentResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(PromotionPaymentRequest $request): JsonResponse
    {
        $row = $this->service->submit(
            $request->validated(),
            $this->resolveSellerStoreId($request),
            (string) $request->user()->getAuthIdentifier()
        );

        return (new PromotionPaymentResource($row))->additional([
            'success' => true,
            'message' => 'Bukti pembayaran promosi berhasil diajukan.',
        ])->response()->setStatusCode(201);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        return $this->review($request, $id, 'approved');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => ['required', 'string', 'max:1000']]);

        return $this->review($request, $id, 'rejected');
    }

    private function review(Request $request, int $id, string $status): JsonResponse
    {
        try {
            $row = $this->service->review(
                $id,
                $status,
                $request->input('reason'),
                (string) $request->user()->getAuthIdentifier()
            );

            return (new PromotionPaymentResource($row))->additional([
                'success' => true,
                'message' => $status === 'approved' ? 'Pembayaran promosi disetujui.' : 'Pembayaran promosi ditolak.',
            ])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }
}
