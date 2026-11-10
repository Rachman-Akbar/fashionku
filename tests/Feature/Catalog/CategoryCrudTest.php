<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Models\CatalogGroupModel;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function makeGroup(string $name = 'Group A'): CatalogGroupModel
    {
        return CatalogGroupModel::query()->create([
            'name' => $name,
            'slug' => Str::slug($name).'-'.strtolower(Str::random(4)),
            'is_active' => true,
        ]);
    }

    public function test_seller_can_create_show_update_and_delete_category(): void
    {
        $this->actingAsSeller();
        $group = $this->makeGroup();

        $create = $this->postJson('/api/v1/catalog/categories', [
            'catalog_group_id' => $group->id,
            'name' => 'Outerwear',
            'slug' => 'outerwear',
        ]);
        $create->assertStatus(201);
        $create->assertJsonPath('success', true);
        $id = $create->json('data.id');
        $this->assertNotNull($id);

        $this->getJson("/api/v1/catalog/categories/{$id}")->assertOk()->assertJsonPath('data.id', $id);

        $update = $this->putJson("/api/v1/catalog/categories/{$id}", [
            'name' => 'Outerwear Updated',
        ]);
        $update->assertOk();
        $this->assertSame('Outerwear Updated', CategoryModel::query()->find($id)->name);

        $this->deleteJson("/api/v1/catalog/categories/{$id}")->assertOk();
        $this->assertSoftDeleted('categories', ['id' => $id]);
    }

    public function test_seller_can_list_manage_and_menu_endpoints(): void
    {
        $this->actingAsSeller();
        $group = $this->makeGroup();

        $this->postJson('/api/v1/catalog/categories', [
            'catalog_group_id' => $group->id,
            'name' => 'Aksesori',
        ])->assertCreated();

        $this->getJson('/api/v1/catalog/categories')->assertOk()->assertJsonStructure(['data']);
        $this->getJson('/api/v1/catalog/categories/manage')->assertOk()->assertJsonStructure(['data']);
        $this->getJson('/api/v1/catalog/categories/menu')->assertOk()->assertJsonStructure(['data']);
    }

    public function test_buyer_cannot_manage_categories(): void
    {
        $this->actingAsRole('buyer');

        $this->getJson('/api/v1/catalog/categories/manage')->assertForbidden();
        $this->postJson('/api/v1/catalog/categories', ['name' => 'X'])->assertForbidden();
    }

    public function test_seller_cannot_create_duplicate_category_name_within_group(): void
    {
        $this->actingAsSeller();
        $group = $this->makeGroup();

        $this->postJson('/api/v1/catalog/categories', [
            'catalog_group_id' => $group->id,
            'name' => 'Duplikat',
        ])->assertCreated();

        $this->postJson('/api/v1/catalog/categories', [
            'catalog_group_id' => $group->id,
            'name' => 'Duplikat',
        ])->assertStatus(422);
    }
}
