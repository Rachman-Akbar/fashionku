<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Order\Ordering\Infrastructure\Mail\OrderRejectedMail;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class AdminOrderControlTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function marketplaceOrder(string $buyerId): array
    {
        $order = OrderModel::query()->create([
            'user_id' => $buyerId,
            'order_number' => 'INV-ADMIN-'.Str::upper(Str::random(6)),
            'order_type' => 'reguler',
            'payment_method' => 'midtrans',
            'payment_status' => 'paid',
            'status' => 'pending',
            'total_amount' => 50000,
            'discount_amount' => 0,
            'shipping_discount_amount' => 0,
            'shipping_address' => json_encode(['address' => 'Jl. Marketplace No. 1']),
        ]);

        $subOrder = SubOrderModel::query()->create([
            'order_id' => $order->id,
            'sub_order_number' => $order->order_number.'-S1',
            'total_items_price' => 50000,
            'shipping_cost' => 0,
            'courier' => 'jne',
            'service' => 'REG',
            'destination_id' => 'TEST',
            'status' => 'pending',
        ]);

        return [$order, $subOrder];
    }

    public function test_admin_cannot_edit_marketplace_order_details(): void
    {
        $this->actingAsRole('admin');
        $buyer = $this->makeUser([], ['buyer']);
        [, $subOrder] = $this->marketplaceOrder((string) $buyer->id);

        $this->patchJson('/api/v1/order/orderings/'.$subOrder->id, [
            'customer_name' => 'Nama Palsu',
            'courier' => 'jne',
            'status' => 'pending',
        ])->assertForbidden();

        $this->assertSame('pending', DB::table('sub_orders')->find($subOrder->id)->status);
    }

    public function test_admin_can_reject_order_and_buyer_is_notified(): void
    {
        Mail::fake();

        $this->actingAsRole('admin');
        $buyer = $this->makeUser([], ['buyer']);
        [$order] = $this->marketplaceOrder((string) $buyer->id);

        $this->patchJson("/api/v1/order/orderings/{$order->id}/status", [
            'status' => 'rejected',
            'reason' => 'Stok habis',
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertSame('rejected', DB::table('orders')->find($order->id)->status);
        $this->assertSame(
            'rejected',
            DB::table('sub_orders')->where('order_id', $order->id)->value('status')
        );

        Mail::assertQueued(OrderRejectedMail::class, fn (OrderRejectedMail $mail): bool => $mail->order->id === $order->id
            && $mail->reason === 'Stok habis');

        $chat = DB::table('chat_messages')->get()->contains(function ($message) use ($order): bool {
            $attachments = json_decode((string) $message->attachments, true) ?: [];

            return ($attachments['notification_key'] ?? null) === "order:{$order->id}:rejected"
                && str_contains((string) $message->message, 'DITOLAK oleh admin');
        });

        $this->assertTrue($chat, 'Buyer harus menerima pesan chat bahwa pesanan ditolak oleh admin.');
    }
}
