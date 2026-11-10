<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\AdminFeeConfigModel;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\SellerSettlementModel;
use App\Domains\Identity\User\Domain\Entities\Permission;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Application\Services\AutoOrderIncomeService;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class OrderCommissionTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

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
            'order_type' => 'preorder',
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

    public function test_completing_sub_order_records_commission_settlement_and_syncs_amounts(): void
    {
        [$seller, $store] = $this->sellerBaseline();
        $subOrder = $this->makeOrderForStore($seller, $store);

        $this->patchJson("/api/v1/order/orderings/{$subOrder->id}/status", [
            'status' => 'completed',
        ])->assertOk();

        $this->assertDatabaseHas('seller_settlements', [
            'store_id' => $store->id,
            'order_id' => $subOrder->order_id,
            'sub_order_id' => $subOrder->id,
            'admin_fee' => 0,
            'shipping_fee' => 10000,
            'net_amount' => 50000,
            'status' => 'pending',
        ]);

        $this->assertSame(0.0, (float) $subOrder->refresh()->admin_fee);
        $this->assertSame(50000.0, (float) $subOrder->seller_net);

        $this->assertSame(0.0, (float) OrderModel::query()->findOrFail($subOrder->order_id)->admin_fee);
        $this->assertSame(50000.0, (float) OrderModel::query()->findOrFail($subOrder->order_id)->seller_net);

        $this->assertSame(
            50000.0,
            (float) FinancialTransactionModel::query()
                ->where('order_id', $subOrder->order_id)
                ->where('type', 'income')
                ->firstOrFail()
                ->amount,
        );
    }

    public function test_commission_settlement_is_idempotent(): void
    {
        [$seller, $store] = $this->sellerBaseline();
        $subOrder = $this->makeOrderForStore($seller, $store, 'completed');

        app(AutoOrderIncomeService::class)->recordForSubOrder((int) $subOrder->id, (string) $seller->id);
        app(AutoOrderIncomeService::class)->recordForSubOrder((int) $subOrder->id, (string) $seller->id);

        $this->assertSame(
            1,
            SellerSettlementModel::query()
                ->where('store_id', $store->id)
                ->where('order_id', $subOrder->order_id)
                ->where('sub_order_id', $subOrder->id)
                ->count(),
        );

        $this->assertSame(1, FinancialTransactionModel::query()->where('type', 'income')->count());
    }

    public function test_completion_with_admin_fee_config_deducts_fee_and_income_uses_seller_net(): void
    {
        AdminFeeConfigModel::query()->create([
            'name' => 'Komisi Global 10%',
            'code' => 'GLOBAL-10',
            'percentage' => 10,
            'fixed_amount' => 0,
            'min_fee' => 0,
            'max_fee' => 0,
            'is_active' => true,
        ]);

        [$seller, $store] = $this->sellerBaseline();
        $subOrder = $this->makeOrderForStore($seller, $store);

        $this->patchJson("/api/v1/order/orderings/{$subOrder->id}/status", [
            'status' => 'completed',
        ])->assertOk();

        $this->assertDatabaseHas('seller_settlements', [
            'store_id' => $store->id,
            'order_id' => $subOrder->order_id,
            'sub_order_id' => $subOrder->id,
            'admin_fee' => 5000,
            'net_amount' => 45000,
        ]);

        $this->assertSame(5000.0, (float) $subOrder->refresh()->admin_fee);
        $this->assertSame(45000.0, (float) $subOrder->seller_net);
        $this->assertSame(5000.0, (float) OrderModel::query()->findOrFail($subOrder->order_id)->admin_fee);
        $this->assertSame(45000.0, (float) OrderModel::query()->findOrFail($subOrder->order_id)->seller_net);

        $this->assertSame(
            45000.0,
            (float) FinancialTransactionModel::query()
                ->where('order_id', $subOrder->order_id)
                ->where('type', 'income')
                ->firstOrFail()
                ->amount,
        );
    }
}
