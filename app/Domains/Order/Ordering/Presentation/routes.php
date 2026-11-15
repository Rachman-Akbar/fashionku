<?php

use App\Domains\Order\Ordering\Presentation\Http\Controllers\OrderingController;
use App\Domains\Order\Ordering\Presentation\Http\Controllers\ShippingSettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('orderings')
    ->name('orderings.')
    ->group(function (): void {
        Route::middleware('active.role:admin')->prefix('shipping-settings')->name('shipping-settings.')->group(function (): void {
            Route::get('/', [ShippingSettingsController::class, 'show'])->name('show');
            Route::put('/', [ShippingSettingsController::class, 'update'])->name('update');
        });

        Route::get('/', [OrderingController::class, 'index']);
        Route::post('/', [OrderingController::class, 'store']);
        Route::post('manual', [OrderingController::class, 'storeManual']);
        Route::post('shipping-options', [OrderingController::class, 'shippingOptions']);
        Route::get('customers/{userId}', [OrderingController::class, 'getByCustomer']);
        Route::get('{id}', [OrderingController::class, 'show']);
        Route::patch('{id}', [OrderingController::class, 'update']);
        Route::post('{id}/cancel', [OrderingController::class, 'cancel']);
        Route::patch('{id}/status', [OrderingController::class, 'updateStatus']);
        Route::post('{id}/notify-status', [OrderingController::class, 'notifyStatus']);
        Route::delete('{id}', [OrderingController::class, 'destroy']);
    });
