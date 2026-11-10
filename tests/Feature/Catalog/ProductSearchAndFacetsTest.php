<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class ProductSearchAndFacetsTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_public_catalog_returns_facets(): void
    {
        [$seller, $store] = $this->actingAsSeller([], ['city' => 'Surabaya', 'province' => 'Jawa Timur']);

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Speaker Portable',
            'price' => 250000,
            'status' => 'published',
            'variants' => [['name' => 'Standar', 'price' => 250000]],
        ])->assertOk();

        $response = $this->getJson('/api/v1/catalog/products')
            ->assertOk();

        $facets = $response->json('facets');
        $this->assertIsArray($facets);
        $this->assertArrayHasKey('locations', $facets);
        $this->assertArrayHasKey('store_types', $facets);
        $this->assertArrayHasKey('price_range', $facets);
        $this->assertContains('Surabaya', $facets['locations']);
    }

    public function test_public_catalog_filters_by_store_type_and_discount(): void
    {
        [$seller, $store] = $this->actingAsSeller([], ['store_type' => 'power_merchant']);
        $store->forceFill(['store_type' => 'power_merchant'])->save();

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Produk Promo',
            'price' => 100000,
            'price_original' => 125000,
            'status' => 'published',
            'variants' => [
                ['name' => 'Standar', 'price' => 100000, 'price_original' => 125000],
            ],
        ])->assertOk();

        $plain = $this->getJson('/api/v1/catalog/products');
        $plain->assertOk();

        $byType = $this->getJson('/api/v1/catalog/products?store_type=power_merchant');
        $byType->assertOk();
        $this->assertContains('Produk Promo', collect($byType->json('data'))->pluck('name')->all());

        $byTypeOther = $this->getJson('/api/v1/catalog/products?store_type=official');
        $byTypeOther->assertOk();
        $this->assertNotContains('Produk Promo', collect($byTypeOther->json('data'))->pluck('name')->all());

        $byDiscount = $this->getJson('/api/v1/catalog/products?has_discount=1');
        $byDiscount->assertOk();
        $this->assertContains('Produk Promo', collect($byDiscount->json('data'))->pluck('name')->all());
    }

    public function test_public_catalog_filters_by_price_range(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        foreach ([100000, 500000, 900000] as $price) {
            $this->postJson('/api/v1/catalog/seller/products', [
                'name' => "Produk {$price}",
                'price' => $price,
                'status' => 'published',
                'variants' => [['name' => 'Standar', 'price' => $price]],
            ])->assertOk();
        }

        $range = $this->getJson('/api/v1/catalog/products?min_price=200000&max_price=600000');
        $range->assertOk();
        $names = collect($range->json('data'))->pluck('name')->all();
        $this->assertContains('Produk 500000', $names);
        $this->assertNotContains('Produk 100000', $names);
        $this->assertNotContains('Produk 900000', $names);
    }

    public function test_public_catalog_sort_values(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        foreach ([300000, 100000, 200000] as $price) {
            $this->postJson('/api/v1/catalog/seller/products', [
                'name' => "Produk {$price}",
                'price' => $price,
                'status' => 'published',
                'variants' => [['name' => 'Standar', 'price' => $price]],
            ])->assertOk();
        }

        $priceAsc = $this->getJson('/api/v1/catalog/products?sort=price_asc');
        $priceAsc->assertOk();
        $this->assertSame(
            ['Produk 100000', 'Produk 200000', 'Produk 300000'],
            collect($priceAsc->json('data'))->pluck('name')->all(),
        );

        $priceDesc = $this->getJson('/api/v1/catalog/products?sort=price_desc');
        $priceDesc->assertOk();
        $this->assertSame(
            ['Produk 300000', 'Produk 200000', 'Produk 100000'],
            collect($priceDesc->json('data'))->pluck('name')->all(),
        );
    }

    public function test_public_catalog_filters_by_location_array(): void
    {
        [$seller, $store] = $this->actingAsSeller([], ['city' => 'Bandung', 'province' => 'Jawa Barat']);

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Keripik Bandung',
            'price' => 50000,
            'status' => 'published',
            'variants' => [['name' => 'Standar', 'price' => 50000]],
        ])->assertOk();

        $ok = $this->getJson('/api/v1/catalog/products?locations[]=Bandung');
        $ok->assertOk();
        $this->assertContains('Keripik Bandung', collect($ok->json('data'))->pluck('name')->all());

        $miss = $this->getJson('/api/v1/catalog/products?locations[]=Medan');
        $miss->assertOk();
        $this->assertNotContains('Keripik Bandung', collect($miss->json('data'))->pluck('name')->all());
    }

    public function test_public_catalog_filters_by_store_id_keeps_facets(): void
    {
        [$seller, $store] = $this->actingAsSeller([], ['city' => 'Surabaya', 'province' => 'Jawa Timur']);

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Produk Toko',
            'price' => 175000,
            'status' => 'published',
            'variants' => [['name' => 'Standar', 'price' => 175000]],
        ])->assertOk();

        $response = $this->getJson('/api/v1/catalog/products?store_id='.$store->id)
            ->assertOk();

        $facets = $response->json('facets');
        $this->assertIsArray($facets);
        $this->assertArrayHasKey('price_range', $facets);
        $this->assertSame(
            ['Produk Toko'],
            collect($response->json('data'))->pluck('name')->all(),
        );
    }
}
