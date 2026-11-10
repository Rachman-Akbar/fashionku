<?php

declare(strict_types=1);

use App\Domains\Identity\User\Presentation\Http\Controllers\PermissionController;
use App\Domains\Identity\User\Presentation\Http\Controllers\RoleController;
use App\Domains\Identity\User\Presentation\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])->group(function (): void {
    Route::prefix('users')->name('users.')->group(function (): void {
        Route::middleware('active.role:admin')->group(function (): void {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
        });

        Route::get('/email/{email}', [UserController::class, 'showByEmail'])->name('show-by-email');
        Route::get('/{id}', [UserController::class, 'show'])->name('show');
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
    });

    Route::get('permissions', [PermissionController::class, 'index'])
        ->middleware('active.role:admin')
        ->name('permissions.index');

    Route::prefix('roles')->name('roles.')->middleware('active.role:admin')->group(function (): void {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{id}', [RoleController::class, 'show'])->whereNumber('id')->name('show');
        Route::put('/{id}', [RoleController::class, 'update'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->whereNumber('id')->name('destroy');
    });
});
