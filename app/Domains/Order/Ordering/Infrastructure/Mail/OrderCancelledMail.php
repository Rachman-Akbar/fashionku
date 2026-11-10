<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Infrastructure\Mail;

use App\Domains\Order\Ordering\Domain\Entities\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class OrderCancelledMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Order $order,
        public readonly string $recipientName,
        public readonly string $reason,
    ) {
        $this->onQueue('emails');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pesanan #{$this->order->orderNumber} Dibatalkan",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlView: 'emails.order-cancelled',
            with: [
                'recipientName' => $this->recipientName,
                'orderNumber' => $this->order->orderNumber,
                'totalAmount' => number_format($this->order->getFinalPay(), 0, ',', '.'),
                'reason' => $this->reason,
                'orderUrl' => config('app.frontend_url')."/orders/{$this->order->id}",
            ],
        );
    }
}
