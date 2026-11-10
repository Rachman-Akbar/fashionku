<?php

declare(strict_types=1);

use App\Domains\Order\Review\Presentation\Http\Controllers\ProductReviewController;
use Illuminate\Support\Facades\Route;

Route::get('products/{productId}/reviews', [ProductReviewController::class, 'publicIndex'])->whereNumber('productId');

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'permission:reviews.create,reviews.manage'])
    ->prefix('reviews')
    ->group(function (): void {
        Route::get('/', [ProductReviewController::class, 'index']);
        Route::post('/', [ProductReviewController::class, 'store']);
        Route::put('{id}', [ProductReviewController::class, 'update'])->whereNumber('id');
        Route::delete('{id}', [ProductReviewController::class, 'destroy'])->whereNumber('id');
    });
