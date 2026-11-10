<?php

declare(strict_types=1);

use App\Domains\Order\Wishlist\Presentation\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('wishlist')
    ->name('wishlist.')
    ->group(function (): void {
        Route::get('/', [WishlistController::class, 'index'])->name('index');
        Route::post('/', [WishlistController::class, 'store'])->name('store');
        Route::delete('/{productId}', [WishlistController::class, 'destroy'])
            ->whereNumber('productId')
            ->name('destroy');
    });
