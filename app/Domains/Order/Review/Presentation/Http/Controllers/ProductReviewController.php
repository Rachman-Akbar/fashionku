<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Presentation\Http\Controllers;

use App\Domains\Order\Review\Application\Services\ProductReviewService;
use App\Domains\Order\Review\Domain\Repositories\ProductReviewRepositoryInterface;
use App\Domains\Order\Review\Presentation\Http\Requests\ProductReviewRequest;
use App\Domains\Order\Review\Presentation\Http\Resources\ProductReviewResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class ProductReviewController extends Controller
{
    use ResolvesActiveRole;

    public function publicIndex(Request $request, int $productId, ProductReviewRepositoryInterface $repository): JsonResponse
    {
        $rows = $repository->paginate(
            ['product_id' => $productId, 'rating' => $request->query('rating'), 'is_active' => true],
            min(100, max(1, (int) $request->query('per_page', 20))),
            null
        );

        return ProductReviewResource::collection($rows)->additional(['success' => true])->response();
    }

    public function index(Request $request, ProductReviewService $service): JsonResponse
    {
        $isAdmin = $this->hasActiveRole($request, 'admin');
        $isSeller = $this->hasActiveRole($request, 'seller');
        $rows = $service->paginate(
            $request->only(['product_id', 'rating', 'is_active', 'search']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $isAdmin || $isSeller ? null : (string) $request->user()->id
        );

        return ProductReviewResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(ProductReviewRequest $request, ProductReviewService $service): JsonResponse
    {
        try {
            $row = $service->create($request->validated(), (string) $request->user()->id);

            return (new ProductReviewResource($row))->additional(['success' => true, 'message' => 'Review berhasil dibuat.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function update(ProductReviewRequest $request, int $id, ProductReviewService $service): JsonResponse
    {
        try {
            $manage = $this->hasActiveRole($request, 'admin')
                || $request->user()?->hasPermission('reviews.manage') === true;
            $row = $service->update($id, $request->validated(), (string) $request->user()->id, $manage);

            return (new ProductReviewResource($row))->additional(['success' => true, 'message' => 'Review berhasil diperbarui.'])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function destroy(Request $request, int $id, ProductReviewService $service): JsonResponse
    {
        try {
            $manage = $this->hasActiveRole($request, 'admin')
                || $request->user()?->hasPermission('reviews.manage') === true;
            $service->delete($id, (string) $request->user()->id, $manage);

            return response()->json(['success' => true, 'message' => 'Review berhasil dihapus.']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }
}
