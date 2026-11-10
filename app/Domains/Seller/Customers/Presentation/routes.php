<?php

declare(strict_types=1);

use App\Domains\Seller\Customers\Presentation\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin', 'permission:orders.view'])
    ->prefix('customers')
    ->group(function (): void {
        Route::get('/', [CustomerController::class, 'index']);
    });

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller', 'permission:orders.view'])
    ->prefix('customers')
    ->group(function (): void {
        Route::post('/', [CustomerController::class, 'store']);
        Route::patch('{customer}', [CustomerController::class, 'update']);
        Route::delete('{customer}', [CustomerController::class, 'destroy']);
    });
