<?php

declare(strict_types=1);

namespace Tests\Feature\Seller;

use App\Domains\Finance\Commission\Domain\Repositories\SellerSettlementRepositoryInterface;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\SellerSettlementModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Seller\Finance\Application\Services\SellerFinanceDashboardService;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class DateBoundaryFixTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function store(): int
    {
        $seller = $this->makeUser([], ['seller']);
        $store = $this->makeStore($seller);
        $seller->unsetRelation('store');

        return (int) $store->id;
    }

    public function test_settlement_to_date_includes_rows_on_the_end_day(): void
    {
        $storeId = $this->store();

        $order = OrderModel::query()->create([
            'user_id' => $this->makeUser()->id,
            'order_number' => 'ORD-BOUND-'.Str::upper(Str::random(6)),
            'order_type' => 'normal',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'completed',
            'total_amount' => 10000,
            'shipping_address' => json_encode(['address' => 'Jl. Test']),
        ]);

        SellerSettlementModel::query()->forceCreate([
            'store_id' => $storeId,
            'order_id' => $order->id,
            'settlement_number' => 'STL-BOUND-'.Str::upper(Str::random(6)),
            'gross_amount' => 10000,
            'admin_fee' => 0,
            'shipping_fee' => 0,
            'net_amount' => 10000,
            'status' => 'pending',
            'created_at' => '2026-02-28 23:59:00',
        ]);

        $page = app(SellerSettlementRepositoryInterface::class)->getByStore(
            $storeId,
            ['status' => 'pending', 'from_date' => '2026-02-01', 'to_date' => '2026-02-28'],
            20
        );

        $this->assertSame(1, (int) $page->total());
    }

    public function test_cashflow_to_date_includes_transactions_on_the_end_day(): void
    {
        $storeId = $this->store();

        FinancialTransactionModel::query()->create([
            'store_id' => $storeId,
            'reference_number' => 'TRX-BOUND-'.Str::upper(Str::random(6)),
            'type' => 'income',
            'title' => 'Penjualan malam',
            'amount' => 75000,
            'occurred_at' => '2026-02-28 23:59:00',
            'status' => 'posted',
            'is_active' => true,
        ]);

        $cashflow = app(SellerFinanceDashboardService::class)->getCashflow($storeId, '2026-02-01', '2026-02-28');

        $this->assertSame(75000.0, $cashflow['totals']['income']);
    }
}
