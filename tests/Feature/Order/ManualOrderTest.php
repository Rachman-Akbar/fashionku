<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Endpoint POST /api/v1/order/orderings/manual — order manual seller
 * (fungsi kasir) tanpa Midtrans.
 */
class ManualOrderTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private int $variantId;

    protected function setUp(): void
    {
        parent::setUp();

        $sellerA = $this->actingAsSeller();
        $this->makeRole('buyer');

        $product = $this->app->make(CreateProductUseCase::class)->execute([
            'name' => 'Produk Kasir',
            'price' => 50000,
            'variants' => [
                ['name' => 'Standar', 'price' => 50000, 'po_stock' => 0],
            ],
        ]);

        $this->variantId = (int) $product->variants()[0]->id();

        $this->app->make(StockMovementService::class)->adjust([
            'variant_id' => $this->variantId,
            'quantity_delta' => 10,
            'movement_type' => 'inbound',
            'notes' => 'Stok awal untuk tes',
        ]);
    }

    private function basePayload(): array
    {
        return [
            'customer_name' => 'Pembeli Manual',
            'customer_phone' => '081230003000',
            'customer_email' => null,
            'address' => 'Jl. Kasir No. 9, Jakarta',
            'courier' => 'jne',
            'service' => 'Reguler',
            'shipping_cost' => 15000,
            'payment_method' => 'tunai_toko',
            'payment_status' => 'paid',
            'status' => 'processing',
            'items' => [
                ['variant_id' => $this->variantId, 'quantity' => 2],
            ],
        ];
    }

    public function test_happy_path_paid_commits_stock_and_creates_guest_buyer(): void
    {
        $response = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload());

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $order = DB::table('orders')->where('order_number', $response->json('data.order_number'))->first();
        $this->assertNotNull($order);
        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('processing', $order->status);
        $this->assertNotNull($order->received_at);
        $this->assertEqualsWithDelta(115000, (float) $order->total_amount, 0.01);
        $this->assertStringStartsWith('MAN-', (string) $order->order_number);

        $subOrderId = DB::table('sub_orders')->where('order_id', $order->id)->value('id');
        $item = DB::table('order_items')->where('sub_order_id', $subOrderId)->where('variant_id', $this->variantId)->first();
        $this->assertNotNull($item);
        $this->assertSame(2, (int) $item->quantity);

        $variantStock = DB::table('product_variants')->where('id', $this->variantId)->first();
        $this->assertSame(8, (int) $variantStock->stock);
        $this->assertSame(0, (int) $variantStock->stock_reserved);

        $buyer = DB::table('users')->where('id', $order->user_id)->first();
        $this->assertSame('Pembeli Manual', $buyer->name);
        $this->assertStringContainsString('@manual.order', (string) $buyer->email);
        $role = DB::table('user_roles')->where('user_id', $order->user_id)->value('role_id');

        $this->assertNotNull($role);
    }

    public function test_reuses_existing_buyer_when_email_matches(): void
    {
        $existing = $this->makeUser(['name' => 'Akun Lama', 'email' => 'buyer@example.com'], ['buyer']);

        $payload = $this->basePayload();
        $payload['customer_email'] = 'buyer@example.com';

        $response = $this->postJson('/api/v1/order/orderings/manual', $payload)->assertStatus(201);

        $order = DB::table('orders')->where('order_number', $response->json('data.order_number'))->first();
        $this->assertSame((string) $existing->id, (string) $order->user_id);
        $this->assertSame(1, DB::table('users')->where('email', 'buyer@example.com')->count());
    }

    public function test_unpaid_order_is_pending_and_does_not_commit_stock(): void
    {
        $payload = $this->basePayload();
        $payload['payment_status'] = 'unpaid';
        $payload['status'] = 'processing';

        $response = $this->postJson('/api/v1/order/orderings/manual', $payload)->assertStatus(201);

        $order = DB::table('orders')->where('order_number', $response->json('data.order_number'))->first();
        $this->assertSame('pending', $order->status);
        $this->assertSame('unpaid', $order->payment_status);
        $this->assertNull($order->received_at);

        $payment = DB::table('payments')->where('order_number', $order->order_number)->first();
        $this->assertNotNull($payment);
        $this->assertSame('pending', $payment->status);

        $variantStock = DB::table('product_variants')->where('id', $this->variantId)->first();
        $this->assertSame(10, (int) $variantStock->stock);
        $this->assertSame(2, (int) $variantStock->stock_reserved);
    }

    public function test_insufficient_stock_is_rejected_with_422(): void
    {
        $payload = $this->basePayload();
        $payload['items'] = [['variant_id' => $this->variantId, 'quantity' => 99]];

        $this->postJson('/api/v1/order/orderings/manual', $payload)
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_non_seller_is_forbidden(): void
    {
        $this->actingAsRole('buyer');

        $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())
            ->assertForbidden();
    }

    public function test_unpaid_pending_order_can_be_deleted_and_stock_released(): void
    {
        $payload = $this->basePayload();
        $payload['payment_status'] = 'unpaid';
        $payload['status'] = 'pending';

        $created = $this->postJson('/api/v1/order/orderings/manual', $payload)->assertStatus(201)->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();

        $response = $this->deleteJson('/api/v1/order/orderings/'.$subOrder->id);

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertNull(DB::table('sub_orders')->find($subOrder->id));
        $this->assertNull(DB::table('orders')->find($order->id));
        $this->assertSame(0, DB::table('payments')->where('order_number', $created)->count());

        $variantStock = DB::table('product_variants')->where('id', $this->variantId)->first();
        $this->assertSame(10, (int) $variantStock->stock);
        $this->assertSame(0, (int) $variantStock->stock_reserved);
    }

    public function test_paid_order_cannot_be_deleted(): void
    {
        $created = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())->assertStatus(201)->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();

        $this->deleteJson('/api/v1/order/orderings/'.$subOrder->id)
            ->assertStatus(403);

        $this->assertNotNull(DB::table('sub_orders')->find($subOrder->id));
    }

    public function test_seller_can_update_order_detail_and_status(): void
    {
        $created = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())->assertStatus(201)->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();

        $response = $this->patchJson('/api/v1/order/orderings/'.$subOrder->id, [
            'customer_name' => 'Nama Baru',
            'customer_phone' => '081299991111',
            'customer_email' => null,
            'address' => 'Jl. Baru No. 7, Bandung',
            'courier' => 'sicepat',
            'service' => 'REG',
            'shipping_cost' => 20000,
            'status' => 'shipped',
            'tracking_number' => 'SICE12345678',
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);
        $response->assertJsonPath('data.status', 'shipped');
        $response->assertJsonPath('data.tracking_number', 'SICE12345678');

        $savedSub = DB::table('sub_orders')->find($subOrder->id);
        $this->assertSame('shipped', $savedSub->status);
        $this->assertSame('sicepat', $savedSub->courier);
        $this->assertSame('REG', $savedSub->service);
        $this->assertSame('SICE12345678', $savedSub->tracking_number);
        $this->assertEqualsWithDelta(20000, (float) $savedSub->shipping_cost, 0.01);

        $savedOrder = DB::table('orders')->find($order->id);
        $this->assertSame('shipped', $savedOrder->status);
        $addressPayload = json_decode($savedOrder->shipping_address, true);
        $this->assertSame('Nama Baru', $addressPayload['recipient']);
        $this->assertSame('081299991111', $addressPayload['phone']);
        $this->assertSame('Jl. Baru No. 7, Bandung', $addressPayload['address']);
        $this->assertEqualsWithDelta(120000, (float) $savedOrder->total_amount, 0.01);
    }

    public function test_order_detail_cannot_be_updated_with_illegal_status_transition(): void
    {
        $created = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())->assertStatus(201)->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();

        $this->patchJson('/api/v1/order/orderings/'.$subOrder->id, [
            'customer_name' => 'Nama Baru',
            'status' => 'completed',
        ])->assertStatus(403);

        $this->assertSame('processing', DB::table('sub_orders')->find($subOrder->id)->status);
    }

    public function test_manual_order_is_marked_with_manual_order_type(): void
    {
        $created = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())
            ->assertStatus(201)
            ->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $this->assertSame('manual', $order->order_type);

        $list = $this->getJson('/api/v1/order/orderings?per_page=20')
            ->assertStatus(200)
            ->json('data');

        $row = collect($list)->first(fn (array $row) => (int) $row['id'] === (int) $order->id);

        $this->assertNotNull($row);
        $this->assertSame('manual', $row['order_type']);
    }

    public function test_items_of_paid_manual_order_can_be_edited_and_stock_reconciled(): void
    {
        $created = $this->postJson('/api/v1/order/orderings/manual', $this->basePayload())
            ->assertStatus(201)
            ->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();
        $itemId = (int) DB::table('order_items')->where('sub_order_id', $subOrder->id)->value('id');

        $before = DB::table('product_variants')->find($this->variantId);
        $this->assertSame(8, (int) $before->stock);
        $this->assertSame(0, (int) $before->stock_reserved);

        $this->patchJson('/api/v1/order/orderings/'.$subOrder->id, [
            'customer_name' => 'Pembeli Manual',
            'address' => 'Jl. Kasir No. 9, Jakarta',
            'courier' => 'jne',
            'shipping_cost' => 15000,
            'status' => 'processing',
            'items' => [
                ['order_item_id' => $itemId, 'quantity' => 3, 'unit_price' => 60000],
            ],
        ])->assertStatus(200)->assertJsonPath('success', true);

        $after = DB::table('product_variants')->find($this->variantId);
        $this->assertSame(7, (int) $after->stock);

        $item = DB::table('order_items')->find($itemId);
        $this->assertSame(3, (int) $item->quantity);
        $this->assertEqualsWithDelta(60000, (float) $item->price, 0.01);

        $this->assertEqualsWithDelta(180000, (float) DB::table('sub_orders')->find($subOrder->id)->total_items_price, 0.01);
        $this->assertEqualsWithDelta(195000, (float) DB::table('orders')->find($order->id)->total_amount, 0.01);
    }

    public function test_items_of_manual_order_cannot_be_edited_after_shipped(): void
    {
        $payload = $this->basePayload();
        $payload['status'] = 'shipped';

        $created = $this->postJson('/api/v1/order/orderings/manual', $payload)
            ->assertStatus(201)
            ->json('data.order_number');

        $order = DB::table('orders')->where('order_number', $created)->first();
        $subOrder = DB::table('sub_orders')->where('order_id', $order->id)->first();
        $itemId = (int) DB::table('order_items')->where('sub_order_id', $subOrder->id)->value('id');

        $this->patchJson('/api/v1/order/orderings/'.$subOrder->id, [
            'customer_name' => 'Pembeli Manual',
            'status' => 'shipped',
            'items' => [
                ['order_item_id' => $itemId, 'quantity' => 5, 'unit_price' => 50000],
            ],
        ])->assertStatus(403);

        $this->assertSame(2, (int) DB::table('order_items')->find($itemId)->quantity);
    }
}