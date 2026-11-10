<?php

declare(strict_types=1);

use App\Domains\Seller\Stock\Presentation\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin', 'permission:stock.manage'])
    ->prefix('stock')
    ->group(function (): void {
        Route::get('movements', [StockMovementController::class, 'index']);
        Route::post('adjustments', [StockMovementController::class, 'store']);
    });
