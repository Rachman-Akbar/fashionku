<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Costing\Application\Services;

use App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models\ProductCostingImpactModel;
use App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models\ProductCostingModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class ProductCostingService
{
    public function get(int $productId, ?int $storeId): array
    {
        $product = DB::table('products')->where('id', $productId)->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))->first();
        if (! $product) {
            throw new InvalidArgumentException('Produk tidak ditemukan.');
        }

        $costing = ProductCostingModel::query()->where('product_id', $productId)->first();
        $materials = DB::table('product_materials as pm')
            ->join('raw_materials as rm', 'rm.id', '=', 'pm.raw_material_id')
            ->where('pm.product_id', $productId)
            ->whereNull('rm.deleted_at')
            ->select('pm.*', 'rm.name as material_name', 'rm.code as material_code', 'rm.unit', 'rm.stock as material_stock', 'rm.average_cost as current_unit_cost')
            ->orderBy('rm.name')
            ->get();

        return ['costing' => $costing, 'materials' => $materials];
    }

    public function save(int $productId, array $data, ?int $storeId): array
    {
        return DB::transaction(function () use ($productId, $data, $storeId): array {
            $product = DB::table('products')->where('id', $productId)->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))->lockForUpdate()->first();
            if (! $product) {
                throw new InvalidArgumentException('Produk tidak ditemukan.');
            }

            DB::table('product_materials')->where('product_id', $productId)->delete();
            $materialCost = 0.0;
            $materialIds = [];

            foreach ($data['materials'] ?? [] as $row) {
                $rawMaterialId = (int) $row['raw_material_id'];
                if (isset($materialIds[$rawMaterialId])) {
                    throw new InvalidArgumentException('Bahan baku yang sama tidak boleh dipilih lebih dari satu kali.');
                }
                $materialIds[$rawMaterialId] = true;

                $material = RawMaterialModel::query()->whereKey($rawMaterialId)->where('store_id', $product->store_id)->where('is_active', true)->lockForUpdate()->first();
                if (! $material) {
                    throw new InvalidArgumentException('Bahan baku produk tidak valid atau tidak aktif.');
                }

                $quantity = (float) $row['quantity'];
                if ($quantity <= 0) {
                    throw new InvalidArgumentException('Jumlah pemakaian bahan baku harus lebih besar dari nol.');
                }

                $unitCost = max(0, (float) $material->average_cost);
                $totalCost = $quantity * $unitCost;
                $materialCost += $totalCost;

                DB::table('product_materials')->insert([
                    'product_id' => $productId,
                    'raw_material_id' => $material->id,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'total_cost' => $totalCost,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $labor = max(0, (float) ($data['labor_cost'] ?? 0));
            $overhead = max(0, (float) ($data['overhead_cost'] ?? 0));
            $other = max(0, (float) ($data['other_cost'] ?? 0));
            $hpp = $materialCost + $labor + $overhead + $other;
            $margin = max(0, (float) ($data['margin_percent'] ?? 0));
            $suggested = round($hpp * (1 + $margin / 100), 2);
            $selling = array_key_exists('selling_price', $data) && $data['selling_price'] !== null && $data['selling_price'] !== ''
                ? max(0, (float) $data['selling_price'])
                : $suggested;

            ProductCostingModel::query()->updateOrCreate(
                ['product_id' => $productId],
                [
                    'store_id' => $product->store_id,
                    'material_cost' => $materialCost,
                    'labor_cost' => $labor,
                    'overhead_cost' => $overhead,
                    'other_cost' => $other,
                    'hpp' => $hpp,
                    'margin_percent' => $margin,
                    'suggested_price' => $suggested,
                    'selling_price' => $selling,
                ]
            );

            if (($data['apply_to_variants'] ?? false) && $selling > 0) {
                $variants = DB::table('product_variants')->where('product_id', $productId)->select('id', 'price_original')->get();

                foreach ($variants as $variant) {
                    $discount = $variant->price_original !== null && (float) $variant->price_original > $selling;

                    DB::table('product_variants')->where('id', $variant->id)->update([
                        'price' => $selling,
                        'price_original' => $discount ? $variant->price_original : null,
                        'price_sale' => $discount ? $selling : null,
                        'updated_at' => now(),
                    ]);
                }
            }

            return $this->get($productId, (int) $product->store_id);
        });
    }

    public function refreshForRawMaterial(int $rawMaterialId, ?int $costHistoryId, mixed $occurredAt = null): int
    {
        $material = RawMaterialModel::query()->find($rawMaterialId);
        if (! $material) {
            return 0;
        }

        $productIds = DB::table('product_materials')->where('raw_material_id', $rawMaterialId)->pluck('product_id')->map(fn ($id) => (int) $id)->unique()->values();
        $updated = 0;

        foreach ($productIds as $productId) {
            DB::transaction(function () use ($material, $productId, $costHistoryId, $occurredAt, &$updated): void {
                $costing = ProductCostingModel::query()->where('product_id', $productId)->lockForUpdate()->first();
                if (! $costing) {
                    return;
                }

                $recipe = DB::table('product_materials')->where('product_id', $productId)->where('raw_material_id', $material->id)->lockForUpdate()->first();
                if (! $recipe) {
                    return;
                }

                $oldMaterialCost = (float) $costing->material_cost;
                $oldHpp = (float) $costing->hpp;
                $oldSuggested = (float) $costing->suggested_price;
                $newUnitCost = max(0, (float) $material->average_cost);
                $newRecipeTotal = (float) $recipe->quantity * $newUnitCost;

                DB::table('product_materials')->where('id', $recipe->id)->update([
                    'unit_cost' => $newUnitCost,
                    'total_cost' => $newRecipeTotal,
                    'updated_at' => now(),
                ]);

                $newMaterialCost = (float) DB::table('product_materials')->where('product_id', $productId)->sum('total_cost');
                $newHpp = $newMaterialCost + (float) $costing->labor_cost + (float) $costing->overhead_cost + (float) $costing->other_cost;
                $newSuggested = round($newHpp * (1 + (float) $costing->margin_percent / 100), 2);

                $costing->forceFill([
                    'material_cost' => $newMaterialCost,
                    'hpp' => $newHpp,
                    'suggested_price' => $newSuggested,
                ])->save();

                if (abs($newHpp - $oldHpp) < 0.0001 && abs($newMaterialCost - $oldMaterialCost) < 0.0001) {
                    return;
                }

                $changeAmount = $newHpp - $oldHpp;
                $changePercent = $oldHpp > 0 ? ($changeAmount / $oldHpp) * 100 : ($newHpp > 0 ? 100 : 0);

                ProductCostingImpactModel::query()->create([
                    'store_id' => $costing->store_id,
                    'product_id' => $productId,
                    'raw_material_id' => $material->id,
                    'raw_material_cost_history_id' => $costHistoryId,
                    'old_material_cost' => $oldMaterialCost,
                    'new_material_cost' => $newMaterialCost,
                    'old_hpp' => $oldHpp,
                    'new_hpp' => $newHpp,
                    'hpp_change_amount' => $changeAmount,
                    'hpp_change_percent' => $changePercent,
                    'old_suggested_price' => $oldSuggested,
                    'new_suggested_price' => $newSuggested,
                    'trigger_type' => 'raw_material_cost_change',
                    'occurred_at' => $occurredAt ?: now(),
                ]);
                $updated++;
            });
        }

        return $updated;
    }
}
