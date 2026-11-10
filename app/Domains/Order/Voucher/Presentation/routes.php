<?php

declare(strict_types=1);

use App\Domains\Order\Voucher\Presentation\Http\Controllers\VoucherController;
use Illuminate\Support\Facades\Route;

Route::prefix('vouchers')->name('vouchers.')->group(function (): void {
    Route::get('/', [VoucherController::class, 'index'])->name('index');

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function (): void {
            Route::get('/manage/list', [VoucherController::class, 'manage'])->name('manage');
            Route::post('/', [VoucherController::class, 'store'])->name('store');
            Route::put('/{id}', [VoucherController::class, 'update'])->whereNumber('id')->name('update');
            Route::post('/{id}', [VoucherController::class, 'update'])->whereNumber('id')->name('update.multipart');
            Route::delete('/{id}', [VoucherController::class, 'destroy'])->whereNumber('id')->name('destroy');
        });

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller', 'seller.store.available'])
        ->prefix('seller')
        ->name('seller.')
        ->group(function (): void {
            Route::get('/manage/list', [VoucherController::class, 'manage'])->name('manage');
            Route::post('/', [VoucherController::class, 'store'])->name('store');
            Route::put('/{id}', [VoucherController::class, 'update'])->whereNumber('id')->name('update');
            Route::post('/{id}', [VoucherController::class, 'update'])->whereNumber('id')->name('update.multipart');
            Route::delete('/{id}', [VoucherController::class, 'destroy'])->whereNumber('id')->name('destroy');
        });

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
        ->group(function (): void {
            Route::get('/mine', [VoucherController::class, 'myVouchers'])->name('mine');
            Route::post('/{id}/claim', [VoucherController::class, 'claim'])->whereNumber('id')->name('claim');
            Route::get('/{id}', [VoucherController::class, 'show'])->whereNumber('id')->name('show');
        });
});
