<?php

declare(strict_types=1);

use App\Domains\Seller\Finance\Presentation\Http\Controllers\FinancialTransactionController;
use App\Domains\Seller\Finance\Presentation\Http\Controllers\HutangPiutangController;
use App\Domains\Seller\Finance\Presentation\Http\Controllers\SellerFinanceDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin', 'permission:finance.manage'])
    ->prefix('finance')
    ->group(function (): void {
        // Dashboard
        Route::get('/dashboard', [SellerFinanceDashboardController::class, 'index']);
        Route::get('/dashboard/cashflow', [SellerFinanceDashboardController::class, 'cashflow']);
        Route::get('/dashboard/order-trend', [SellerFinanceDashboardController::class, 'orderTrend']);

        // Transactions
        Route::get('/', [FinancialTransactionController::class, 'index']);
        Route::post('/', [FinancialTransactionController::class, 'store']);
        Route::get('{id}', [FinancialTransactionController::class, 'show'])->whereNumber('id');
        Route::put('{id}', [FinancialTransactionController::class, 'update'])->whereNumber('id');
        Route::patch('{id}/payments', [FinancialTransactionController::class, 'recordPayment'])->whereNumber('id');
        Route::get('{id}/payments', [FinancialTransactionController::class, 'paymentHistory'])->whereNumber('id');
        Route::delete('{id}', [FinancialTransactionController::class, 'destroy'])->whereNumber('id');

        // Hutang/Piutang
        Route::get('/hutang-piutang/summary', [HutangPiutangController::class, 'summary']);
        Route::get('/hutang-piutang/aging', [HutangPiutangController::class, 'aging']);
        Route::get('/hutang-piutang/{type}', [HutangPiutangController::class, 'detail'])->where('type', 'payable|receivable');
        Route::get('/hutang-piutang/{type}/export', [HutangPiutangController::class, 'export'])->where('type', 'payable|receivable');
    });
