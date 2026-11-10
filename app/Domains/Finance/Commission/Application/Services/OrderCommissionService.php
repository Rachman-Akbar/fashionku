<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Application\Services;

use App\Domains\Finance\Commission\Application\UseCases\CalculateCommissionUseCase;
use App\Domains\Finance\Commission\Domain\Entities\SellerSettlement;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use Illuminate\Support\Facades\DB;

final class OrderCommissionService
{
    public function __construct(
        private CalculateCommissionUseCase $calculateCommission
    ) {}

    /**
     * Catat komisi/settlement saat sub-order milik seller selesai (completed).
     *
     * Idempotent: jika settlement untuk (order, sub-order) sudah ada maka
     * kolom admin_fee/seller_net tetap disinkronkan tanpa membuat duplikat.
     */
    public function recordForSubOrder(int $subOrderId, ?string $buyerUserId = null): ?SellerSettlement
    {
        return DB::transaction(function () use ($subOrderId, $buyerUserId): ?SellerSettlement {
            $subOrder = SubOrderModel::query()
                ->with('parentOrder')
                ->lockForUpdate()
                ->find($subOrderId);

            if (! $subOrder || (string) $subOrder->status !== 'completed') {
                return null;
            }

            $amount = (float) ($subOrder->total_items_price ?? 0);

            if ($amount <= 0) {
                return null;
            }

            $settlement = $this->calculateCommission->execute(
                orderId: (int) $subOrder->order_id,
                storeId: (int) $subOrder->store_id,
                subOrderId: (int) $subOrder->id,
                subOrderAmount: $amount,
                shippingCost: (float) ($subOrder->shipping_cost ?? 0),
                orderNumber: (string) ($subOrder->sub_order_number ?: $subOrder->parentOrder?->order_number ?: ''),
                orderType: (string) ($subOrder->parentOrder?->order_type ?? 'normal'),
                buyerUserId: $buyerUserId,
            );

            $subOrder->forceFill([
                'admin_fee' => $settlement->adminFee,
                'seller_net' => $settlement->netAmount,
            ])->save();

            $this->syncParentAmounts((int) $subOrder->order_id);

            return $settlement;
        });
    }

    private function syncParentAmounts(int $orderId): void
    {
        $totals = SubOrderModel::query()
            ->where('order_id', $orderId)
            ->selectRaw('COALESCE(SUM(admin_fee), 0) as admin_fee')
            ->selectRaw('COALESCE(SUM(seller_net), 0) as seller_net')
            ->first();

        if (! $totals) {
            return;
        }

        OrderModel::query()->where('id', $orderId)->update([
            'admin_fee' => (float) $totals->admin_fee,
            'seller_net' => (float) $totals->seller_net,
        ]);
    }
}
