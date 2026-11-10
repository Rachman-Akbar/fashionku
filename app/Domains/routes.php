<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::group([], app_path('Domains/Identity/routes.php'));
Route::group([], app_path('Domains/Catalog/routes.php'));
Route::group([], app_path('Domains/Seller/routes.php'));
Route::group([], app_path('Domains/Order/routes.php'));
Route::group([], app_path('Domains/Support/routes.php'));
Route::group([], app_path('Domains/Finance/Commission/Presentation/routes.php'));
Route::group([], app_path('Domains/Shared/Codes/Presentation/routes.php'));
