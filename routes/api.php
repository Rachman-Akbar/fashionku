<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Route Registration
|--------------------------------------------------------------------------
*/

$domainRouteFiles = [
    app_path('Domains/routes.php'),
];

Route::get('/', function () {
    return response()->json([
        'message' => 'UKOMP API is running.',
        'version_prefix' => '/api/v1',
    ]);
});

Route::prefix('v1')->group(function () use ($domainRouteFiles): void {
    foreach ($domainRouteFiles as $routeFile) {
        if (file_exists($routeFile)) {
            require $routeFile;
        }
    }
});
