<?php

declare(strict_types=1);

use App\Domains\Admin\Notification\Presentation\Http\Controllers\AdminNotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:admin'])
    ->prefix('admin/notifications')
    ->name('admin.notifications.')
    ->group(function (): void {
        Route::get('/', [AdminNotificationController::class, 'index'])->name('index');
        Route::get('/state', [AdminNotificationController::class, 'state'])->name('state');
        Route::post('/read-all', [AdminNotificationController::class, 'markAllRead'])->name('read-all');
        Route::post('/{id}/read', [AdminNotificationController::class, 'markRead'])
            ->whereNumber('id')
            ->name('read');
        Route::delete('/{id}', [AdminNotificationController::class, 'destroy'])
            ->whereNumber('id')
            ->name('destroy');
        Route::delete('/', [AdminNotificationController::class, 'destroyAll'])->name('destroy-all');
    });