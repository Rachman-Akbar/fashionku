<?php

declare(strict_types=1);

use App\Domains\Catalog\Category\Presentation\Http\Controllers\CategoryController;
use App\Domains\Catalog\Category\Presentation\Http\Controllers\RelationQuickCreateController;
use Illuminate\Support\Facades\Route;

Route::prefix('relations')->middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin'])->group(function () {
    Route::post('categories/quick-create', [RelationQuickCreateController::class, 'category']);
});

Route::middleware('cache.headers:public;max_age=60;etag')
    ->prefix('categories')
    ->name('categories.')
    ->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('menu', [CategoryController::class, 'menu'])->name('menu');
        Route::get('path/{path}/products', [CategoryController::class, 'productsByPath'])->where('path', '.*')->name('products-by-path');
        Route::get('path/{path}', [CategoryController::class, 'showByPath'])->where('path', '.*')->name('show-by-path');
        Route::get('{id}', [CategoryController::class, 'show'])->whereNumber('id')->name('show');
    });

Route::prefix('categories')->middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])->group(function () {
    Route::get('manage', [CategoryController::class, 'manage'])->name('categories.manage');
    Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('{id}', [CategoryController::class, 'update'])->whereNumber('id')->name('categories.update');
    Route::delete('{id}', [CategoryController::class, 'destroy'])->whereNumber('id')->name('categories.destroy');
});
