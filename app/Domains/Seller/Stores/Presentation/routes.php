<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// Single-store internal: no public store-directory/detail.
// Seller manages the primary (only) store via /seller/store/* routes.
Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])
    ->group(function (): void {
        Route::get('store/manage', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'manageShow']);
        Route::put('store', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'updateStore']);
        Route::post('store', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'updateStore']);
    });
