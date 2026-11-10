<?php

declare(strict_types=1);

use App\Domains\Catalog\CatalogGroup\Presentation\Http\Controllers\CatalogGroupController;
use Illuminate\Support\Facades\Route;

Route::prefix('catalog-groups')->name('catalog-groups.')->group(function () {
    Route::middleware('cache.headers:public;max_age=60;etag')->group(function () {
        Route::get('/', [CatalogGroupController::class, 'index'])->name('index');
        Route::get('slug/{slug}', [CatalogGroupController::class, 'showBySlug'])->name('show-by-slug');
        Route::get('{id}/categories', [CatalogGroupController::class, 'categories'])->whereNumber('id')->name('categories');
        Route::get('{id}', [CatalogGroupController::class, 'show'])->whereNumber('id')->name('show');
    });

    Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])->group(function () {
        Route::get('manage', [CatalogGroupController::class, 'manage'])->name('manage');
        Route::post('/', [CatalogGroupController::class, 'store'])->name('store');
        Route::put('{id}', [CatalogGroupController::class, 'update'])->whereNumber('id')->name('update');
        Route::delete('{id}', [CatalogGroupController::class, 'destroy'])->whereNumber('id')->name('destroy');
    });
});
