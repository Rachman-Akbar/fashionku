<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Application\UseCases\GetOrdersUseCase;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Application\Services\SellerFinanceDashboardService;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class DateFilterTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function makeStoreFor(User $seller): StoreModel
    {
        $store = $this->makeStore($seller);
        $seller->unsetRelation('store');

        return $store;
    }

    private function makeOrder(User $buyer, string $orderCode, string $createdAt): OrderModel
    {
        return OrderModel::query()->create([
            'user_id' => $buyer->id,
            'order_number' => 'ORD-DATE-'.$orderCode,
            'order_type' => 'normal',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'total_amount' => 10000,
            'shipping_address' => json_encode(['address' => 'Jl. Test No. 1']),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }

    public function test_order_history_respects_date_from_and_date_to(): void
    {
        $buyer = $this->makeUser();

        $old = $this->makeOrder($buyer, Str::upper('A'.Str::random(4)), '2025-12-20 09:00:00');
        $target = $this->makeOrder($buyer, Str::upper('B'.Str::random(4)), '2026-02-10 09:00:00');
        $after = $this->makeOrder($buyer, Str::upper('C'.Str::random(4)), now()->toDateTimeString());

        $window = app(GetOrdersUseCase::class)->execute(
            (string) $buyer->id,
            filters: ['date_from' => '2026-01-01', 'date_to' => '2026-02-28'],
        );

        $ids = $window->getCollection()->map(fn ($order) => (int) $order->id)->all();
        $this->assertContains((int) $target->id, $ids);
        $this->assertNotContains((int) $old->id, $ids);
        $this->assertNotContains((int) $after->id, $ids);

        $fromDate = app(GetOrdersUseCase::class)->execute(
            (string) $buyer->id,
            filters: ['date_from' => '2026-02-01'],
        );

        $fromIds = $fromDate->getCollection()->map(fn ($order) => (int) $order->id)->all();
        $this->assertContains((int) $target->id, $fromIds);
        $this->assertNotContains((int) $old->id, $fromIds);
        $this->assertContains((int) $after->id, $fromIds);
    }

    public function test_dashboard_custom_date_range_in_income(): void
    {
        $seller = $this->makeUser([], ['seller']);
        $store = $this->makeStoreFor($seller);

        FinancialTransactionModel::query()->create([
            'store_id' => $store->id,
            'reference_number' => 'TRX-DATE-'.Str::upper(Str::random(6)),
            'type' => 'income',
            'title' => 'Januari',
            'amount' => 100000,
            'occurred_at' => '2026-01-15 10:00:00',
            'status' => 'posted',
            'is_active' => true,
        ]);

        FinancialTransactionModel::query()->create([
            'store_id' => $store->id,
            'reference_number' => 'TRX-DATE-'.Str::upper(Str::random(6)),
            'type' => 'income',
            'title' => 'September',
            'amount' => 25000,
            'occurred_at' => now()->toDateTimeString(),
            'status' => 'posted',
            'is_active' => true,
        ]);

        $dashboard = app(SellerFinanceDashboardService::class)->getDashboard(
            (int) $store->id,
            'monthly',
            '2026-01-01',
            '2026-01-31'
        );

        $this->assertSame('custom', $dashboard['period']);
        $this->assertSame('2026-01-01', $dashboard['start_date']);
        $this->assertSame('2026-01-31', $dashboard['end_date']);

        $this->assertSame('Januari', $dashboard['recent_transactions'][0]['title']);
        $this->assertSame(100000.0, $dashboard['summary']['income']);
    }

    public function test_order_trend_respects_custom_date_range(): void
    {
        $seller = $this->makeUser([], ['seller']);
        $store = $this->makeStoreFor($seller);

        $buyer = $this->makeUser();
        $order = OrderModel::query()->create([
            'user_id' => $buyer->id,
            'order_number' => 'ORD-TREND-'.Str::upper(Str::random(4)),
            'order_type' => 'normal',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'completed',
            'total_amount' => 50000,
            'shipping_address' => json_encode(['address' => 'Jl. Test No. 1']),
            'created_at' => '2026-02-10 08:00:00',
        ]);

        SubOrderModel::query()->create([
            'order_id' => $order->id,
            'store_id' => $store->id,
            'sub_order_number' => 'SUB-TREND-'.Str::upper(Str::random(4)),
            'destination_id' => 'test-city',
            'total_items_price' => 50000,
            'shipping_cost' => 5000,
            'status' => 'completed',
            'created_at' => '2026-02-10 08:00:00',
        ]);

        $trend = app(SellerFinanceDashboardService::class)->getOrderTrend(
            (int) $store->id,
            'monthly',
            '2026-02-01',
            '2026-02-28'
        );

        $this->assertSame('custom', $trend['period']);
        $this->assertSame(28, count($trend['points']));

        $day = collect($trend['points'])->firstWhere('date', '2026-02-10');
        $this->assertSame(1, $day['orders']);
        $this->assertSame(55000.0, $day['revenue']);
        $this->assertSame(1, $day['completed']);
    }
}
