<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class PasswordResetMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $resetUrl,
        public readonly int $expiresMinutes = 60,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password - Fashionku',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.password-reset', [
                'url' => $this->resetUrl,
                'expiresAt' => $this->expiresMinutes.' menit',
            ])->render(),
        );
    }
}
