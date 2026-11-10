<?php

namespace App\Domains\Order\Payment\Application\UseCases;

use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Payment\Infrastructure\Services\MidtransService;
use Exception;
use Illuminate\Support\Facades\DB;

class ProcessPaymentUseCase
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private MidtransService $midtransService
    ) {}

    public function execute(string $orderNumber, string $paymentMethod): array
    {
        return DB::transaction(function () use ($orderNumber, $paymentMethod): array {
            // Lock the order row inside the transaction so concurrent invocations
            // for the same order serialize here (prevents duplicate payment rows).
            $order = $this->orderRepository->findByOrderNumber($orderNumber, true);
            if (! $order) {
                throw new Exception('Order tidak ditemukan.');
            }

            $finalPay = $order->getFinalPay();

            $existingPending = DB::table('payments')
                ->where('order_number', $orderNumber)
                ->where('status', 'pending')
                ->first();

            if ($existingPending) {
                return [
                    'payment_method' => $existingPending->payment_method,
                    'snap_token' => $order->snapToken,
                    'status' => 'pending',
                ];
            }

            // 1. Logika Jika Ambil Sendiri / COD / Transfer Manual
            if (in_array($paymentMethod, ['cod', 'transfer_manual', 'tunai_toko'])) {
                DB::table('payments')->insert([
                    'order_number' => $orderNumber,
                    'payment_method' => $paymentMethod,
                    'amount' => $finalPay,
                    'status' => 'pending',
                    'created_at' => now(),
                ]);

                return [
                    'payment_method' => $paymentMethod,
                    'snap_token' => null,
                    'status' => 'pending',
                ];
            }

            // 2. Logika Jika Menggunakan Midtrans
            if ($paymentMethod === 'midtrans') {
                $snapToken = $order->snapToken;
                if (! $snapToken) {
                    $snapToken = $this->midtransService->createSnapToken([
                        'order_id' => $order->orderNumber,
                        'gross_amount' => $finalPay,
                        'user_id' => $order->userId,
                    ]);

                    $order->snapToken = $snapToken;
                    $this->orderRepository->update($order);
                }

                DB::table('payments')->insert([
                    'order_number' => $orderNumber,
                    'payment_method' => 'midtrans',
                    'amount' => $finalPay,
                    'status' => 'pending',
                    'created_at' => now(),
                ]);

                return [
                    'payment_method' => 'midtrans',
                    'snap_token' => $snapToken,
                    'status' => 'pending',
                ];
            }

            throw new Exception('Metode pembayaran tidak dikenali.');
        });
    }
}
