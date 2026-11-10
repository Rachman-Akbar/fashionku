<?php

declare(strict_types=1);

use App\Domains\Catalog\Banner\Presentation\Http\Controllers\BannerController;
use Illuminate\Support\Facades\Route;

Route::prefix('banners')->name('shop-banners.')->group(function (): void {
    Route::get('/', [BannerController::class, 'index'])
        ->middleware('cache.headers:public;max_age=60;etag')
        ->name('index');

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function (): void {
            Route::get('/manage', [BannerController::class, 'adminManage'])->name('manage');
            Route::post('/', [BannerController::class, 'adminStore'])->name('store');
            Route::put('/{id}', [BannerController::class, 'adminUpdate'])->whereNumber('id')->name('update');
            Route::delete('/{id}', [BannerController::class, 'adminDestroy'])->whereNumber('id')->name('destroy');
        });

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller', 'seller.store.available'])->group(function (): void {
        Route::get('/manage', [BannerController::class, 'manage'])->name('manage');
        Route::post('/', [BannerController::class, 'store'])->name('store');
        Route::put('/{id}', [BannerController::class, 'update'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [BannerController::class, 'destroy'])->whereNumber('id')->name('destroy');
    });
});
