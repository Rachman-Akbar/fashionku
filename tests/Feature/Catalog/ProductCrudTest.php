<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_seller_can_create_update_and_delete_product(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        $create = $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Kulkas 2 Pintu',
            'brand' => 'Sharp',
            'description' => 'Kulkas hemat energi',
            'price' => 2500000,
            'stock' => 10,
        ]);

        $create->assertOk();
        $id = $create->json('data.id') ?? $create->json('id');
        $this->assertNotNull($id, 'Product id must be returned on create');
        $this->assertSame(1, ProductModel::query()->where('store_id', $store->id)->where('id', $id)->count());

        $update = $this->putJson("/api/v1/catalog/seller/products/{$id}", [
            'name' => 'Kulkas 2 Pintu Updated',
        ]);
        $update->assertOk();
        $this->assertSame('Kulkas 2 Pintu Updated', ProductModel::query()->find($id)->name);

        $this->deleteJson("/api/v1/catalog/seller/products/{$id}")->assertOk();
        $this->assertSoftDeleted('products', ['id' => $id]);
    }

    public function test_public_catalog_lists_published_product(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Tas Ransel',
            'price' => 150000,
            'status' => 'published',
        ])->assertOk();

        $catalog = $this->getJson('/api/v1/catalog/products')
            ->assertOk();

        $names = collect($catalog->json('data.data') ?? $catalog->json('data'))
            ->pluck('name')
            ->all();

        $this->assertContains('Tas Ransel', $names);
    }

    public function test_buyer_cannot_create_product(): void
    {
        $this->actingAsRole('buyer');

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Nope',
        ])->assertForbidden();
    }

    public function test_public_catalog_sets_cache_headers(): void
    {
        [$seller, $store] = $this->actingAsSeller();

        $this->postJson('/api/v1/catalog/seller/products', [
            'name' => 'Produk Cache',
            'price' => 100000,
            'status' => 'published',
        ])->assertOk();

        $this->get('/api/v1/catalog/products')
            ->assertOk()
            ->assertHeader('Cache-Control', 'max-age=60, public')
            ->assertHeader('ETag');

        $this->get('/api/v1/catalog/categories')
            ->assertOk()
            ->assertHeader('Cache-Control', 'max-age=60, public');
    }
}
