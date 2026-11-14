<?php

declare(strict_types=1);

use App\Domains\Seller\Settings\Presentation\Http\Controllers\StoreSettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])
    ->group(function (): void {
        Route::get('settings/store', [StoreSettingsController::class, 'show']);
        Route::put('settings/store', [StoreSettingsController::class, 'update']);
        Route::post('settings/store', [StoreSettingsController::class, 'update']);
    });
