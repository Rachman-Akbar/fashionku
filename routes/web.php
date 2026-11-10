<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Semua request web dilayani oleh React SPA (Single Page Application).
| React Router menangani navigasi di sisi client.
| Route /api/* tetap ditangani oleh routes/api.php (backend Laravel).
|--------------------------------------------------------------------------
*/

// Test/debug routes (bisa dihapus di production)
Route::view('/test-firebase-login', 'login-firebase');
Route::view('/test-map', 'test-address');
Route::view('/test-checkout', 'checkout-test')->name('checkout.test');

// Catch-all: semua route selain /api/* dan test routes dilayani React SPA
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|test-).*$');
