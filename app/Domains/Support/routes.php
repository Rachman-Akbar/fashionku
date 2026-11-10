<?php

declare(strict_types=1);

use App\Domains\Support\Ticket\Presentation\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'permission:tickets.create,tickets.manage'])
    ->prefix('support/tickets')
    ->group(function (): void {
        Route::get('/', [TicketController::class, 'index']);
        Route::get('context', [TicketController::class, 'context']);
        Route::post('/', [TicketController::class, 'store']);
        Route::get('{id}', [TicketController::class, 'show'])->whereNumber('id');
        Route::patch('{id}/status', [TicketController::class, 'updateStatus'])->whereNumber('id');
        Route::post('{id}/replies', [TicketController::class, 'reply'])->whereNumber('id');
        Route::delete('{id}', [TicketController::class, 'destroy'])->whereNumber('id');
    });
