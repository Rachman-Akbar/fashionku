<?php

declare(strict_types=1);

use App\Domains\Catalog\Spreadsheet\Presentation\Http\Controllers\SpreadsheetController;
use Illuminate\Support\Facades\Route;

Route::prefix('spreadsheets')->middleware(['auth:sanctum', 'active.user', 'verified.email', 'active.role:seller'])->group(function (): void {
    Route::get('{module}/template', [SpreadsheetController::class, 'template'])->where('module', 'raw-material|product|stock|income|expense');
    Route::post('{module}/export', [SpreadsheetController::class, 'export'])->where('module', 'raw-material|product|stock|income|expense');
    Route::post('{module}/import/preview', [SpreadsheetController::class, 'preview'])->where('module', 'raw-material|product|stock|income|expense');
    Route::post('{module}/import', [SpreadsheetController::class, 'import'])->where('module', 'raw-material|product|stock|income|expense');
    Route::post('{module}/bulk-delete', [SpreadsheetController::class, 'bulkDelete'])->where('module', 'raw-material|product|stock|income|expense');
});
