<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Shared\Settings\Infrastructure\Persistence\Models\AppSettingModel;
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
        $seller = $this->actingAsSeller();

        $this->postJson('/api/v1/identity/auth/register-seller', $this->storePayload())
            ->assertNotFound();
    }

    public function test_seller_can_get_shop_profile(): void
    {
        $seller = $this->actingAsSeller();

        $response = $this->getJson('/api/v1/seller/settings/store')
            ->assertOk();

        $this->assertTrue($response->json('success'));
        $this->assertArrayHasKey('data', $response->json());
    }

    public function test_seller_can_update_shop_profile(): void
    {
        $seller = $this->actingAsSeller();

        $response = $this->putJson('/api/v1/seller/settings/store', [
            'store_name' => 'Toko Maju',
            'description' => 'Deskripsi baru.',
            'city' => 'Bandung',
        ])->assertOk();

        $this->assertTrue($response->json('success'));

        // Verify persisted in app_settings
        $this->assertDatabaseHas('app_settings', [
            'key' => 'store.name',
            'value' => 'Toko Maju',
        ]);

        // Verify GET returns updated profile
        $get = $this->getJson('/api/v1/seller/settings/store')->assertOk();
        $this->assertSame('Toko Maju', $get->json('data.store_name'));
        $this->assertSame('Deskripsi baru.', $get->json('data.description'));
        $this->assertSame('Bandung', $get->json('data.city'));
    }

    public function test_admin_can_operate_shop_profile(): void
    {
        $admin = $this->actingAsRole('admin');

        $this->putJson('/api/v1/seller/settings/store', [
            'store_name' => 'Toko Admin',
            'description' => 'Dikelola admin.',
            'phone' => '081200001111',
            'city' => 'Surabaya',
        ])->assertOk();

        $this->assertDatabaseHas('app_settings', [
            'key' => 'store.name',
            'value' => 'Toko Admin',
        ]);

        $get = $this->getJson('/api/v1/seller/settings/store')->assertOk();
        $this->assertSame('Toko Admin', $get->json('data.store_name'));
    }
}