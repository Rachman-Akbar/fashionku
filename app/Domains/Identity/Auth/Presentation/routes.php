<?php

declare(strict_types=1);

use App\Domains\Identity\Auth\Infrastructure\Middleware\ValidateFirebaseToken;
use App\Domains\Identity\Auth\Presentation\Http\Controllers\AuthController;
use App\Domains\Seller\Stores\Presentation\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function (): void {
    // Registration
    Route::post('/password-register', [AuthController::class, 'passwordRegister'])
        ->middleware('throttle:10,1')
        ->name('password-register');
    Route::post('/register-with-otp', [AuthController::class, 'registerWithOtp'])
        ->middleware('throttle:5,1')
        ->name('register-with-otp');
    Route::post('/verify-registration-otp', [AuthController::class, 'verifyRegistrationOtp'])
        ->middleware('throttle:10,1')
        ->name('verify-registration-otp');
    Route::post('/resend-registration-otp', [AuthController::class, 'resendRegistrationOtp'])
        ->middleware('throttle:3,1')
        ->name('resend-registration-otp');

    // Login (2-step with OTP)
    Route::post('/password-login', [AuthController::class, 'passwordLogin'])
        ->middleware('throttle:15,1')
        ->name('password-login');
    Route::post('/password-login/verify', [AuthController::class, 'verifyPasswordLogin'])
        ->middleware('throttle:15,1')
        ->name('password-login.verify');
    Route::post('/password-login/resend', [AuthController::class, 'resendPasswordLogin'])
        ->middleware('throttle:5,1')
        ->name('password-login.resend');

    Route::post('/firebase-login', [AuthController::class, 'firebaseLogin'])
        ->middleware([ValidateFirebaseToken::class, 'throttle:10,1'])
        ->name('firebase-login');
    Route::post('/firebase-login/verify', [AuthController::class, 'verifyFirebaseLogin'])
        ->middleware('throttle:15,1')
        ->name('firebase-login.verify');
    Route::post('/firebase-login/resend', [AuthController::class, 'resendFirebaseLogin'])
        ->middleware('throttle:5,1')
        ->name('firebase-login.resend');

    // Password Reset
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:5,1')
        ->name('forgot-password');
    Route::post('/send-password-reset-code', [AuthController::class, 'sendPasswordResetCode'])
        ->middleware('throttle:5,1')
        ->name('send-password-reset-code');
    Route::post('/verify-email-code', [AuthController::class, 'verifyEmailCode'])
        ->middleware('throttle:10,1')
        ->name('verify-email-code');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:5,1')
        ->name('reset-password');
    Route::post('/reset-password-with-code', [AuthController::class, 'resetPasswordWithCode'])
        ->middleware('throttle:5,1')
        ->name('reset-password-with-code');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logoutCurrentDevice'])->name('logout');
        Route::post('/logout-other-devices', [AuthController::class, 'logoutOtherDevices'])->name('logout-other-devices');
        Route::post('/logout-all-devices', [AuthController::class, 'logoutAllDevices'])->name('logout-all-devices');

        Route::middleware('active.user')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('/switch-role', [AuthController::class, 'switchRole'])->name('switch-role');
            Route::post('/register-seller', [StoreController::class, 'registerStore'])
                ->middleware('verified.email')
                ->name('register-seller');
            Route::post('/change-password', [AuthController::class, 'changePassword'])
                ->middleware('throttle:3,1')
                ->name('change-password');
            Route::post('/send-verification-code', [AuthController::class, 'sendVerificationCode'])
                ->middleware('throttle:5,1')
                ->name('send-verification-code');

            // Device Management
            Route::prefix('devices')->name('devices.')->group(function (): void {
                Route::get('/', [AuthController::class, 'getDevices'])->name('index');
                Route::post('/{device_id}/request-removal-otp', [AuthController::class, 'requestDeviceRemovalOtp'])
                    ->middleware('throttle:5,1')
                    ->name('request-removal-otp');
                Route::delete('/{device_id}', [AuthController::class, 'removeDevice'])
                    ->middleware('throttle:5,1')
                    ->name('remove');
            });

            // Account Deletion
            Route::prefix('account')->name('account.')->group(function (): void {
                Route::post('/request-deletion-otp', [AuthController::class, 'requestAccountDeletionOtp'])
                    ->middleware('throttle:3,1')
                    ->name('request-deletion-otp');
                Route::delete('/', [AuthController::class, 'deleteAccount'])
                    ->middleware('throttle:3,1')
                    ->name('delete');
                Route::post('/resend-deletion-otp', [AuthController::class, 'resendAccountDeletionOtp'])
                    ->middleware('throttle:3,1')
                    ->name('resend-deletion-otp');
            });
        });
    });
});
