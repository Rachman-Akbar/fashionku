<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class EmailVerificationMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $code,
        public readonly int $expiresMinutes = 10,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kode Verifikasi - Fashionku',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.email-verification', [
                'code' => $this->code,
                'expiresAt' => $this->expiresMinutes.' menit',
            ])->render(),
        );
    }
}
