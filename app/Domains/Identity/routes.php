<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('identity')->group(function (): void {
    Route::group([], app_path('Domains/Identity/Auth/Presentation/routes.php'));
    Route::group([], app_path('Domains/Identity/User/Presentation/routes.php'));
});
