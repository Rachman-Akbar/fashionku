<?php

declare(strict_types=1);

use App\Domains\Catalog\Media\Presentation\Http\Controllers\MediaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:buyer,seller,admin'])
    ->prefix('media')
    ->name('catalog.media.')
    ->group(function (): void {
        Route::post('/images', [MediaController::class, 'storeImage'])->name('images.store');
    });
