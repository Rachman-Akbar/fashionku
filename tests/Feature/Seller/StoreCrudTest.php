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
                'open_time' => '08:00',
                'close_time' => '17:00',
                'whatsapp_url' => 'https://wa.me/081234567890',
            ],
        ], $overrides);
    }

    public function test_seller_can_register_a_store(): void
    {
        $seller = $this->actingAsRole('seller');

        $response = $this->postJson('/api/v1/identity/auth/register-seller', $this->storePayload())
            ->assertStatus(201);

        $this->assertDatabaseCount('stores', 1);
        $store = StoreModel::query()->where('user_id', $seller->id)->first();
        $this->assertNotNull($store);
        $this->assertSame('approved', $store->status);
    }

    public function test_a_new_user_registers_a_store_and_is_granted_the_seller_role(): void
    {
        $this->makeRole('buyer');
        $this->makeRole('seller');
        $user = $this->makeUser();

        $token = $this->tokenFor($user, 'buyer');

        $this->withToken($token)
            ->postJson('/api/v1/identity/auth/register-seller', $this->storePayload())
            ->assertCreated();

        $this->assertTrue($user->fresh()->hasRole('seller'));
    }

    public function test_seller_can_update_own_store(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        $this->putJson("/api/v1/seller/store", [
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
}
