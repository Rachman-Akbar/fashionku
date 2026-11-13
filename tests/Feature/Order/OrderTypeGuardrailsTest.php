<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Application\UseCases\CreateOrderUseCase;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Guardrail tipe pesanan:
 *  - pesanan booking tidak lagi diam-dikonversi menjadi preorder saat stok habis,
 *  - preorder selalu memiliki tanggal rilis (termasuk preorder otomatis).
 */
class OrderTypeGuardrailsTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private int $storeId;

    private int $variantId;

    protected function setUp(): void
    {
        parent::setUp();

        [$seller, $store] = $this->actingAsSeller();
        $this->storeId = (int) $store->id;

        $product = $this->app->make(CreateProductUseCase::class)->execute([
            'store_id' => $this->storeId,
            'name' => 'Produk Guardrail',
            'price' => 100000,
            'variants' => [
                ['name' => 'Standar', 'price' => 100000],
            ],
        ]);

        $this->variantId = (int) $product->variants()[0]->id();

        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => 20,
            'movement_type' => 'inbound',
            'notes' => 'Stok awal',
        ], $this->storeId);

        // Set kapasitas preorder agar preorder otomatis dapat diproses (G-10).
        DB::table('product_variants')->where('id', $this->variantId)->update(['stock_preorder' => 20]);

        // Siapkan jadwal untuk pengujian booking (G-11).
        DB::table('schedules')->insert([
            'user_id' => $seller->id,
            'store_id' => $this->storeId,
            'title' => 'Jadwal Pengiriman',
            'type' => 'delivery',
            'date' => now()->addDays(3)->toDateString(),
            'capacity' => 10,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function emptyStock(): void
    {
        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => -20,
            'movement_type' => 'adjustment',
            'notes' => 'Kosongkan stok',
        ], $this->storeId);
    }

    private function buyerWithCartItem(int $quantity): string
    {
        $buyer = $this->makeUser(['name' => 'Buyer '.random_int(1, 99999)]);
        CartModel::query()->create(['user_id' => $buyer->id]);
        $cart = CartModel::query()->where('user_id', $buyer->id)->firstOrFail();
        $cart->items()->create([
            'product_variant_id' => $this->variantId,
            'quantity' => $quantity,
        ]);

        return (string) $buyer->id;
    }

    private function placeOrder(string $userId, string $orderType, ?string $scheduledAt, ?string $releaseAt): int
    {
        $cart = CartModel::query()->where('user_id', $userId)->firstOrFail();
        $cartItemId = (int) $cart->items()->firstOrFail()->id;

        $order = $this->app->make(CreateOrderUseCase::class)->execute(
            userId: $userId,
            addressId: null,
            cartItemIds: [$cartItemId],
            courier: 'ambil_sendiri',
            service: null,
            paymentMethod: 'tunai_toko',
            voucherCode: null,
            orderType: $orderType,
            preorderReleaseAt: $releaseAt,
            scheduledAt: $scheduledAt,
        );

        return (int) $order->id;
    }

    public function test_booking_with_out_of_stock_is_rejected_not_converted_to_preorder(): void
    {
        $this->emptyStock();
        $buyerId = $this->buyerWithCartItem(5);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('pesanan booking tidak dapat diproses');

        $this->placeOrder($buyerId, 'booking', now()->addDays(3)->toDateTimeString(), null);
    }

    public function test_booking_with_available_stock_creates_a_booking_order(): void
    {
        $buyerId = $this->buyerWithCartItem(5);
        $scheduledAt = now()->addDays(3)->toDateTimeString();

        $orderId = $this->placeOrder($buyerId, 'booking', $scheduledAt, null);

        $row = DB::table('orders')->where('id', $orderId)->first();
        $this->assertSame('booking', (string) $row->order_type);
        $this->assertNotNull($row->scheduled_at);
    }

    public function test_auto_preorder_always_stores_a_release_date(): void
    {
        $this->emptyStock();
        $buyerId = $this->buyerWithCartItem(5);

        // Checkout normal yang otomatis menjadi preorder (stok habis).
        $orderId = $this->placeOrder($buyerId, 'normal', null, null);

        $row = DB::table('orders')->where('id', $orderId)->first();
        $this->assertSame('preorder', (string) $row->order_type);
        $this->assertNotNull($row->preorder_release_at);
    }

    public function test_explicit_preorder_keeps_the_provided_release_date(): void
    {
        $buyerId = $this->buyerWithCartItem(5);
        $releaseAt = now()->addDays(10)->toDateTimeString();

        $orderId = $this->placeOrder($buyerId, 'preorder', null, $releaseAt);

        $row = DB::table('orders')->where('id', $orderId)->first();
        $this->assertSame('preorder', (string) $row->order_type);
        $this->assertSame($releaseAt, (string) $row->preorder_release_at);
    }
}
