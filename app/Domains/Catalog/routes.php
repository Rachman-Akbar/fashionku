<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('catalog')->group(function (): void {
    $routeFiles = [
        app_path('Domains/Catalog/CatalogGroup/Presentation/routes.php'),
        app_path('Domains/Catalog/Category/Presentation/routes.php'),
        app_path('Domains/Catalog/Promotion/Presentation/routes.php'),
        app_path('Domains/Catalog/Banner/Presentation/routes.php'),
        app_path('Domains/Catalog/Product/Presentation/routes.php'),
        app_path('Domains/Catalog/Media/Presentation/routes.php'),
    ];

    foreach ($routeFiles as $routeFile) {
        if (file_exists($routeFile)) {
            Route::group([], $routeFile);
        }
    }
});

Route::prefix('seller')->group(function (): void {
    $sellerPromotionRoutes = app_path('Domains/Catalog/Promotion/Presentation/seller-routes.php');

    if (file_exists($sellerPromotionRoutes)) {
        Route::group([], $sellerPromotionRoutes);
    }
});
