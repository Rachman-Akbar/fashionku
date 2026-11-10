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

final class OrderShippedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Order $order,
        public readonly string $buyerName,
        public readonly string $trackingNumber,
        public readonly string $courierName,
    ) {
        $this->onQueue('emails');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pesanan #{$this->order->orderNumber} Sedang Dikirim",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlView: 'emails.order-shipped',
            with: [
                'buyerName' => $this->buyerName,
                'orderNumber' => $this->order->orderNumber,
                'trackingNumber' => $this->trackingNumber,
                'courierName' => $this->courierName,
                'orderUrl' => config('app.frontend_url')."/orders/{$this->order->id}",
            ],
        );
    }
}
