<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class StoreCrudTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function storePayload(array $overrides = []): array
    {
        return array_merge([
            'store_name' => 'Toko Sejahtera',
            'description' => 'Toko kelontong berkualitas.',
            'short_description' => 'Toko kelontong.',
            'phone' => '081234567890',
            'email' => 'store@example.com',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'address' => 'Jl. Melati No. 10, Jakarta',
            'detail' => [
                'shipping_policy' => 'Pengiriman dikirim dalam 1x24 jam.',
                'return_policy' => 'Barang dapat dikembalikan dalam 7 hari.',
                'open_days' => 'Senin - Sabtu',
                'whatsapp_url' => 'https://wa.me/081234567890',
            ],
        ], $overrides);
    }

    public function test_self_service_seller_registration_route_is_removed(): void
    {
        $this->actingAsRole('seller');

        $this->postJson('/api/v1/identity/auth/register-seller', $this->storePayload())
            ->assertNotFound();
    }

    public function test_seller_can_update_own_store(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        $this->putJson('/api/v1/seller/store', [
            'store_name' => 'Toko Maju',
            'description' => 'Deskripsi baru.',
            'phone' => '081299998888',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'address' => 'Jl. Baru No. 1',
        ])->assertOk();

        $store->refresh();
        $this->assertSame('Toko Maju', $store->name);
        $this->assertSame('Bandung', $store->city);
    }

    public function test_admin_can_operate_the_seller_store_panel(): void
    {
        // Single-store: admin adalah operator/penjual yang sama.
        $admin = $this->actingAsRole('admin');
        $this->makeStore($admin);

        $this->putJson('/api/v1/seller/store', [
            'store_name' => 'Toko Admin',
            'description' => 'Dikelola admin.',
            'phone' => '081200001111',
            'city' => 'Surabaya',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Admin No. 2',
        ])->assertOk();

        $store = StoreModel::query()->whereNull('deleted_at')->orderBy('id')->first();
        $this->assertNotNull($store);
        $this->assertSame('Toko Admin', $store->name);
    }
}
