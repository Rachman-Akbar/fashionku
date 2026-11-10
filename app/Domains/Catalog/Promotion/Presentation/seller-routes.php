<?php

declare(strict_types=1);

use App\Domains\Catalog\Promotion\Presentation\Http\Controllers\PromotionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller', 'seller.store.available'])
    ->prefix('promotions')
    ->name('seller.promotions.')
    ->group(function (): void {
        Route::get('/manage', [PromotionController::class, 'sellerManage'])->name('manage');
        Route::post('/', [PromotionController::class, 'sellerStore'])->name('store');
        Route::put('/{id}', [PromotionController::class, 'sellerUpdate'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [PromotionController::class, 'sellerDestroy'])->whereNumber('id')->name('destroy');
    });
