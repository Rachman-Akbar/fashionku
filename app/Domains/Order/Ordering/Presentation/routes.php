<?php

use App\Domains\Order\Ordering\Presentation\Http\Controllers\OrderingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('orderings')
    ->name('orderings.')
    ->group(function (): void {
        Route::get('/', [OrderingController::class, 'index']);
        Route::post('/', [OrderingController::class, 'store']);
        Route::post('manual', [OrderingController::class, 'storeManual']);
        Route::post('shipping-options', [OrderingController::class, 'shippingOptions']);
        Route::get('customers/{userId}', [OrderingController::class, 'getByCustomer']);
        Route::get('stores/{storeId}', [OrderingController::class, 'getByStore']);
        Route::get('{id}', [OrderingController::class, 'show']);
        Route::patch('{id}', [OrderingController::class, 'update']);
        Route::post('{id}/cancel', [OrderingController::class, 'cancel']);
        Route::patch('{id}/status', [OrderingController::class, 'updateStatus']);
        Route::post('{id}/notify-status', [OrderingController::class, 'notifyStatus']);
        Route::delete('{id}', [OrderingController::class, 'destroy']);
    });
