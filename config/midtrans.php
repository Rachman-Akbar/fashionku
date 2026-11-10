<?php

declare(strict_types=1);

$enabledPayments = trim((string) env('MIDTRANS_ENABLED_PAYMENTS', ''));

return [
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'server_key' => env('MIDTRANS_SERVER_KEY'),

    'is_production' => filter_var(
        env('MIDTRANS_IS_PRODUCTION', false),
        FILTER_VALIDATE_BOOLEAN,
    ),

    'is_sanitized' => true,
    'is_3ds' => true,

    /*
    |--------------------------------------------------------------------------
    | Enabled Payments
    |--------------------------------------------------------------------------
    |
    | Kosongkan MIDTRANS_ENABLED_PAYMENTS agar Snap menampilkan semua payment
    | channel yang aktif di dashboard Midtrans.
    |
    | Jangan pakai qris langsung untuk Snap.
    | Untuk QRIS flow di Snap, aktifkan gopay / shopeepay.
    |
    | Contoh:
    | MIDTRANS_ENABLED_PAYMENTS=credit_card,gopay,shopeepay,bca_va,bni_va,bri_va,permata_va,other_va
    |
    */
    'enabled_payments' => $enabledPayments === ''
        ? null
        : array_values(array_filter(array_map(
            static fn (string $value): string => trim($value),
            explode(',', $enabledPayments),
        ))),
];
