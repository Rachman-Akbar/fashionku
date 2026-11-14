<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Domains\Shared\Settings\Application\Services\AppSettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class ProductSearchAndFacetsTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_public_catalog_returns_facets(): void
    {
        $seller = $this->actingAsSeller();

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
        $this->assertArrayHasKey('price_range', $facets);
    }

    public function test_public_catalog_filters_by_price_range(): void
    {
        $seller = $this->actingAsSeller();

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
        $seller = $this->actingAsSeller();

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

    public function test_public_catalog_facets_include_shop_location_when_configured(): void
    {
        $seller = $this->actingAsSeller();

        // Set up shop profile with location
        app(\App\Domains\Shared\Settings\Application\Services\AppSettingService::class)->putMany([
            'store.city' => 'Bandung',
            'store.province' => 'Jawa Barat',
        ], 'store');

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Keripik Bandung',
            'price' => 50000,
            'status' => 'published',
            'variants' => [['name' => 'Standar', 'price' => 50000]],
        ])->assertOk();

        // Facets should include shop location from app_settings
        $response = $this->getJson('/api/v1/catalog/products')->assertOk();
        $facets = $response->json('facets');
        $this->assertIsArray($facets['locations']);
        $this->assertNotEmpty($facets['locations']);
        $this->assertContains('Bandung', $facets['locations']);
        $this->assertContains('Jawa Barat', $facets['locations']);

        // All products belong to the single shop, so location filter returns all products
        $location = $facets['locations'][0];
        $ok = $this->getJson("/api/v1/catalog/products?locations[]={$location}");
        $ok->assertOk();
        $this->assertContains('Keripik Bandung', collect($ok->json('data'))->pluck('name')->all());
    }
}