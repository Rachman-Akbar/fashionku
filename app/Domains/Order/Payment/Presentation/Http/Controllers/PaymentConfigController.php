<?php

declare(strict_types=1);

namespace App\Domains\Order\Payment\Presentation\Http\Controllers;

use App\Domains\Shared\Settings\Application\Services\AppSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

/**
 * Konfigurasi pembayaran untuk pembeli.
 *
 * QRIS sengaja ditampilkan sebagai gambar hasil upload admin (alur manual
 * seperti transfer_manual) karena Snap QRIS tidak didukung konfigurasi
 * Midtrans di `config/midtrans.php`.
 */
final class PaymentConfigController extends Controller
{
    public function __construct(private AppSettingService $settings) {}

    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->settings->paymentProfile(),
        ]);
    }
}
