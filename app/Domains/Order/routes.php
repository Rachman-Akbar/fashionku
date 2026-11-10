<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('order')->group(function (): void {
    Route::group([], app_path('Domains/Order/Cart/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Addresses/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Wishlist/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Ordering/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Voucher/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Payment/Presentation/routes.php'));
    Route::group([], app_path('Domains/Order/Review/Presentation/routes.php'));
});
