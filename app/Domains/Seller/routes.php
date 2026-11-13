<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('seller')->group(function (): void {
    $routeFiles = [
        app_path('Domains/Seller/Stores/Presentation/routes.php'),
        app_path('Domains/Seller/Stock/Presentation/routes.php'),
        app_path('Domains/Seller/Inventory/Presentation/routes.php'),
        app_path('Domains/Seller/Schedule/Presentation/routes.php'),
        app_path('Domains/Seller/Customers/Presentation/routes.php'),
        app_path('Domains/Seller/Finance/Presentation/routes.php'),
    ];

    foreach ($routeFiles as $routeFile) {
        if (file_exists($routeFile)) {
            Route::group([], $routeFile);
        }
    }
});
