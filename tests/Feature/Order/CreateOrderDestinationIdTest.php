<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Application\UseCases\CreateOrderUseCase;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Checkout dengan kurir (bukan ambil sendiri) wajib mengisi
 * `sub_orders.destination_id` karena kolomnya NOT NULL.
 */
class CreateOrderDestinationIdTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private int $variantId;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::forget('shipping.settings');

        $this->actingAsSeller();

        $product = $this->app->make(CreateProductUseCase::class)->execute([
            'name' => 'Produk Kirim',
            'price' => 50000,
            'variants' => [
                ['name' => 'Standar', 'price' => 50000],
            ],
        ]);

        $this->variantId = (int) $product->variants()[0]->id();

        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => 10,
            'movement_type' => 'inbound',
            'notes' => 'Stok awal',
        ]);

        DB::table('shipping_settings')->insert([
            'store_latitude' => -6.2000000,
            'store_longitude' => 106.8166667,
            'free_shipping_max_distance' => 0,
            'default_flat_rate' => 10000,
            'rate_per_km' => 2000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function buyerWithCartItem(): string
    {
        $buyer = $this->makeUser(['name' => 'Buyer Kirim']);
        $cart = CartModel::query()->create(['user_id' => $buyer->id]);
        $cart->items()->create([
            'product_variant_id' => $this->variantId,
            'quantity' => 2,
        ]);

        return (string) $buyer->id;
    }

    private function makeAddress(string $userId, ?string $komerceDestinationId): int
    {
        return (int) DB::table('addresses')->insertGetId([
            'user_id' => $userId,
            'label' => 'Rumah',
            'recipient_name' => 'Buyer Kirim',
            'phone_number' => '08123456789',
            'country' => 'Indonesia',
            'province' => 'DKI Jakarta',
            'city_or_regency' => 'Jakarta Selatan',
            'district' => 'Kebayoran',
            'subdistrict' => 'Senayan',
            'full_address' => 'Jl. Test No. 1',
            'postal_code' => '12190',
            'latitude' => -6.2300000,
            'longitude' => 106.8000000,
            'komerce_destination_id' => $komerceDestinationId,
            'is_primary' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function placeOrder(string $userId, int $addressId): int
    {
        $cart = CartModel::query()->where('user_id', $userId)->firstOrFail();
        $cartItemId = (int) $cart->items()->firstOrFail()->id;

        $order = $this->app->make(CreateOrderUseCase::class)->execute(
            userId: $userId,
            addressId: $addressId,
            cartItemIds: [$cartItemId],
            courier: 'haversine',
            service: 'HAVERSINE',
            paymentMethod: 'cod',
            voucherCode: null,
            orderType: 'normal',
        );

        return (int) $order->id;
    }

    public function test_checkout_with_courier_stores_address_destination_id(): void
    {
        $buyerId = $this->buyerWithCartItem();
        $addressId = $this->makeAddress($buyerId, null);

        $orderId = $this->placeOrder($buyerId, $addressId);

        $subOrder = DB::table('sub_orders')->where('order_id', $orderId)->first();
        $this->assertNotNull($subOrder);
        $this->assertSame('ADDR-'.$addressId, (string) $subOrder->destination_id);
        $this->assertGreaterThan(0, (float) $subOrder->shipping_cost);
    }

    public function test_checkout_uses_komerce_destination_id_when_available(): void
    {
        $buyerId = $this->buyerWithCartItem();
        $addressId = $this->makeAddress($buyerId, 'KMB-JKT-001');

        $orderId = $this->placeOrder($buyerId, $addressId);

        $subOrder = DB::table('sub_orders')->where('order_id', $orderId)->first();
        $this->assertSame('KMB-JKT-001', (string) $subOrder->destination_id);
    }
}
