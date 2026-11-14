<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Identity\User\Domain\Entities\Permission;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Endpoint PUT /api/v1/order/reviews/{id} — moderasi review (toggle is_active).
 */
class ReviewModerationTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private int $variantId;

    private int $orderItemId;

    private int $productId;

    protected function setUp(): void
    {
        parent::setUp();

        $seller = $this->makeUser(['name' => 'Seller Moderasi'], ['seller']);

        $product = $this->app->make(CreateProductUseCase::class)->execute([
            'name' => 'Produk Moderasi',
            'price' => 40000,
            'variants' => [
                ['name' => 'Standar', 'price' => 40000, 'po_stock' => 0],
            ],
        ]);

        $this->variantId = (int) $product->variants()[0]->id();
        $this->productId = (int) DB::table('product_variants')->where('id', $this->variantId)->value('product_id');

        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => 5,
            'movement_type' => 'inbound',
            'notes' => 'Stok awal untuk tes moderasi',
        ]);

        $orderId = DB::table('orders')->insertGetId([
            'order_number' => 'MOD-'.strtoupper((string) Str::random(8)),
            'user_id' => $seller->id,
            'total_amount' => 50000,
            'discount_amount' => 0,
            'shipping_discount_amount' => 0,
            'status' => 'completed',
            'payment_status' => 'paid',
            'payment_method' => 'tunai_toko',
            'shipping_address' => 'Jl. Moderasi No. 1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $subOrderId = DB::table('sub_orders')->insertGetId([
            'order_id' => $orderId,
            'sub_order_number' => 'MOD-S-'.strtoupper((string) Str::random(8)),
            'total_items_price' => 40000,
            'shipping_cost' => 10000,
            'courier' => 'jne',
            'service' => 'Reguler',
            'destination_id' => '1',
            'status' => 'completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $variantSku = DB::table('product_variants')->where('id', $this->variantId)->value('sku');
        $this->orderItemId = (int) DB::table('order_items')->insertGetId([
            'sub_order_id' => $subOrderId,
            'product_id' => $this->productId,
            'variant_id' => $this->variantId,
            'product_name' => 'Produk Moderasi',
            'sku' => $variantSku ?: 'MOD-SKU',
            'price' => 40000,
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function givePermission(string $roleName, string $permission): void
    {
        $permissionId = Permission::query()->create([
            'name' => $permission,
            'description' => $permission,
            'is_active' => true,
        ])->id;

        DB::table('role_permissions')->updateOrInsert(
            ['role_id' => DB::table('roles')->where('name', $roleName)->value('id')],
            ['permission_id' => $permissionId],
        );
    }

    private function createReview($buyerId, bool $isActive = true): int
    {
        $orderId = DB::table('sub_orders')->where('id', DB::table('order_items')->where('id', $this->orderItemId)->value('sub_order_id'))->value('order_id');

        return (int) ProductReviewModel::query()->create([
            'product_id' => $this->productId,
            'order_id' => $orderId,
            'order_item_id' => $this->orderItemId,
            'user_id' => $buyerId,
            'rating' => 5,
            'review' => 'Barang bagus.',
            'media' => null,
            'is_active' => $isActive,
        ])->id;
    }

    public function test_seller_can_toggle_review_inactive_and_back(): void
    {
        $buyer = $this->makeUser(['name' => 'Buyer Ulasan'], ['buyer']);
        $this->givePermission('buyer', 'reviews.create');
        $reviewId = $this->createReview($buyer->id, true);

        $seller = $this->makeUser(['name' => 'Seller Moderasi User'], ['seller']);
        $this->givePermission('seller', 'reviews.manage');
        $this->withToken($this->tokenFor($seller, 'seller'));
        $this->app['auth']->forgetGuards();

        $this->putJson("/api/v1/order/reviews/{$reviewId}", [
            'rating' => 5,
            'review' => 'Barang bagus.',
            'media' => null,
            'is_active' => false,
        ])
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_active', false);

        $this->assertSame(0, DB::table('product_reviews')->where('id', $reviewId)->value('is_active'));

        $this->putJson("/api/v1/order/reviews/{$reviewId}", [
            'rating' => 5,
            'review' => 'Barang bagus.',
            'media' => null,
            'is_active' => true,
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.is_active', true);

        $this->assertSame(1, DB::table('product_reviews')->where('id', $reviewId)->value('is_active'));
        $this->assertSame((string) $seller->id, (string) DB::table('product_reviews')->where('id', $reviewId)->value('updated_by'));
    }

    public function test_owner_cannot_deactivate_own_review_via_is_active(): void
    {
        $buyer = $this->makeUser(['name' => 'Buyer Pemilik'], ['buyer']);
        $this->givePermission('buyer', 'reviews.create');
        $this->withToken($this->tokenFor($buyer, 'buyer'));
        $this->app['auth']->forgetGuards();

        $reviewId = $this->createReview($buyer->id, true);

        $this->putJson("/api/v1/order/reviews/{$reviewId}", [
            'rating' => 4,
            'review' => 'Direvisi pemilik.',
            'is_active' => false,
        ])
            ->assertStatus(200);

        $row = DB::table('product_reviews')->where('id', $reviewId)->first();
        $this->assertSame(4, (int) $row->rating);
        $this->assertSame('Direvisi pemilik.', (string) $row->review);
        $this->assertSame(1, (int) $row->is_active);
    }

    public function test_user_without_review_permission_is_rejected(): void
    {
        $buyer = $this->makeUser(['name' => 'Buyer Tanpa Izin'], ['buyer']);
        $this->withToken($this->tokenFor($buyer, 'buyer'));
        $this->app['auth']->forgetGuards();
        $reviewId = $this->createReview($buyer->id, true);

        $this->putJson("/api/v1/order/reviews/{$reviewId}", ['rating' => 5, 'is_active' => false])
            ->assertStatus(403);
    }
}