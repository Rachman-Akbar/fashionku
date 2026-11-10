<?php

use App\Domains\Finance\Commission\Presentation\Http\Controllers\AdminFeeConfigController;
use App\Domains\Finance\Commission\Presentation\Http\Controllers\SellerSettlementController;
use App\Domains\Finance\Commission\Presentation\Http\Controllers\SellerWithdrawalController;
use Illuminate\Support\Facades\Route;

Route::prefix('finance')->middleware(['auth:sanctum', 'active.user', 'throttle:60,1'])->group(function (): void {
    // Admin fee config management
    Route::prefix('admin/fee-configs')->middleware('permission:finance.manage')->group(function (): void {
        Route::get('/', [AdminFeeConfigController::class, 'index']);
        Route::post('/', [AdminFeeConfigController::class, 'store']);
        Route::put('/{id}', [AdminFeeConfigController::class, 'update']);
        Route::delete('/{id}', [AdminFeeConfigController::class, 'destroy']);
        Route::post('/calculate', [AdminFeeConfigController::class, 'calculate']);
    });

    // Seller settlements
    Route::prefix('seller/settlements')->group(function (): void {
        Route::get('/', [SellerSettlementController::class, 'index']);
        Route::get('/balance', [SellerSettlementController::class, 'balance']);
        Route::post('/settle', [SellerSettlementController::class, 'settle']);
    });

    // Seller withdrawals
    Route::prefix('seller/withdrawals')->group(function (): void {
        Route::get('/', [SellerWithdrawalController::class, 'index']);
        Route::post('/', [SellerWithdrawalController::class, 'store']);
    });

    // Admin withdrawal management
    Route::prefix('admin/withdrawals')->middleware('permission:finance.manage')->group(function (): void {
        Route::get('/', [SellerWithdrawalController::class, 'adminIndex']);
        Route::post('/{id}/approve', [SellerWithdrawalController::class, 'approve']);
        Route::post('/{id}/reject', [SellerWithdrawalController::class, 'reject']);
    });
});
