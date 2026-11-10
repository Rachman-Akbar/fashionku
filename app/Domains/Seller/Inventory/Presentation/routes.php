<?php

declare(strict_types=1);

use App\Domains\Seller\Inventory\Presentation\Http\Controllers\RawMaterialController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin', 'permission:stock.manage'])
    ->prefix('inventory')
    ->group(function (): void {
        Route::get('materials', [RawMaterialController::class, 'index']);
        Route::post('materials', [RawMaterialController::class, 'store']);
        Route::put('materials/{id}', [RawMaterialController::class, 'update'])->whereNumber('id');
        Route::delete('materials/{id}', [RawMaterialController::class, 'destroy'])->whereNumber('id');
        Route::post('materials/{id}/stock', [RawMaterialController::class, 'adjust'])->whereNumber('id');
        Route::get('material-movements', [RawMaterialController::class, 'movements']);
        Route::get('cost-impacts', [RawMaterialController::class, 'costImpacts']);
    });
