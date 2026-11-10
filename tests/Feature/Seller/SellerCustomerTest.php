<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Endpoint /api/v1/seller/customers — CRUD daftar pelanggan toko.
 * Pelanggan terdiri dari buyer yang pernah bertransaksi dan pelanggan manual.
 */
class SellerCustomerTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private int $storeId;

    private $seller;

    protected function setUp(): void
    {
        parent::setUp();

        [$seller, $store] = $this->actingAsSeller();
        $this->seller = $seller;
        $this->storeId = (int) $store->id;
        $this->makeRole('buyer');
        $this->grantSellerPermissions(['orders.view']);
    }

    private function grantSellerPermissions(array $names): void
    {
        $roleId = DB::table('roles')->where('name', 'seller')->whereNull('deleted_at')->value('id');
        $now = now();

        foreach ($names as $name) {
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
    }

    private function makeOrderForBuyer(string $userId, int $storeId, float $total = 100000, string $status = 'completed'): void
    {
        $orderId = (int) DB::table('orders')->insertGetId([
            'order_number' => 'CUS-'.Str::upper(Str::random(6)),
            'user_id' => $userId,
            'status' => $status,
            'payment_status' => 'paid',
            'payment_method' => 'midtrans',
            'shipping_address' => 'Penerima - 0812 - Alamat',
            'total_amount' => $total,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_orders')->insert([
            'order_id' => $orderId,
            'store_id' => $storeId,
            'sub_order_number' => 'CUS-SUB-'.Str::upper(Str::random(6)),
            'total_items_price' => $total,
            'shipping_cost' => 0,
            'courier' => 'jne',
            'destination_id' => 'MANUAL-X',
            'status' => $status,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_seller_can_list_customers_from_transactions(): void
    {
        $buyer = $this->makeUser(['name' => 'Pembeli Aktif']);
        $this->makeOrderForBuyer($buyer->id, $this->storeId, 250000, 'completed');

        $response = $this->getJson('/api/v1/seller/customers?per_page=20');

        $response->assertStatus(200)->assertJsonPath('success', true);
        $row = collect($response->json('data'))->first(fn (array $row) => $row['id'] === $buyer->id);
        $this->assertNotNull($row);
        $this->assertSame('Pembeli Aktif', $row['name']);
        $this->assertSame(1, $row['orders_count']);
        $this->assertEqualsWithDelta(250000.0, (float) $row['total_spent'], 0.01);
        $this->assertFalse($row['is_manual']);
    }

    public function test_seller_can_create_manual_customer(): void
    {
        $response = $this->postJson('/api/v1/seller/customers', [
            'name' => 'Pelanggan Manual',
            'email' => 'manual@example.test',
            'is_active' => true,
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $id = $response->json('data.id');

        $this->assertDatabaseHas('users', ['id' => $id, 'email' => 'manual@example.test', 'name' => 'Pelanggan Manual']);
        $this->assertDatabaseHas('seller_customers', ['store_id' => $this->storeId, 'user_id' => $id]);

        $user = User::query()->find($id);
        $this->assertTrue($user->hasRole('buyer'));

        $list = $this->getJson('/api/v1/seller/customers');
        $row = collect($list->json('data'))->first(fn (array $row) => $row['id'] === $id);
        $this->assertNotNull($row);
        $this->assertTrue($row['is_manual']);
        $this->assertSame(0, $row['orders_count']);
    }

    public function test_seller_can_update_customer_profile(): void
    {
        $created = $this->postJson('/api/v1/seller/customers', [
            'name' => 'Awal',
            'email' => 'awal@example.test',
        ])->json('data.id');

        $response = $this->patchJson('/api/v1/seller/customers/'.$created, [
            'name' => 'Nama Baru',
            'email' => 'baru@example.test',
            'is_active' => false,
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);
        $response->assertJsonPath('data.name', 'Nama Baru');
        $response->assertJsonPath('data.email', 'baru@example.test');
        $response->assertJsonPath('data.is_active', false);
    }

    public function test_seller_can_delete_customer(): void
    {
        $created = $this->postJson('/api/v1/seller/customers', [
            'name' => 'Hapus Saya',
            'email' => 'hapus@example.test',
        ])->json('data.id');

        $response = $this->deleteJson('/api/v1/seller/customers/'.$created);

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertSoftDeleted('users', ['id' => $created]);
        $this->assertDatabaseMissing('seller_customers', ['store_id' => $this->storeId, 'user_id' => $created]);

        $list = $this->getJson('/api/v1/seller/customers')->json('data');
        $this->assertEmpty(collect($list)->first(fn (array $row) => $row['id'] === $created));
    }

    public function test_create_customer_requires_unique_email(): void
    {
        $existing = $this->makeUser(['email' => 'dipakai@example.test']);

        $this->postJson('/api/v1/seller/customers', [
            'name' => 'Duplikat',
            'email' => $existing->email,
        ])->assertStatus(422);
    }

    public function test_customer_of_other_store_cannot_be_updated_or_deleted(): void
    {
        $otherSeller = $this->makeUser([], ['seller']);
        $foreignStore = $this->makeStore($otherSeller, [
            'name' => 'Toko Asing',
            'slug' => 'toko-asing-'.strtolower(\Illuminate\Support\Str::random(6)),
            'is_active' => false,
        ]);
        $buyer = $this->makeUser();
        $this->makeOrderForBuyer($buyer->id, (int) $foreignStore->id);

        $this->patchJson('/api/v1/seller/customers/'.$buyer->id, [
            'name' => 'Curi Data',
            'email' => 'curi@example.test',
        ])->assertStatus(422);

        $this->deleteJson('/api/v1/seller/customers/'.$buyer->id)->assertStatus(422);

        $this->assertNotSoftDeleted('users', ['id' => $buyer->id]);
    }

    public function test_admin_cannot_mutate_customers(): void
    {
        $this->actAsAdmin();

        $this->postJson('/api/v1/seller/customers', [
            'name' => 'Admin Coba',
            'email' => 'admin@example.test',
        ])->assertStatus(403);

        $this->deleteJson('/api/v1/seller/customers/does-not-matter')->assertStatus(403);
    }

    private function actAsAdmin(): void
    {
        $admin = $this->actingAsRole('admin');
        $this->assertNotNull($admin);
    }
}
