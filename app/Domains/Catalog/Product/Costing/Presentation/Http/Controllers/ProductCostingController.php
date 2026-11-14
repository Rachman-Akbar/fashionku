<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Costing\Presentation\Http\Controllers;

use App\Domains\Catalog\Product\Costing\Application\Services\ProductCostingService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class ProductCostingController extends Controller
{
    public function __construct(private ProductCostingService $service) {}

    public function show(int $productId): JsonResponse
    {
        try {
            return response()->json(['success' => true, 'data' => $this->service->get($productId)]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, int $productId): JsonResponse
    {
        $data = $request->validate([
            'materials' => ['array'], 'materials.*.raw_material_id' => ['required', 'integer', 'distinct'], 'materials.*.quantity' => ['required', 'numeric', 'gt:0'],
            'labor_cost' => ['nullable', 'numeric', 'min:0'], 'overhead_cost' => ['nullable', 'numeric', 'min:0'], 'other_cost' => ['nullable', 'numeric', 'min:0'], 'margin_percent' => ['nullable', 'numeric', 'min:0'], 'selling_price' => ['nullable', 'numeric', 'min:0'], 'apply_to_variants' => ['nullable', 'boolean'],
        ]);
        try {
            return response()->json(['success' => true, 'data' => $this->service->save($productId, $data)]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
