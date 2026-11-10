<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\Services;

use App\Domains\Communication\Chat\Application\Services\StatusNotificationChatService;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Domain\Entities\Order;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderCancelledMail;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderCompletedMail;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderConfirmedMail;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderDeliveredMail;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderProcessingMail;
use App\Domains\Order\Ordering\Infrastructure\Mail\OrderShippedMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

/**
 * Mengirim pemberitahuan status order ke buyer, baik lewat chat (dimulai oleh
 * admin sistem) maupun email. Chat hanya untuk status yang diproses/selesai,
 * email dikirim untuk semua transisi status.
 */
final class OrderStatusNotifier
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly StatusNotificationChatService $chat,
    ) {}

    /**
     * @return array{chat: bool, email: bool}
     */
    public function notifyStatus(int $orderId, string $status, ?string $reason = null): array
    {
        $order = $this->orders->findById($orderId);

        if (! $order) {
            throw new RuntimeException('Order tidak ditemukan.');
        }

        $buyer = User::find($order->userId);

        return [
            'chat' => $this->notifyChat($order, $status, $buyer),
            'email' => $this->notifyEmail($order, $status, $buyer, $reason),
        ];
    }

    private function notifyChat(Order $order, string $status, ?User $buyer): bool
    {
        if (! in_array($status, ['processing', 'completed'], true) || ! $buyer) {
            return false;
        }

        if ($status === 'processing') {
            $message = "Halo {$buyer->name}, pesanan #{$order->orderNumber} kamu sudah disetujui "
                .'dan sedang diproses oleh penjual. Kami akan menginformasikan perkembangan selanjutnya. 🙏';
        } else {
            $message = "Halo {$buyer->name}, pesanan #{$order->orderNumber} kamu sudah SELESAI. "
                .'Terima kasih sudah berbelanja di Fashionku. Jangan lupa beri rating seperti biasa ya! ⭐';
        }

        return $this->chat->send(
            buyerId: (string) $buyer->id,
            title: 'Pembaruan Pesanan',
            message: $message,
            attachments: [
                'kind' => 'order_status',
                'notification_key' => "order:{$order->id}:{$status}",
                'order_id' => (string) $order->id,
                'order_number' => (string) $order->orderNumber,
                'status' => $status,
                'subject' => 'Pembaruan Pesanan #'.$order->orderNumber,
            ],
        ) !== null;
    }

    private function notifyEmail(Order $order, string $status, ?User $buyer, ?string $reason): bool
    {
        if (! $buyer || empty($buyer->email)) {
            return false;
        }

        $buyerName = $buyer->name ?? 'Pelanggan';

        try {
            match ($status) {
                'pending' => Mail::to($buyer->email)->send(new OrderConfirmedMail($order, $buyerName)),
                'processing' => Mail::to($buyer->email)->send(new OrderProcessingMail($order, $buyerName)),
                'shipped' => Mail::to($buyer->email)->send(new OrderShippedMail(
                    $order,
                    $buyerName,
                    'TRX-'.strtoupper(substr(md5((string) $order->id), 0, 8)),
                    'Standard'
                )),
                'received' => Mail::to($buyer->email)->send(new OrderDeliveredMail($order, $buyerName)),
                'completed' => Mail::to($buyer->email)->send(new OrderCompletedMail($order, $buyerName)),
                'cancelled' => Mail::to($buyer->email)->send(new OrderCancelledMail($order, $buyerName, $reason ?? 'Dibatalkan oleh sistem')),
                default => null,
            };

            return true;
        } catch (\Throwable $e) {
            Log::warning('Gagal mengirim email status order', [
                'order_id' => $order->id,
                'status' => $status,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
