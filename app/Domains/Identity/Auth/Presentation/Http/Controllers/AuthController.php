<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Presentation\Http\Controllers;

use App\Domains\Identity\Auth\Application\Services\EmailVerificationEngine;
use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Application\UseCases\AccountDeletionUseCase;
use App\Domains\Identity\Auth\Application\UseCases\BuildAuthPayloadUseCase;
use App\Domains\Identity\Auth\Application\UseCases\ChangePasswordUseCase;
use App\Domains\Identity\Auth\Application\UseCases\DeviceManagementUseCase;
use App\Domains\Identity\Auth\Application\UseCases\LoginUserUseCase;
use App\Domains\Identity\Auth\Application\UseCases\LoginWithFirebaseUseCase;
use App\Domains\Identity\Auth\Application\UseCases\LogoutUserUseCase;
use App\Domains\Identity\Auth\Application\UseCases\RegisterUserUseCase;
use App\Domains\Identity\Auth\Application\UseCases\RegisterUserWithOtpUseCase;
use App\Domains\Identity\Auth\Application\UseCases\ResetPasswordUseCase;
use App\Domains\Identity\Auth\Application\UseCases\ResetPasswordWithCodeUseCase;
use App\Domains\Identity\Auth\Application\UseCases\SwitchRoleUseCase;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\Auth\Infrastructure\Mail\PasswordChangedMail;
use App\Domains\Identity\Auth\Infrastructure\Mail\PasswordResetMail;
use App\Domains\Identity\Auth\Presentation\Http\Requests\ChangePasswordRequest;
use App\Domains\Identity\Auth\Presentation\Http\Requests\OtpRequest;
use App\Domains\Identity\Auth\Presentation\Http\Requests\RegisterWithOtpRequest;
use App\Domains\Identity\Auth\Presentation\Http\Requests\ResetPasswordRequest;
use App\Domains\Identity\User\Application\UseCases\DeleteUserUseCase;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Passwords\TokenRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

final class AuthController extends Controller
{
    public function passwordRegister(Request $request, RegisterUserUseCase $useCase): JsonResponse
    {
        $request->merge([
            'email' => Str::lower(trim((string) $request->input('email'))),
        ]);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        try {
            return response()->json($useCase->execute(
                name: $validated['name'],
                email: $validated['email'],
                password: $validated['password'],
                deviceName: $validated['device_name'] ?? 'marketplace-web'
            ), 201);
        } catch (EmailAlreadyExistsException $exception) {
            throw ValidationException::withMessages([
                'email' => [$exception->getMessage()],
            ]);
        }
    }

    public function registerWithOtp(RegisterWithOtpRequest $request, RegisterUserWithOtpUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->initiate(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'],
            phone: $validated['phone'] ?? null,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result, 202);
    }

    public function verifyRegistrationOtp(OtpRequest $request, RegisterUserWithOtpUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->verifyAndComplete(
            challengeId: $validated['challenge_id'],
            code: $validated['code'],
            deviceName: $validated['device_name'] ?? 'marketplace-web',
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }

    public function resendRegistrationOtp(OtpRequest $request, RegisterUserWithOtpUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->resendOtp(
            challengeId: $validated['challenge_id'],
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }

    public function passwordLogin(Request $request, LoginUserUseCase $useCase): JsonResponse
    {
        $request->merge([
            'email' => Str::lower(trim((string) $request->input('email'))),
        ]);
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['nullable', 'string', 'in:buyer,seller,admin'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json($useCase->execute(
            email: $validated['email'],
            password: $validated['password'],
            deviceName: $validated['device_name'] ?? 'marketplace-web',
            requestedRole: $validated['role'] ?? 'buyer'
        ));
    }

    public function firebaseLogin(Request $request, LoginWithFirebaseUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['nullable', 'string', 'in:buyer,seller,admin'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);
        $firebaseUser = $request->attributes->get('firebase_user');

        if (! is_array($firebaseUser)) {
            return response()->json(['message' => 'Firebase user payload is missing.'], 401);
        }

        return response()->json($useCase->execute(
            firebaseUser: $firebaseUser,
            deviceName: $validated['device_name'] ?? 'marketplace-web',
            requestedRole: $validated['role'] ?? 'buyer'
        ));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = mb_strtolower(trim($validated['email']));

        $userClass = config('auth.providers.users.model');
        $user = $userClass::where('email', $email)->first();

        if ($user) {
            $tokenRepository = app(TokenRepositoryInterface::class);
            $rawToken = $tokenRepository->create($user);

            $resetUrl = env('FRONTEND_URL', config('app.url'))
                .'/auth/reset-password?token='.$rawToken.'&email='.urlencode($email);

            try {
                Mail::to($user->email)->send(new PasswordResetMail($resetUrl));
            } catch (\Throwable $throwable) {
                Log::error('Gagal mengirim email reset password.', [
                    'email' => $user->email,
                    'exception' => $throwable,
                ]);
            }
        }

        // Always return the same message to prevent email enumeration
        return response()->json([
            'message' => 'Jika email terdaftar, link reset password akan dikirim dalam beberapa menit.',
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();

        $useCase->execute(
            email: $validated['email'],
            token: $validated['token'],
            password: $validated['password'],
        );

        return response()->json([
            'message' => 'Password berhasil diubah. Silakan masuk dengan password baru.',
        ]);
    }

    public function sendVerificationCode(Request $request, EmailVerificationEngine $engine): JsonResponse
    {
        $email = (string) $request->user()->email;
        $code = $engine->issue($email);

        try {
            Mail::to($email)->send(new EmailVerificationMail($code, $engine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim kode verifikasi email.', [
                'email' => $email,
                'exception' => $throwable,
            ]);

            return response()->json([
                'message' => 'Kode verifikasi gagal dikirim. Periksa kembali konfigurasi email pada server.',
            ], 500);
        }

        return response()->json([
            'message' => 'Kode verifikasi telah dikirim ke email Anda.',
            'expires_in_minutes' => $engine->ttlMinutes(),
        ]);
    }

    public function sendPasswordResetCode(Request $request, EmailVerificationEngine $engine): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = mb_strtolower(trim($validated['email']));

        $userClass = config('auth.providers.users.model');
        $user = $userClass::where('email', $email)->first();

        if ($user) {
            $code = $engine->issue($email);

            try {
                Mail::to($email)->send(new EmailVerificationMail($code, $engine->ttlMinutes()));
            } catch (\Throwable $throwable) {
                Log::error('Gagal mengirim kode reset password.', [
                    'email' => $email,
                    'exception' => $throwable,
                ]);
            }
        }

        // Always return the same message to prevent email enumeration
        return response()->json([
            'message' => 'Jika email terdaftar, kode verifikasi 6 digit akan dikirim dalam beberapa menit.',
        ]);
    }

    public function verifyEmailCode(Request $request, EmailVerificationEngine $engine): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'digits:6'],
        ]);

        $email = mb_strtolower(trim($validated['email']));

        $engine->verify($email, $validated['code']);

        $userClass = config('auth.providers.users.model');
        $user = $userClass::where('email', $email)->first();

        if ($user && ! (bool) $user->is_email_verified) {
            $user->forceFill(['is_email_verified' => true])->save();
        }

        return response()->json([
            'message' => 'Email berhasil diverifikasi.',
        ]);
    }

    public function resetPasswordWithCode(Request $request, ResetPasswordWithCodeUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'digits:6'],
            'password' => ['required', 'string', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()],
        ]);

        $useCase->execute(
            email: mb_strtolower(trim($validated['email'])),
            code: $validated['code'],
            password: $validated['password'],
        );

        return response()->json([
            'message' => 'Password berhasil diubah. Silakan masuk dengan password baru.',
        ]);
    }

    public function changePassword(ChangePasswordRequest $request, ChangePasswordUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();

        $useCase->execute(
            user: $request->user(),
            currentPassword: $validated['current_password'],
            newPassword: $validated['new_password'],
            verificationCode: $validated['verification_code'],
        );

        try {
            Mail::to($request->user()->email)->send(new PasswordChangedMail($request->user()->name));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim notifikasi password berubah.', [
                'email' => $request->user()->email,
                'exception' => $throwable,
            ]);
        }

        return response()->json([
            'message' => 'Password berhasil diubah. Semua sesi login lain telah logout.',
        ]);
    }

    public function me(Request $request, BuildAuthPayloadUseCase $payload): JsonResponse
    {
        return response()->json($payload->execute($request->user()));
    }

    public function logoutCurrentDevice(Request $request, LogoutUserUseCase $useCase): JsonResponse
    {
        $useCase->execute($request->user(), 'current');

        return response()->json(['message' => 'Logged out from current device.']);
    }

    public function logoutOtherDevices(Request $request, LogoutUserUseCase $useCase): JsonResponse
    {
        $deletedCount = $useCase->execute($request->user(), 'other');

        return response()->json([
            'message' => 'Other devices logged out.',
            'deleted_tokens' => $deletedCount,
        ]);
    }

    public function logoutAllDevices(Request $request, LogoutUserUseCase $useCase): JsonResponse
    {
        $deletedCount = $useCase->execute($request->user(), 'all');

        return response()->json([
            'message' => 'Logged out from all devices.',
            'deleted_tokens' => $deletedCount,
        ]);
    }

    public function switchRole(Request $request, SwitchRoleUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:buyer,seller,admin'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json($useCase->execute(
            user: $request->user(),
            targetRole: $validated['role'],
            deviceName: $validated['device_name'] ?? 'marketplace-web'
        ));
    }

    public function deleteCurrentAccount(Request $request, DeleteUserUseCase $useCase): JsonResponse
    {
        $userId = (string) $request->user()->id;
        $request->user()->tokens()->delete();
        $useCase->execute($userId);

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }

    // Device Management Endpoints
    public function getDevices(Request $request, DeviceManagementUseCase $useCase): JsonResponse
    {
        $devices = $useCase->getDevices($request->user());

        return response()->json([
            'devices' => $devices,
        ]);
    }

    public function requestDeviceRemovalOtp(Request $request, DeviceManagementUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'device_id' => ['required', 'string', 'uuid'],
        ]);
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->requestDeviceRemovalOtp(
            user: $request->user(),
            deviceId: $validated['device_id'],
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }

    public function removeDevice(Request $request, DeviceManagementUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'device_id' => ['required', 'string', 'uuid'],
            'code' => ['required', 'string', 'digits:6'],
        ]);
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->removeDevice(
            user: $request->user(),
            deviceId: $validated['device_id'],
            code: $validated['code'],
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }

    // Account Deletion Endpoints
    public function requestAccountDeletionOtp(Request $request, AccountDeletionUseCase $useCase): JsonResponse
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->requestDeletionOtp(
            user: $request->user(),
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }

    public function deleteAccount(Request $request, AccountDeletionUseCase $useCase): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'digits:6'],
        ]);
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->deleteAccount(
            user: $request->user(),
            code: $validated['code'],
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        // Clear session after successful deletion
        $request->user()->tokens()->delete();

        return response()->json($result);
    }

    public function resendAccountDeletionOtp(Request $request, AccountDeletionUseCase $useCase): JsonResponse
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $useCase->resendDeletionOtp(
            user: $request->user(),
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        return response()->json($result);
    }
}