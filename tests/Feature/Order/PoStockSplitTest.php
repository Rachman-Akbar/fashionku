<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Application\UseCases\CancelOrderUseCase;
use App\Domains\Order\Ordering\Application\UseCases\CreateOrderUseCase;
use App\Domains\Order\Ordering\Application\UseCases\UpdateOrderStatusUseCase;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Stok-ledger modern: pesanan men-sewa stok (stock_reserved / stock_preorder)
 * saat checkout, dikomit saat order diproses (stock berkurang), dan dilepas
 * kembali saat order dibatalkan. po_stock adalah nilai legacy dan tidak lagi
 * dikurangi oleh alur pesanan (preorder kini otomatis tanpa kuota).
 */
class PoStockSplitTest extends TestCase
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
            'name' => 'Produk Stok PO',
            'price' => 100000,
            'variants' => [
                ['name' => 'Standar', 'price' => 100000, 'po_stock' => 30],
            ],
        ]);

        $variantId = (int) $product->variants()[0]->id();
        $this->variantId = $variantId;

        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $variantId,
            'quantity_delta' => 20,
            'movement_type' => 'inbound',
            'notes' => 'Stok awal untuk tes',
        ], $this->storeId);
    }

    private function buyerWithCartItem(int $quantity, int $userIdPrefix): string
    {
        $buyer = $this->makeUser(['name' => 'Buyer PO '.random_int(1, 99999)]);
        CartModel::query()->create(['user_id' => $buyer->id]);
        $cart = CartModel::query()->where('user_id', $buyer->id)->firstOrFail();
        $cart->items()->create([
            'product_variant_id' => $this->variantId,
            'quantity' => $quantity,
        ]);

        return (string) $buyer->id;
    }

    private function placeOrder(string $userId, int $quantity, string $orderType): int
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
            preorderReleaseAt: $orderType === 'preorder' ? now()->addDays(7)->toDateTimeString() : null,
            scheduledAt: null
        );

        return (int) $order->id;
    }

    private function variantRow(): object
    {
        return DB::table('product_variants')->where('id', $this->variantId)->first();
    }

    private function process(int $orderId): void
    {
        $this->app->make(UpdateOrderStatusUseCase::class)->execute($orderId, 'processing');
    }

    private function cancel(int $orderId): void
    {
        $this->app->make(UpdateOrderStatusUseCase::class)->execute($orderId, 'cancelled');
    }

    public function test_placing_normal_order_reserves_regular_stock_without_touching_po_stock(): void
    {
        $buyerId = $this->buyerWithCartItem(5, 1);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $row = $this->variantRow();
        $this->assertSame(20, (int) $row->stock);
        $this->assertSame(5, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
        $this->assertGreaterThan(0, $orderId);
    }

    public function test_processing_order_commits_regular_stock(): void
    {
        $buyerId = $this->buyerWithCartItem(5, 2);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $this->process($orderId);

        $row = $this->variantRow();
        $this->assertSame(15, (int) $row->stock);
        $this->assertSame(0, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
        $this->assertSame(45, (int) $row->stock + (int) $row->po_stock);
    }

    public function test_preorder_order_reserves_regular_stock_when_available(): void
    {
        $buyerId = $this->buyerWithCartItem(10, 3);
        $orderId = $this->placeOrder($buyerId, 10, 'preorder');

        $row = $this->variantRow();
        $this->assertSame(20, (int) $row->stock);
        $this->assertSame(10, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
        $this->assertSame(0, (int) $row->stock_preorder);
        $this->assertGreaterThan(0, $orderId);
    }

    public function test_preorder_exceeding_available_stock_is_rejected(): void
    {
        $buyerId = $this->buyerWithCartItem(999, 4);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Stok Produk Stok PO tidak mencukupi. Tersedia 20 unit. Kurangi jumlah pesanan.');

        $this->placeOrder($buyerId, 999, 'preorder');
    }

    public function test_auto_preorder_when_stock_empty_uses_preorder_dimension(): void
    {
        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => -20,
            'movement_type' => 'adjustment',
            'notes' => 'Stok dikosongkan untuk tes preorder otomatis',
        ], $this->storeId);

        $buyerId = $this->buyerWithCartItem(5, 5);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $row = $this->variantRow();
        $this->assertSame(0, (int) $row->stock);
        $this->assertSame(0, (int) $row->stock_reserved);
        $this->assertSame(5, (int) $row->stock_preorder);
        $this->assertSame(30, (int) $row->po_stock);

        $orderType = DB::table('orders')->where('id', $orderId)->value('order_type');
        $this->assertSame('preorder', (string) $orderType);
    }

    public function test_cancelling_pending_order_releases_the_reservation(): void
    {
        $buyerId = $this->buyerWithCartItem(5, 6);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $this->cancel($orderId);

        $row = $this->variantRow();
        $this->assertSame(20, (int) $row->stock);
        $this->assertSame(0, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
    }

    public function test_cancelling_committed_order_restores_regular_stock(): void
    {
        $buyerId = $this->buyerWithCartItem(5, 7);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $this->process($orderId);
        $this->cancel($orderId);

        $row = $this->variantRow();
        $this->assertSame(20, (int) $row->stock);
        $this->assertSame(0, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
    }

    public function test_cancelling_preorder_releases_auto_preorder_commitment(): void
    {
        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => -20,
            'movement_type' => 'adjustment',
            'notes' => 'Stok dikosongkan untuk tes pembatalan preorder',
        ], $this->storeId);

        $buyerId = $this->buyerWithCartItem(5, 8);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');
        $this->assertSame(5, (int) $this->variantRow()->stock_preorder);

        $this->cancel($orderId);

        $row = $this->variantRow();
        $this->assertSame(0, (int) $row->stock_preorder);
        $this->assertSame(0, (int) $row->stock);
    }

    public function test_legacy_cancel_order_use_case_is_consistent(): void
    {
        $buyerId = $this->buyerWithCartItem(5, 9);
        $orderId = $this->placeOrder($buyerId, 5, 'normal');

        $this->app->make(CancelOrderUseCase::class)->execute($orderId);

        $row = $this->variantRow();
        $this->assertSame(20, (int) $row->stock);
        $this->assertSame(0, (int) $row->stock_reserved);
        $this->assertSame(30, (int) $row->po_stock);
    }
}
