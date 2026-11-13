<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Endpoint bahan baku (seller/inventory/*) sempat tidak diregistrasi sehingga
 * fitur bahan baku/HPP tidak dapat diakses. Test ini menjaga route tetap aktif.
 */
class RawMaterialApiTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAsSeller();
        $this->grantPermission('stock.manage');
    }

    private function grantPermission(string $name): void
    {
        $roleId = DB::table('roles')->where('name', 'seller')->value('id');
        $now = now();

        $permissionId = DB::table('permissions')->insertGetId([
            'name' => $name,
            'description' => $name,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('role_permissions')->insert([
            'role_id' => $roleId,
            'permission_id' => $permissionId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function test_raw_material_endpoints_are_registered(): void
    {
        $this->getJson('/api/v1/seller/inventory/materials')
            ->assertOk()
            ->assertJsonStructure(['data']);

        $this->getJson('/api/v1/seller/inventory/material-movements')->assertOk();
        $this->getJson('/api/v1/seller/inventory/cost-impacts')->assertOk();
    }

    public function test_seller_can_create_show_update_and_delete_a_material(): void
    {
        $create = $this->postJson('/api/v1/seller/inventory/materials', [
            'name' => 'Kain Katun',
            'unit' => 'meter',
            'average_cost' => 15000,
        ]);

        $create->assertStatus(201);
        $id = $create->json('data.id');
        $this->assertNotNull($id);

        // Kode dibuat otomatis dari pola kode.
        $this->assertNotEmpty($create->json('data.code'));

        $this->putJson("/api/v1/seller/inventory/materials/{$id}", [
            'name' => 'Kain Katun Premium',
            'unit' => 'meter',
        ])->assertOk();

        $this->assertDatabaseHas('raw_materials', ['id' => $id, 'name' => 'Kain Katun Premium']);

        $this->deleteJson("/api/v1/seller/inventory/materials/{$id}")->assertOk();
        $this->assertSoftDeleted('raw_materials', ['id' => $id]);
    }

    public function test_buyer_cannot_access_inventory(): void
    {
        $this->actingAsRole('buyer');

        $this->getJson('/api/v1/seller/inventory/materials')->assertForbidden();
    }
}
