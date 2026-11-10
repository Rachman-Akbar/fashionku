<?php

declare(strict_types=1);

use App\Domains\Order\Addresses\Presentation\Http\Controllers\AddressController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('addresses')
    ->name('addresses.')
    ->group(function (): void {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/resolve-destination', [AddressController::class, 'resolveDestination']);
        Route::post('/', [AddressController::class, 'store']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
    });
