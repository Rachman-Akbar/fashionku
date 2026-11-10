<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class StoreDirectoryApiTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function makeStoreRow(string $name, string $city, string $province, string $storeType = 'regular'): StoreModel
    {
        $seller = $this->actingAsRole('seller');

        return $this->makeStore($seller, [
            'name' => $name,
            'city' => $city,
            'province' => $province,
            'store_type' => $storeType,
        ]);
    }

    public function test_public_stores_list_includes_store_type(): void
    {
        $this->createStoreWithoutUser();

        $response = $this->getJson('/api/v1/seller/stores')->assertOk();

        $stores = $response->json('data') ?? [];
        $this->assertIsArray($stores);
        $this->assertNotEmpty($stores);
        $this->assertArrayHasKey('store_type', $stores[0]);
    }

    public function test_public_stores_filter_by_store_type_and_search(): void
    {
        $this->makeStoreRow('Toko Official', 'Jakarta', 'DKI Jakarta', 'official');
        $this->makeStoreRow('Toko Biasa', 'Bandung', 'Jawa Barat', 'regular');

        $official = $this->getJson('/api/v1/seller/stores?store_type=official')->assertOk();
        $names = collect($official->json('data'))->pluck('name')->all();
        $this->assertContains('Toko Official', $names);
        $this->assertNotContains('Toko Biasa', $names);

        $search = $this->getJson('/api/v1/seller/stores?search=Bandung')->assertOk();
        $save = collect($search->json('data'))->pluck('name')->all();
        $this->assertContains('Toko Biasa', $save);
        $this->assertNotContains('Toko Official', $save);
    }

    public function test_public_stores_filter_by_location_array(): void
    {
        $this->makeStoreRow('Toko A', 'Malang', 'Jawa Timur');
        $this->makeStoreRow('Toko B', 'Medan', 'Sumatera Utara');

        $hit = $this->getJson('/api/v1/seller/stores?locations[]=Malang')->assertOk();
        $this->assertContains('Toko A', collect($hit->json('data'))->pluck('name')->all());
        $this->assertNotContains('Toko B', collect($hit->json('data'))->pluck('name')->all());

        $sort = $this->getJson('/api/v1/seller/stores?sort=name&sort_direction=asc')->assertOk();
        $names = collect($sort->json('data'))->pluck('name')->all();
        $this->assertSame($names, collect($names)->sort()->values()->all());
    }

    private function createStoreWithoutUser(): StoreModel
    {
        $seller = $this->actingAsRole('seller');

        return $this->makeStore($seller, ['name' => 'Store Standalone']);
    }
}
