<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// Public store-directory/detail routes removed (single-store, no "visit store").
// Seller management stays under /seller/* (and admin endpoints where needed).
Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])
    ->prefix('seller')
    ->group(function (): void {
        Route::get('stores/{id}/manage', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'manageShow'])->whereNumber('id');
        Route::put('stores/{id}', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'updateStore'])->whereNumber('id');
        Route::post('stores/{id}', [\App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController::class, 'updateStore'])->whereNumber('id');
    });
