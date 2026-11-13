<?php

declare(strict_types=1);

use App\Domains\Seller\Schedule\Presentation\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin', 'permission:stock.manage'])
    ->prefix('schedules')
    ->group(function (): void {
        Route::get('/', [ScheduleController::class, 'index']);
        Route::post('/', [ScheduleController::class, 'store']);
        Route::get('{id}', [ScheduleController::class, 'show'])->whereNumber('id');
        Route::put('{id}', [ScheduleController::class, 'update'])->whereNumber('id');
        Route::delete('{id}', [ScheduleController::class, 'destroy'])->whereNumber('id');
    });
