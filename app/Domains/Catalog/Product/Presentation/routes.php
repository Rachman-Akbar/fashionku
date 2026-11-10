<?php

declare(strict_types=1);

use App\Domains\Catalog\Product\Costing\Presentation\Http\Controllers\ProductCostingController;
use App\Domains\Catalog\Product\Presentation\Http\Controllers\ProductAttributeController;
use App\Domains\Catalog\Product\Presentation\Http\Controllers\ProductController;
use App\Domains\Catalog\Product\Presentation\Http\Controllers\ProductVariantController;
use Illuminate\Support\Facades\Route;

Route::middleware('cache.headers:public;max_age=60;etag')
    ->prefix('products')
    ->name('products.')
    ->group(function (): void {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/slug/{slug}', [ProductController::class, 'showBySlug'])->name('show-by-slug');
        Route::get('/{id}', [ProductController::class, 'show'])->whereNumber('id')->name('show');
        Route::get('/{productId}/variants', [ProductVariantController::class, 'publicIndex'])
            ->whereNumber('productId')
            ->name('variants.public-index');
    });

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'role:seller,admin'])
    ->prefix('products/attributes')
    ->name('product-attributes.')
    ->group(function (): void {
        Route::get('/', [ProductAttributeController::class, 'index'])->name('index');
        Route::post('/', [ProductAttributeController::class, 'store'])->name('store');
        Route::get('/{id}', [ProductAttributeController::class, 'show'])->whereNumber('id')->name('show');
        Route::put('/{id}', [ProductAttributeController::class, 'update'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [ProductAttributeController::class, 'destroy'])->whereNumber('id')->name('destroy');
    });

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller', 'seller.store.available'])
    ->prefix('seller/products')
    ->name('seller.products.')
    ->group(function (): void {
        Route::get('/', [ProductController::class, 'sellerIndex'])->name('index');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::put('/{id}', [ProductController::class, 'update'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [ProductController::class, 'destroy'])->whereNumber('id')->name('destroy');
        Route::get('/{productId}/variants', [ProductVariantController::class, 'index'])->whereNumber('productId')->name('variants.index');
        Route::post('/{productId}/variants', [ProductVariantController::class, 'store'])->whereNumber('productId')->name('variants.store');
        Route::get('/{productId}/variants/{variantId}', [ProductVariantController::class, 'show'])->whereNumber('productId')->whereNumber('variantId')->name('variants.show');
        Route::put('/{productId}/variants/{variantId}', [ProductVariantController::class, 'update'])->whereNumber('productId')->whereNumber('variantId')->name('variants.update');
        Route::delete('/{productId}/variants/{variantId}', [ProductVariantController::class, 'destroy'])->whereNumber('productId')->whereNumber('variantId')->name('variants.destroy');
        Route::get('/{productId}/costing', [ProductCostingController::class, 'show'])->whereNumber('productId')->name('costing.show');
        Route::put('/{productId}/costing', [ProductCostingController::class, 'update'])->whereNumber('productId')->name('costing.update');
    });

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:admin'])
    ->prefix('admin/products')
    ->name('admin.products.')
    ->group(function (): void {
        Route::get('/', [ProductController::class, 'adminIndex'])->name('index');
        Route::post('/', [ProductController::class, 'adminStore'])->name('store');
        Route::put('/{id}', [ProductController::class, 'adminUpdate'])->whereNumber('id')->name('update');
        Route::delete('/{id}', [ProductController::class, 'adminDestroy'])->whereNumber('id')->name('destroy');
        Route::get('/{productId}/costing', [ProductCostingController::class, 'show'])->whereNumber('productId')->name('costing.show');
        Route::put('/{productId}/costing', [ProductCostingController::class, 'update'])->whereNumber('productId')->name('costing.update');
    });
