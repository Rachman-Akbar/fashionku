<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class ProductCostingImpactTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_product_costing_and_variant_price_changes_are_reported(): void
    {
        $this->actingAsSeller();

        $productResponse = $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Produk Laporan HPP',
            'price' => 1000,
        ])->assertOk();
        $productId = (int) ($productResponse->json('data.id') ?? $productResponse->json('id'));
        $variantId = (int) DB::table('product_variants')->where('product_id', $productId)->value('id');

        $materialId = DB::table('raw_materials')->insertGetId([
            'code' => 'RM-HPP-1',
            'name' => 'Bahan Laporan',
            'average_cost' => 500,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $costingPath = "/api/v1/catalog/seller/products/{$productId}/costing";
        $this->putJson($costingPath, [
            'materials' => [['raw_material_id' => $materialId, 'quantity' => 2]],
            'labor_cost' => 200,
            'yield_quantity' => 2,
            'margin_percent' => 50,
            'selling_price' => 1200,
        ])->assertOk();

        $this->assertDatabaseHas('product_costing_impacts', [
            'product_id' => $productId,
            'trigger_type' => 'product_costing_change',
            'old_hpp' => 0,
            'new_hpp' => 600,
            'old_selling_price' => 1000,
            'new_selling_price' => 1200,
        ]);

        $this->putJson("/api/v1/catalog/seller/products/{$productId}/costing", [
            'materials' => [['raw_material_id' => $materialId, 'quantity' => 3]],
            'labor_cost' => 200,
            'yield_quantity' => 2,
            'margin_percent' => 50,
            'selling_price' => 1500,
        ])->assertOk();

        $this->assertDatabaseHas('product_costing_impacts', [
            'product_id' => $productId,
            'trigger_type' => 'product_costing_change',
            'old_hpp' => 600,
            'new_hpp' => 850,
            'old_selling_price' => 1200,
            'new_selling_price' => 1500,
        ]);

        $this->putJson("/api/v1/catalog/seller/products/{$productId}", [
            'variants' => [[
                'id' => $variantId,
                'name' => 'Produk Laporan HPP',
                'price' => 1000,
                'price_sale' => 1800,
            ]],
        ])->assertOk();

        $this->assertDatabaseHas('product_costing_impacts', [
            'product_id' => $productId,
            'product_variant_id' => $variantId,
            'trigger_type' => 'product_price_change',
            'old_selling_price' => 1000,
            'new_selling_price' => 1800,
            'hpp_change_amount' => 0,
        ]);
    }
}
