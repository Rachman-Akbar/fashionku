<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Presentation\Http\Controllers;

use App\Domains\Seller\Inventory\Application\Services\RawMaterialService;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class RawMaterialController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private RawMaterialService $service) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->service->paginate($request->only(['search']), min(100, max(1, (int) $request->query('per_page', 20))), $this->scope($request)));
    }

    public function store(Request $request): JsonResponse
    {
        return $this->save($request, null);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        return $this->save($request, $id);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            return response()->json(['success' => true, 'data' => $this->service->delete($id, $this->scope($request))]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function adjust(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'quantity_delta' => ['required', 'numeric', 'not_in:0'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'movement_type' => ['nullable', 'in:restock,usage,adjustment'],
            'reference_type' => ['nullable', 'string', 'max:50'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'occurred_at' => ['nullable', 'date'],
        ]);
        try {
            return response()->json(['success' => true, 'data' => $this->service->adjust($id, $data, $this->scope($request))]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function movements(Request $request): JsonResponse
    {
        return response()->json($this->service->movements($request->only(['raw_material_id']), min(100, max(1, (int) $request->query('per_page', 20))), $this->scope($request)));
    }

    public function costImpacts(Request $request): JsonResponse
    {
        return response()->json($this->service->costImpacts($request->only(['direction', 'product_id']), min(100, max(1, (int) $request->query('per_page', 20))), $this->scope($request)));
    }

    private function save(Request $request, ?int $id): JsonResponse
    {
        $data = $request->validate([
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'code' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:50'],
            'minimum_stock' => ['nullable', 'numeric', 'min:0'],
            'average_cost' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
        try {
            return response()->json(['success' => true, 'data' => $this->service->save($data, $id, $this->scope($request))], $id ? 200 : 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    private function scope(Request $request): ?int
    {
        return $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
    }
}
