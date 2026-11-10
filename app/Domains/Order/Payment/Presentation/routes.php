<?php

declare(strict_types=1);

use App\Domains\Order\Payment\Presentation\Http\Controllers\MidtransWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('payments/midtrans')->group(function (): void {
    Route::post('notification', [MidtransWebhookController::class, 'handleNotification'])
        ->name('payments.midtrans.notification');
});
