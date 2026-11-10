<?php

declare(strict_types=1);

namespace App\Domains\Order\Payment\Infrastructure\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

final class MidtransService
{
    private string $serverKey;

    private string $baseUrl;

    private ?array $enabledPayments;

    public function __construct()
    {
        $this->serverKey = (string) config('midtrans.server_key');
        $this->enabledPayments = config('midtrans.enabled_payments');
        $this->baseUrl = config('midtrans.is_production')
            ? 'https://app.midtrans.com/snap/v1/'
            : 'https://app.sandbox.midtrans.com/snap/v1/';
    }

    public function createSnapToken(array $params): string
    {
        if ($this->serverKey === '') {
            throw new RuntimeException('MIDTRANS_SERVER_KEY belum dikonfigurasi.');
        }

        $payload = [
            'transaction_details' => [
                'order_id' => (string) $params['order_id'],
                'gross_amount' => max(1, (int) $params['gross_amount']),
            ],
            'customer_details' => [
                'user_id' => (string) $params['user_id'],
                'first_name' => (string) ($params['customer_name'] ?? 'Customer'),
                'email' => (string) ($params['customer_email'] ?? ''),
            ],
            'credit_card' => [
                'secure' => (bool) config('midtrans.is_3ds', true),
            ],
        ];

        if (is_array($this->enabledPayments) && $this->enabledPayments !== []) {
            $payload['enabled_payments'] = $this->enabledPayments;
        }

        $response = Http::acceptJson()
            ->asJson()
            ->withBasicAuth($this->serverKey, '')
            ->timeout(20)
            ->retry(2, 250)
            ->post($this->baseUrl.'transactions', $payload);

        if ($response->failed()) {
            $errors = $response->json('error_messages');
            $message = is_array($errors) && isset($errors[0]) ? (string) $errors[0] : 'Gagal membuat transaksi Midtrans.';
            throw new RuntimeException($message);
        }

        $token = $response->json('token');
        if (! is_string($token) || $token === '') {
            throw new RuntimeException('Midtrans tidak mengembalikan Snap token.');
        }

        return $token;
    }
}
