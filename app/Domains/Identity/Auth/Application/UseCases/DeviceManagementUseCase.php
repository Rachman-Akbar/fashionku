<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\UserDevice;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories\EloquentUserDeviceRepository;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

final readonly class DeviceManagementUseCase
{
    public function __construct(
        private EloquentUserDeviceRepository $deviceRepository,
        private OtpSecurityEngine $otpEngine,
        private UserRepositoryInterface $userRepository,
    ) {}

    public function getDevices(User $user): array
    {
        $devices = $this->deviceRepository->getAllDevicesByUserId((string) $user->id);

        return $devices->map(function ($device): array {
            return [
                'id' => $device->id,
                'device_name' => $device->device_name,
                'device_type' => $device->device_type,
                'browser' => $device->browser,
                'browser_version' => $device->browser_version,
                'os' => $device->os,
                'os_version' => $device->os_version,
                'ip_address' => $device->ip_address,
                'last_active_at' => $device->last_active_at?->toISOString(),
                'expires_at' => $device->expires_at?->toISOString(),
                'status' => $device->status,
                'is_current' => $this->isCurrentDevice($user, $device),
                'created_at' => $device->created_at->toISOString(),
            ];
        })->toArray();
    }

    public function requestDeviceRemovalOtp(User $user, string $deviceId, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        $device = $this->deviceRepository->findByUserIdAndId((string) $user->id, $deviceId);

        if (! $device) {
            throw ValidationException::withMessages([
                'device_id' => ['Perangkat tidak ditemukan.'],
            ]);
        }

        if (! $device->isActive()) {
            throw ValidationException::withMessages([
                'device_id' => ['Perangkat tidak aktif atau sudah dihapus.'],
            ]);
        }

        $code = $this->otpEngine->issue(
            email: $user->email,
            purpose: OtpPurpose::REMOVE_DEVICE->value,
            userId: (string) $user->id,
            challengeId: $deviceId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            metadata: [
                'device_id' => $deviceId,
                'device_name' => $device->device_name,
            ],
        );

        try {
            Mail::to($user->email)->send(new EmailVerificationMail($code, $this->otpEngine->ttlMinutes()));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim OTP hapus perangkat.', [
                'user_id' => $user->id,
                'device_id' => $deviceId,
                'exception' => $throwable,
            ]);
            throw new \RuntimeException('Gagal mengirim kode verifikasi. Silakan coba lagi.');
        }

        return [
            'message' => 'Kode verifikasi telah dikirim ke email Anda.',
            'device_id' => $deviceId,
            'expires_in_minutes' => $this->otpEngine->ttlMinutes(),
            'code_length' => $this->otpEngine->codeLength(),
        ];
    }

    public function removeDevice(User $user, string $deviceId, string $code, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        $device = $this->deviceRepository->findByUserIdAndId((string) $user->id, $deviceId);

        if (! $device) {
            throw ValidationException::withMessages([
                'device_id' => ['Perangkat tidak ditemukan.'],
            ]);
        }

        if (! $device->isActive()) {
            throw ValidationException::withMessages([
                'device_id' => ['Perangkat tidak aktif atau sudah dihapus.'],
            ]);
        }

        $this->otpEngine->verifyAndConsume(
            email: $user->email,
            purpose: OtpPurpose::REMOVE_DEVICE->value,
            code: $code,
            challengeId: $deviceId,
            userId: (string) $user->id,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
        );

        DB::transaction(function () use ($user, $device): void {
            if ($device->sanctum_token_id) {
                $token = PersonalAccessToken::findToken($device->sanctum_token_id);
                if ($token) {
                    $token->delete();
                }
            }

            $this->deviceRepository->revokeDevice($device->id);
        });

        return [
            'message' => 'Perangkat berhasil dihapus dan sesi telah dicabut.',
            'device_id' => $deviceId,
        ];
    }

    public function logoutCurrentDevice(User $user): void
    {
        $currentToken = $user->currentAccessToken();
        if ($currentToken instanceof PersonalAccessToken) {
            $device = $this->deviceRepository->findBySanctumTokenId((string) $currentToken->id);
            if ($device) {
                $this->deviceRepository->revokeDevice($device->id);
            }
            $currentToken->delete();
        }
    }

    public function logoutOtherDevices(User $user): int
    {
        $currentToken = $user->currentAccessToken();
        $currentTokenId = $currentToken instanceof PersonalAccessToken ? (string) $currentToken->id : null;

        return $this->deviceRepository->revokeAllForUser((string) $user->id, $currentTokenId);
    }

    public function logoutAllDevices(User $user): int
    {
        return $this->deviceRepository->revokeAllForUser((string) $user->id);
    }

    public function registerDevice(
        User $user,
        string $tokenId,
        string $tokenName,
        ?string $deviceName = null,
        ?string $deviceType = null,
        ?string $browser = null,
        ?string $browserVersion = null,
        ?string $os = null,
        ?string $osVersion = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): UserDevice {
        $parsed = $this->parseUserAgent($userAgent ?? '');

        return $this->deviceRepository->create([
            'id' => (string) Str::uuid(),
            'user_id' => (string) $user->id,
            'device_name' => $deviceName ?? $this->generateDeviceName($parsed),
            'device_type' => $deviceType ?? $parsed['device_type'],
            'browser' => $browser ?? $parsed['browser'],
            'browser_version' => $browserVersion ?? $parsed['browser_version'],
            'os' => $os ?? $parsed['os'],
            'os_version' => $osVersion ?? $parsed['os_version'],
            'ip_address' => $ipAddress,
            'sanctum_token_id' => $tokenId,
            'sanctum_token_name' => $tokenName,
            'last_active_at' => now(),
            'expires_at' => now()->addDays(30),
            'status' => 'active',
            'metadata' => json_encode([
                'user_agent' => $userAgent,
                'registered_at' => now()->toISOString(),
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function updateDeviceActivity(string $deviceId): void
    {
        $this->deviceRepository->updateLastActive($deviceId);
    }

    public function cleanupExpiredDevices(): int
    {
        return $this->deviceRepository->cleanupExpiredDevices();
    }

    private function isCurrentDevice(User $user, UserDevice $device): bool
    {
        $currentToken = $user->currentAccessToken();
        if (! $currentToken instanceof PersonalAccessToken) {
            return false;
        }

        return $device->sanctum_token_id === (string) $currentToken->id;
    }

    private function parseUserAgent(string $userAgent): array
    {
        $browser = 'Unknown';
        $browserVersion = 'Unknown';
        $os = 'Unknown';
        $osVersion = 'Unknown';
        $deviceType = 'Unknown';

        if (str_contains($userAgent, 'Mobile')) {
            $deviceType = 'Mobile';
        } elseif (str_contains($userAgent, 'Tablet')) {
            $deviceType = 'Tablet';
        } else {
            $deviceType = 'Desktop';
        }

        if (preg_match('/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/i', $userAgent, $matches)) {
            $browser = $matches[1];
            $browserVersion = $matches[2];
        }

        if (preg_match('/(Windows NT|Macintosh|Linux|Android|iOS|iPhone|iPad)/i', $userAgent, $matches)) {
            $os = $matches[1];
        }

        return [
            'device_type' => $deviceType,
            'browser' => $browser,
            'browser_version' => $browserVersion,
            'os' => $os,
            'os_version' => $osVersion,
        ];
    }

    private function generateDeviceName(array $parsed): string
    {
        $parts = [];
        if ($parsed['device_type'] !== 'Unknown') {
            $parts[] = $parsed['device_type'];
        }
        if ($parsed['browser'] !== 'Unknown') {
            $parts[] = $parsed['browser'];
        }
        if ($parsed['os'] !== 'Unknown') {
            $parts[] = $parsed['os'];
        }

        return implode(' - ', $parts) ?: 'Perangkat Tidak Dikenal';
    }
}