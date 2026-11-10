<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class PasswordChangedMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $userName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Password Berhasil Diubah - Fashionku',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.password-changed', [
                'userName' => $this->userName,
            ])->render(),
        );
    }
}
