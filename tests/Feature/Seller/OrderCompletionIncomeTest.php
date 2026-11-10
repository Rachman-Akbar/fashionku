<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Identity\User\Domain\Entities\Permission;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Application\Services\AutoOrderIncomeService;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class OrderCompletionIncomeTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function sellerBaseline(): array
    {
        $seller = $this->actingAsRole('seller');
        $store = $this->makeStore($seller);
        $seller->unsetRelation('store');

        $permission = Permission::query()->firstOrCreate(
            ['name' => 'finance.manage'],
            ['description' => 'Mengelola keuangan', 'is_active' => true],
        );
        Role::query()->firstWhere('name', 'seller')?->permissions()->syncWithoutDetaching([$permission->id]);

        return [$seller, $store];
    }

    private function makeOrderForStore(User $seller, StoreModel $store, string $status = 'received'): SubOrderModel
    {
        $code = Str::upper(Str::random(6));
        $order = OrderModel::query()->create([
            'user_id' => $seller->id,
            'order_number' => 'ORD-TEST-'.$code,
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => $status,
            'total_amount' => 50000,
            'shipping_address' => json_encode(['address' => 'Jl. Test No. 1']),
        ]);

        return SubOrderModel::query()->create([
            'order_id' => $order->id,
            'store_id' => $store->id,
            'sub_order_number' => 'SUB-TEST-'.$code,
            'destination_id' => 'test-city',
            'total_items_price' => 50000,
            'shipping_cost' => 10000,
            'status' => $status,
        ]);
    }

    public function test_income_post_is_idempotent_per_store_and_order(): void
    {
        [$seller, $store] = $this->sellerBaseline();
        $subOrder = $this->makeOrderForStore($seller, $store);

        $payload = [
            'type' => 'income',
            'order_id' => $subOrder->order_id,
            'title' => 'Pemasukan sesuai dengan no order '.$subOrder->sub_order_number,
            'amount' => 60000,
            'status' => 'posted',
            'occurred_at' => now()->toIso8601String(),
        ];

        $this->postJson('/api/v1/seller/finance', $payload)->assertStatus(201);
        $this->postJson('/api/v1/seller/finance', $payload)->assertStatus(201);

        $this->assertSame(
            1,
            FinancialTransactionModel::query()
                ->where('store_id', $store->id)
                ->where('order_id', $subOrder->order_id)
                ->where('type', 'income')
                ->count(),
        );
    }

    public function test_completing_order_after_income_post_does_not_duplicate_and_keeps_edited_values(): void
    {
        [$seller, $store] = $this->sellerBaseline();
        $subOrder = $this->makeOrderForStore($seller, $store);

        $this->postJson('/api/v1/seller/finance', [
            'type' => 'income',
            'order_id' => $subOrder->order_id,
            'title' => 'Pemasukan sesuai dengan no order '.$subOrder->sub_order_number,
            'description' => 'Hasil penjualan pesanan',
            'amount' => 55555,
            'status' => 'posted',
            'occurred_at' => now()->toIso8601String(),
        ])->assertStatus(201);

        $this->patchJson("/api/v1/order/orderings/{$subOrder->id}/status", [
            'status' => 'completed',
        ])->assertOk();

        $this->assertSame(
            1,
            FinancialTransactionModel::query()
                ->where('store_id', $store->id)
                ->where('order_id', $subOrder->order_id)
                ->where('type', 'income')
                ->count(),
        );

        $row = FinancialTransactionModel::query()
            ->where('order_id', $subOrder->order_id)
            ->where('type', 'income')
            ->firstOrFail();

        $this->assertSame('Pemasukan sesuai dengan no order '.$subOrder->sub_order_number, $row->title);
        $this->assertSame(55555.0, (float) $row->amount);
        $this->assertSame('Hasil penjualan pesanan', $row->description);
    }

    public function test_auto_order_income_records_default_keterangan_title(): void
    {
        $seller = $this->makeUser([], ['seller']);
        $store = $this->makeStore($seller);
        $seller->unsetRelation('store');

        $subOrder = $this->makeOrderForStore($seller, $store, 'completed');

        $recorded = app(AutoOrderIncomeService::class)->recordForSubOrder((int) $subOrder->id, (string) $seller->id);

        $this->assertTrue($recorded);
        $this->assertDatabaseHas('financial_transactions', [
            'store_id' => $store->id,
            'order_id' => $subOrder->order_id,
            'type' => 'income',
            'title' => 'Pemasukan sesuai dengan no order '.$subOrder->sub_order_number,
        ]);
    }
}
