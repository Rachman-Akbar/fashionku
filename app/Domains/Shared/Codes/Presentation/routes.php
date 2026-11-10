<?php

declare(strict_types=1);

use App\Domains\Shared\Codes\Presentation\Http\Controllers\CodePatternController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin'])
    ->prefix('shared/code-patterns')
    ->group(function (): void {
        Route::get('/', [CodePatternController::class, 'index']);
        Route::put('/', [CodePatternController::class, 'update']);
        Route::post('preview', [CodePatternController::class, 'preview']);
    });
