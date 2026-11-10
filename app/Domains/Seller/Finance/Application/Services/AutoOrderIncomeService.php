<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Services;

use App\Domains\Finance\Commission\Application\Services\OrderCommissionService;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Illuminate\Support\Str;

final class AutoOrderIncomeService
{
    public function __construct(
        private OrderCommissionService $orderCommission
    ) {}

    /**
     * Mencatat pemasukan otomatis saat sub-order milik seller selesai (completed).
     *
     * Idempotent: jika sudah ada transaksi income untuk (store, order) maka dilewati.
     * Komisi/settlement dihitung lebih dulu agar pemasukan memakai seller_net
     * (gross - admin fee) bila tersedia.
     *
     * @return bool true bila pemasukan berhasil dicatat
     */
    public function recordForSubOrder(int $subOrderId, ?string $buyerUserId = null): bool
    {
        $subOrder = SubOrderModel::query()
            ->with(['items', 'parentOrder'])
            ->find($subOrderId);

        if (! $subOrder || (string) $subOrder->status !== 'completed') {
            return false;
        }

        $this->orderCommission->recordForSubOrder($subOrderId, $buyerUserId);
        $subOrder->refresh();

        $alreadyRecorded = FinancialTransactionModel::query()
            ->where('store_id', $subOrder->store_id)
            ->where('order_id', $subOrder->order_id)
            ->where('type', 'income')
            ->exists();

        if ($alreadyRecorded) {
            return false;
        }

        $amount = (float) $subOrder->seller_net > 0
            ? (float) $subOrder->seller_net
            : (float) ($subOrder->total_items_price ?? 0);

        if ($amount <= 0) {
            return false;
        }

        $orderNumber = (string) ($subOrder->sub_order_number ?: $subOrder->parentOrder?->order_number ?: '');
        $productLines = $subOrder->items
            ->map(fn ($item): string => trim((string) $item->product_name).' x'.(int) $item->quantity)
            ->filter()
            ->join(', ');

        if ($orderNumber === '') {
            return false;
        }

        $totalQuantity = $subOrder->items->sum(fn ($item): int => (int) $item->quantity);
        $title = "Pemasukan sesuai dengan no order {$orderNumber}";
        $titleBody = "Order product {$productLines} dengan jumlah {$totalQuantity} nomor order {$orderNumber}";

        $model = new FinancialTransactionModel;
        $model->fill([
            'store_id' => $subOrder->store_id,
            'order_id' => $subOrder->order_id,
            'user_id' => $buyerUserId,
            'reference_number' => $this->referenceNumber(),
            'type' => 'income',
            'title' => Str::limit($title, 160),
            'description' => $titleBody,
            'amount' => round($amount, 2),
            'paid_amount' => 0,
            'status' => 'posted',
            'occurred_at' => $subOrder->updated_at ?? now(),
            'is_active' => true,
            'metadata' => [
                'source' => 'order_completed',
                'order_number' => $orderNumber,
                'sub_order_id' => $subOrder->id,
            ],
        ]);

        $model->save();

        return true;
    }

    private function referenceNumber(): string
    {
        return 'INC-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
    }
}
