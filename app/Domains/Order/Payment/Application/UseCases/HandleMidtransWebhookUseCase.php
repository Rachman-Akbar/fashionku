<?php

declare(strict_types=1);

namespace App\Domains\Order\Payment\Application\UseCases;

use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Payment\Domain\Entities\Payment;
use App\Domains\Order\Payment\Domain\Repositories\PaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;
use RuntimeException;

final class HandleMidtransWebhookUseCase
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private PaymentRepositoryInterface $paymentRepository
    ) {}

    public function execute(array $payload): void
    {
        foreach (['order_id', 'status_code', 'gross_amount', 'transaction_status', 'signature_key'] as $field) {
            if (! isset($payload[$field]) || $payload[$field] === '') {
                throw new RuntimeException("Payload Midtrans tidak memiliki field {$field}.");
            }
        }

        $orderNumber = (string) $payload['order_id'];
        $statusCode = (string) $payload['status_code'];
        $grossAmount = (string) $payload['gross_amount'];
        $transactionStatus = strtolower((string) $payload['transaction_status']);
        $fraudStatus = strtolower((string) ($payload['fraud_status'] ?? 'accept'));
        $paymentType = (string) ($payload['payment_type'] ?? 'midtrans');
        $incomingSignature = (string) $payload['signature_key'];
        $serverKey = (string) config('midtrans.server_key');

        if ($serverKey === '') {
            throw new RuntimeException('MIDTRANS_SERVER_KEY belum dikonfigurasi.');
        }

        $localSignature = hash('sha512', $orderNumber.$statusCode.$grossAmount.$serverKey);
        if (! hash_equals($localSignature, $incomingSignature)) {
            throw new RuntimeException('Signature Midtrans tidak valid.');
        }

        $order = $this->orderRepository->findByOrderNumber($orderNumber);
        if (! $order) {
            throw new RuntimeException("Order {$orderNumber} tidak ditemukan.");
        }

        if (abs((float) $grossAmount - $order->getFinalPay()) > 1) {
            throw new RuntimeException('Nominal notifikasi Midtrans tidak sesuai dengan total order.');
        }

        [$paymentStatus, $orderStatus, $paymentLogStatus] = match ($transactionStatus) {
            'capture' => $fraudStatus === 'accept'
                ? ['paid', 'processing', 'success']
                : ['challenged', 'pending', 'challenge'],
            'settlement' => ['paid', 'processing', 'success'],
            'cancel', 'deny', 'expire' => ['failed', 'cancelled', 'failed'],
            'refund', 'partial_refund' => ['refunded', 'cancelled', 'refunded'],
            default => ['unpaid', 'pending', 'pending'],
        };

        DB::transaction(function () use ($order, $paymentStatus, $orderStatus, $paymentLogStatus, $paymentType, $payload): void {
            $order->paymentStatus = $paymentStatus;
            $order->status = $orderStatus;
            $order->paymentMethod = $paymentType;
            $this->orderRepository->update($order);

            $payment = $this->paymentRepository->findByOrderNumber($order->orderNumber)
                ?? new Payment(
                    id: null,
                    orderNumber: $order->orderNumber,
                    transactionId: null,
                    paymentMethod: $paymentType,
                    amount: $order->getFinalPay(),
                    status: 'pending',
                    payload: null
                );

            $payment->paymentMethod = $paymentType;
            $payment->transactionId = isset($payload['transaction_id']) ? (string) $payload['transaction_id'] : $payment->transactionId;
            $payment->status = $paymentLogStatus;
            $payment->payload = $payload;
            $this->paymentRepository->save($payment);
        });
    }
}
