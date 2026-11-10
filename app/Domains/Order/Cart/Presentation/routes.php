<?php

declare(strict_types=1);

use App\Domains\Order\Cart\Presentation\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('carts')
    ->name('carts.')
    ->group(function (): void {
        Route::get('/', [CartController::class, 'show'])
            ->name('show');

        Route::post('/items', [CartController::class, 'store'])
            ->name('items.store');

        Route::patch('/items/{productVariantId}', [CartController::class, 'update'])
            ->name('items.update');

        Route::delete('/items/{productVariantId}', [CartController::class, 'destroy'])
            ->name('items.destroy');

        Route::delete('/', [CartController::class, 'clear'])
            ->name('clear');
    });
