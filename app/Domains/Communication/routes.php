<?php

declare(strict_types=1);

use App\Domains\Communication\Chat\Presentation\Http\Controllers\ConversationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email'])
    ->prefix('communication')
    ->name('communication.')
    ->group(function (): void {
        Route::middleware('permission:chat.use')->group(function (): void {
            Route::get('conversations', [ConversationController::class, 'index'])->name('conversations.index');
            Route::post('conversations', [ConversationController::class, 'store'])->name('conversations.store');
            Route::get('conversations/{id}', [ConversationController::class, 'show'])->whereNumber('id')->name('conversations.show');
            Route::post('conversations/{id}/messages', [ConversationController::class, 'send'])->whereNumber('id')->name('conversations.messages.store');
            Route::patch('conversations/{id}/read', [ConversationController::class, 'markRead'])->whereNumber('id')->name('conversations.read');
        });

        Route::post('announcements', [ConversationController::class, 'announce'])
            ->middleware('permission:announcements.manage')
            ->name('announcements.store');
    });
