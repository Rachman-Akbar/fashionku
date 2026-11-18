<?php

declare(strict_types=1);

use App\Domains\Order\Payment\Presentation\Http\Controllers\MidtransWebhookController;
use App\Domains\Order\Payment\Presentation\Http\Controllers\PaymentConfigController;
use Illuminate\Support\Facades\Route;

Route::prefix('payments')->group(function (): void {
    Route::get('config', [PaymentConfigController::class, 'show'])->name('payments.config');
    Route::post('midtrans/notification', [MidtransWebhookController::class, 'handleNotification'])
        ->name('payments.midtrans.notification');
});
