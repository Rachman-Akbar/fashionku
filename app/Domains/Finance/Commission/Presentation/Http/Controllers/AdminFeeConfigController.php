<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Presentation\Http\Controllers;

use App\Domains\Finance\Commission\Application\Services\AdminFeeConfigService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminFeeConfigController extends Controller
{
    public function __construct(
        private AdminFeeConfigService $service
    ) {}

    public function index(): JsonResponse
    {
        $configs = $this->service->getAll();

        $categories = DB::table('categories')
            ->whereIn('id', collect($configs)->pluck('categoryId')->filter()->unique()->all())
            ->pluck('name', 'id');

        return response()->json([
            'success' => true,
            'data' => collect($configs)->map(fn ($config) => [
                'id' => $config->id,
                'category_id' => $config->categoryId,
                'category_name' => $config->categoryId ? ($categories[$config->categoryId] ?? null) : null,
                'name' => $config->name,
                'code' => $config->code,
                'percentage' => $config->percentage,
                'fixed_amount' => $config->fixedAmount,
                'min_fee' => $config->minFee,
                'max_fee' => $config->maxFee,
                'is_active' => $config->isActive,
                'description' => $config->description,
            ])->all(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:80', 'unique:admin_fee_configs,code'],
            'percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'fixed_amount' => ['nullable', 'numeric', 'min:0'],
            'min_fee' => ['nullable', 'numeric', 'min:0'],
            'max_fee' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = true;

        $config = $this->service->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi fee berhasil dibuat.',
            'data' => [
                'id' => $config->id,
                'code' => $config->code,
                'name' => $config->name,
            ],
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:120'],
            'percentage' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'fixed_amount' => ['nullable', 'numeric', 'min:0'],
            'min_fee' => ['nullable', 'numeric', 'min:0'],
            'max_fee' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['updated_by'] = $request->user()->id;

        $config = $this->service->update($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi fee berhasil diperbarui.',
            'data' => [
                'id' => $config->id,
                'code' => $config->code,
                'name' => $config->name,
            ],
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi fee berhasil dihapus.',
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        $fee = $this->service->calculateFee(
            $validated['amount'],
            $validated['category_id'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => [
                'amount' => $validated['amount'],
                'fee' => $fee,
                'net' => $validated['amount'] - $fee,
            ],
        ]);
    }
}
