<?php

declare(strict_types=1);

use App\Domains\Shared\Excel\Presentation\Http\Controllers\ExcelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller,admin'])
    ->prefix('excel')
    ->name('excel.')
    ->group(function (): void {
        Route::get('{module}/template', [ExcelController::class, 'template'])
            ->where('module', 'product|category|raw-material|customer|stock|sales|finance|user|voucher|promotion')
            ->name('template');

        Route::post('{module}/export', [ExcelController::class, 'export'])
            ->where('module', 'product|category|raw-material|customer|stock|sales|finance|user|voucher|promotion')
            ->name('export');

        Route::post('{module}/import/preview', [ExcelController::class, 'preview'])
            ->where('module', 'product|category|raw-material|customer|stock|sales|finance|user|voucher|promotion')
            ->name('import.preview');

        Route::post('{module}/import', [ExcelController::class, 'import'])
            ->where('module', 'product|category|raw-material|customer|stock|sales|finance|user|voucher|promotion')
            ->name('import');

        Route::post('{module}/bulk-delete', [ExcelController::class, 'bulkDelete'])
            ->where('module', 'product|category|raw-material|customer|stock|sales|finance|user|voucher|promotion')
            ->name('bulk-delete');
    });