<?php

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use DomainException;

class CancelOrderUseCase
{
    public function __construct(private OrderRepositoryInterface $orderRepository) {}

    public function execute(int $orderId): void
    {
        $order = $this->orderRepository->findById($orderId);

        if (! $order) {
            throw new DomainException('Order tidak ditemukan.');
        }

        if (in_array($order->status, ['shipped', 'received', 'completed', 'cancelled'], true)) {
            throw new DomainException('Order yang sudah dikirim, diterima, selesai, atau dibatalkan tidak dapat dibatalkan.');
        }

        if ($order->paymentStatus === 'paid') {
            throw new DomainException('Order yang sudah dibayar memerlukan proses refund sebelum dibatalkan.');
        }

        $order->status = 'cancelled';
        $order->paymentStatus = 'cancelled';
        $this->orderRepository->update($order);
    }
}
