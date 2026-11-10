<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Application\Services;

use App\Domains\Catalog\Product\Costing\Application\Services\ProductCostingService;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models\ProductCostingImpactModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialCostHistoryModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialStockMovementModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class RawMaterialService
{
    public function __construct(
        private ProductCostingService $productCostingService,
        private RawMaterialMutasiNotifier $mutasiNotifier,
        private CodePatternService $codePatterns,
    ) {}

    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return RawMaterialModel::query()
            ->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function movements(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return RawMaterialStockMovementModel::query()
            ->with('material')
            ->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))
            ->when($filters['raw_material_id'] ?? null, fn ($query, $id) => $query->where('raw_material_id', $id))
            ->latest('occurred_at')
            ->paginate($perPage);
    }

    public function costImpacts(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return ProductCostingImpactModel::query()
            ->with([
                'product:id,name,slug',
                'material:id,code,name,unit',
                'costHistory:id,old_average_cost,new_average_cost,direction,reference_type,reference_number,occurred_at',
            ])
            ->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))
            ->when(($filters['direction'] ?? null) === 'increase', fn ($query) => $query->where('hpp_change_amount', '>', 0))
            ->when(($filters['direction'] ?? null) === 'decrease', fn ($query) => $query->where('hpp_change_amount', '<', 0))
            ->when($filters['product_id'] ?? null, fn ($query, $id) => $query->where('product_id', $id))
            ->latest('occurred_at')
            ->paginate($perPage);
    }

    public function save(array $data, ?int $id, ?int $sellerStoreId): RawMaterialModel
    {
        return DB::transaction(function () use ($data, $id, $sellerStoreId): RawMaterialModel {
            $storeId = $sellerStoreId ?? (int) ($data['store_id'] ?? 0);
            if ($storeId <= 0) {
                throw new InvalidArgumentException('Toko bahan baku tidak valid.');
            }

            $model = $id ? RawMaterialModel::query()->where('store_id', $storeId)->lockForUpdate()->find($id) : new RawMaterialModel;
            if ($id && ! $model) {
                throw new InvalidArgumentException('Bahan baku tidak ditemukan.');
            }

            $code = trim((string) ($data['code'] ?? ''));
            if ($code === '') {
                $code = $id ? (string) $model->code : $this->generateCode((string) ($data['name'] ?? ''), $storeId);
            }
            $duplicate = RawMaterialModel::query()->where('store_id', $storeId)->where('code', $code)->when($id, fn ($query) => $query->where('id', '<>', $id))->exists();
            if ($duplicate) {
                throw new InvalidArgumentException('Kode bahan baku sudah digunakan pada toko ini.');
            }

            $wasExisting = $model->exists;
            $oldAverageCost = $wasExisting ? (float) $model->average_cost : 0.0;
            $requestedAverageCost = max(0, (float) ($data['average_cost'] ?? $oldAverageCost));
            if ($wasExisting && abs($requestedAverageCost - $oldAverageCost) >= 0.0001) {
                throw new InvalidArgumentException('Biaya rata-rata bahan baku tidak diubah dari master. Gunakan Stock / Restock Bahan Baku dengan harga beli agar average cost dan histori HPP dihitung otomatis.');
            }
            $newAverageCost = $wasExisting ? $oldAverageCost : $requestedAverageCost;

            $model->fill([
                'store_id' => $storeId,
                'code' => $code,
                'name' => trim((string) $data['name']),
                'unit' => trim((string) ($data['unit'] ?? 'pcs')),
                'minimum_stock' => max(0, (float) ($data['minimum_stock'] ?? 0)),
                'average_cost' => $newAverageCost,
                'is_active' => $data['is_active'] ?? true,
            ])->save();

            return $model->refresh();
        });
    }

    public function delete(int $id, ?int $storeId): RawMaterialModel
    {
        return DB::transaction(function () use ($id, $storeId): RawMaterialModel {
            $material = RawMaterialModel::query()
                ->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))
                ->lockForUpdate()
                ->find($id);

            if (! $material) {
                throw new InvalidArgumentException('Bahan baku tidak ditemukan.');
            }

            $material->delete();

            return $material;
        });
    }

    public function adjust(int $id, array $data, ?int $storeId): RawMaterialModel
    {
        return DB::transaction(function () use ($id, $data, $storeId): RawMaterialModel {
            $material = RawMaterialModel::query()->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))->lockForUpdate()->find($id);
            if (! $material) {
                throw new InvalidArgumentException('Bahan baku tidak ditemukan.');
            }

            $delta = (float) $data['quantity_delta'];
            if ($delta == 0.0) {
                throw new InvalidArgumentException('Perubahan stok tidak boleh nol.');
            }

            $before = (float) $material->stock;
            $after = $before + $delta;
            if ($after < 0) {
                throw new InvalidArgumentException('Stok bahan baku tidak mencukupi.');
            }

            $oldAverageCost = (float) $material->average_cost;
            $unitCost = max(0, (float) ($data['unit_cost'] ?? $oldAverageCost));
            $requestedType = strtolower(trim((string) ($data['movement_type'] ?? '')));
            $allowedTypes = ['restock', 'usage', 'adjustment', 'production_usage'];
            if ($requestedType !== '' && ! in_array($requestedType, $allowedTypes, true)) {
                throw new InvalidArgumentException('Tipe pergerakan bahan baku tidak valid.');
            }
            $movementType = $requestedType !== '' ? $requestedType : ($delta > 0 ? 'restock' : 'usage');
            if ($movementType === 'restock' && $delta < 0) {
                throw new InvalidArgumentException('Restock bahan baku harus menambah stok.');
            }
            if (in_array($movementType, ['usage', 'production_usage'], true) && $delta > 0) {
                throw new InvalidArgumentException('Pemakaian bahan baku harus mengurangi stok.');
            }
            if ($delta > 0 && $unitCost > 0) {
                $existingValue = $before * $oldAverageCost;
                $incomingValue = $delta * $unitCost;
                $material->average_cost = $after > 0 ? ($existingValue + $incomingValue) / $after : $unitCost;
            }

            $material->stock = $after;
            $material->save();

            $referenceType = trim((string) ($data['reference_type'] ?? 'manual')) !== '' ? (string) $data['reference_type'] : $movementType;
            $referenceNumber = $this->referenceNumber($material, $movementType, $data['reference_number'] ?? null);

            $movement = RawMaterialStockMovementModel::query()->create([
                'store_id' => $material->store_id,
                'raw_material_id' => $material->id,
                'type' => $movementType,
                'quantity_delta' => $delta,
                'balance_after' => $after,
                'unit_cost' => $unitCost,
                'total_cost' => abs($delta) * $unitCost,
                'reference_type' => $referenceType,
                'reference_number' => $referenceNumber,
                'notes' => $data['notes'] ?? null,
                'occurred_at' => $data['occurred_at'] ?? now(),
            ]);

            $newAverageCost = (float) $material->average_cost;
            if (abs($newAverageCost - $oldAverageCost) >= 0.0001) {
                $history = $this->recordCostHistory(
                    $material,
                    $oldAverageCost,
                    $newAverageCost,
                    $movement->id,
                    $referenceType,
                    $referenceNumber,
                    $movement->occurred_at
                );
                $this->productCostingService->refreshForRawMaterial($material->id, $history->id, $movement->occurred_at);
            }

            $this->mutasiNotifier->notify([
                'store_id' => $material->store_id,
                'material_code' => $material->code,
                'material_name' => $material->name,
                'unit' => $material->unit,
                'movement_type' => $movementType,
                'delta' => $delta,
                'balance_after' => $after,
                'unit_cost' => $unitCost,
                'average_cost_before' => $oldAverageCost,
                'average_cost_after' => $newAverageCost,
                'reference_type' => $referenceType,
                'reference_number' => $referenceNumber,
                'notes' => $data['notes'] ?? null,
                'occurred_at' => $movement->occurred_at,
            ]);

            return $material->refresh();
        });
    }

    private function generateCode(string $name, int $storeId): string
    {
        return $this->codePatterns->unique('material_code', $storeId, [
            'name' => $name,
            'type' => 'RM',
            'seq' => RawMaterialModel::query()->where('store_id', $storeId)->count() + 1,
        ], fn (string $code): bool => RawMaterialModel::query()->where('store_id', $storeId)->where('code', $code)->exists());
    }

    private function referenceNumber(RawMaterialModel $material, string $movementType, mixed $provided): string
    {
        $provided = trim((string) $provided);
        if ($provided !== '') {
            return $provided;
        }

        $movement = match ($movementType) {
            'restock' => 'RSK',
            'usage' => 'USG',
            'production_usage' => 'PRD',
            default => 'ADJ',
        };
        $sequence = RawMaterialStockMovementModel::query()
            ->where('store_id', $material->store_id)
            ->whereDate('occurred_at', today()->toDateString())
            ->count() + 1;

        return $this->codePatterns->unique('material_reference', (int) $material->store_id, [
            'movement' => $movement,
            'name' => (string) $material->name,
            'seq' => $sequence,
        ], fn (string $reference): bool => RawMaterialStockMovementModel::query()
            ->where('store_id', $material->store_id)
            ->where('reference_number', $reference)
            ->exists());
    }

    private function recordCostHistory(RawMaterialModel $material, float $oldCost, float $newCost, ?int $movementId, string $referenceType, ?string $referenceNumber, mixed $occurredAt): RawMaterialCostHistoryModel
    {
        $change = $newCost - $oldCost;
        $percent = $oldCost > 0 ? ($change / $oldCost) * 100 : ($newCost > 0 ? 100 : 0);

        return RawMaterialCostHistoryModel::query()->create([
            'store_id' => $material->store_id,
            'raw_material_id' => $material->id,
            'raw_material_stock_movement_id' => $movementId,
            'old_average_cost' => $oldCost,
            'new_average_cost' => $newCost,
            'change_amount' => $change,
            'change_percent' => $percent,
            'direction' => $change > 0 ? 'increase' : ($change < 0 ? 'decrease' : 'unchanged'),
            'reference_type' => $referenceType,
            'reference_number' => $referenceNumber,
            'occurred_at' => $occurredAt ?: now(),
        ]);
    }
}
