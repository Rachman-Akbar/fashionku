<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class OrderFlowTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_buyer_cannot_list_all_orders(): void
    {
        $this->actingAsRole('buyer');
        $this->getJson('/api/v1/order/orderings')->assertForbidden();
    }

    public function test_seller_can_list_orders(): void
    {
        $this->actingAsSeller();
        $this->getJson('/api/v1/order/orderings')->assertOk()->assertJsonPath('success', true);
    }

    public function test_invalid_order_status_is_rejected(): void
    {
        $this->actingAsSeller();

        $this->patchJson('/api/v1/order/orderings/1/status', [
            'status' => 'not-a-status',
        ])->assertStatus(422);
    }

    public function test_show_returns_404_for_missing_order(): void
    {
        $this->actingAsSeller();
        $this->getJson('/api/v1/order/orderings/999999')->assertNotFound();
    }

    public function test_buyer_can_only_confirm_received_and_gets_403_for_other_statuses(): void
    {
        $buyer = $this->actingAsRole('buyer');

        $order = OrderModel::query()->create([
            'user_id' => $buyer->id,
            'order_number' => 'ORD-TEST-'.Str::upper(Str::random(6)),
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'total_amount' => 10000,
            'shipping_cost' => 0,
            'discount_amount' => 0,
            'shipping_address' => json_encode(['address' => 'Jl. Test No.1']),
        ]);

        $this->patchJson("/api/v1/order/orderings/{$order->id}/status", [
            'status' => 'processing',
        ])->assertForbidden();
    }
}
