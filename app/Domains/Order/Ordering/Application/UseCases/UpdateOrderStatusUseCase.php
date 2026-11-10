<?php

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Ordering\Application\Services\OrderStatusNotifier;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Finance\Application\Services\AutoOrderIncomeService;
use DomainException;
use Illuminate\Support\Facades\DB;

class UpdateOrderStatusUseCase
{
    private const TRANSITIONS = [
        'pending' => ['processing', 'cancelled'],
        'processing' => ['shipped', 'cancelled'],
        'shipped' => ['received', 'completed'],
        'received' => ['completed'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private AutoOrderIncomeService $autoOrderIncome,
        private OrderStatusNotifier $statusNotifier
    ) {}

    public function execute(int $orderId, string $status, ?string $reason = null): void
    {
        $result = DB::transaction(function () use ($orderId, $status): array {
            $order = $this->orderRepository->findById($orderId);

            if (! $order) {
                throw new DomainException('Order tidak ditemukan.');
            }

            if ($order->status === $status) {
                return ['notify' => false];
            }

            $allowed = self::TRANSITIONS[$order->status] ?? [];

            if (! in_array($status, $allowed, true)) {
                throw new DomainException("Perubahan status dari {$order->status} ke {$status} tidak diizinkan.");
            }

            if ($status === 'processing' && $order->paymentMethod === 'midtrans' && $order->paymentStatus !== 'paid') {
                throw new DomainException('Order Midtrans belum memiliki pembayaran yang berhasil.');
            }

            $order->status = $status;

            if ($status === 'received') {
                $order->receivedAt = now()->toDateTimeString();
            }

            $this->orderRepository->update($order);

            if ($status === 'completed') {
                SubOrderModel::query()
                    ->where('order_id', $orderId)
                    ->where('status', 'completed')
                    ->get()
                    ->each(fn (SubOrderModel $subOrder) => $this->autoOrderIncome->recordForSubOrder(
                        (int) $subOrder->id,
                        $order->userId
                    ));
            }

            return ['notify' => true];
        });

        if ($result['notify']) {
            $this->statusNotifier->notifyStatus($orderId, $status, $reason);
        }
    }
}
