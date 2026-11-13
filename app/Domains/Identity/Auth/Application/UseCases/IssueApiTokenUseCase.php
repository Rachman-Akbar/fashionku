<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\UseCases\DeviceManagementUseCase;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

final class IssueApiTokenUseCase
{
    public function __construct(
        private DeviceManagementUseCase $deviceManagement,
    ) {}

    /**
     * @param  bool  $revokeExistingSessions  Ketika true, seluruh token dan
     *                                        perangkat aktif milik user dicabut
     *                                        sebelum token baru diterbitkan
     *                                        (single active session policy).
     */
    public function execute(
        User $user,
        ?string $deviceName = null,
        string $activeRole = 'buyer',
        bool $revokeExistingSessions = false,
    ): string {
        $activeRole = strtolower(trim($activeRole));

        if ($activeRole === '') {
            $activeRole = 'buyer';
        }

        if ($revokeExistingSessions) {
            $this->revokeExistingSessions($user);
        }

        $tokenName = $deviceName;

        if (! is_string($tokenName) || trim($tokenName) === '') {
            $tokenName = 'marketplace-api-'.Str::lower(Str::random(8));
        }

        $token = $user->createToken($tokenName, [
            'access-api',
            "active-role:{$activeRole}",
        ]);

        // Register device
        $request = Request::capture();
        $this->deviceManagement->registerDevice(
            user: $user,
            tokenId: (string) $token->accessToken->id,
            tokenName: $tokenName,
            deviceName: $deviceName,
            ipAddress: $request?->ip(),
            userAgent: $request?->userAgent(),
        );

        return $token->plainTextToken;
    }

    /**
     * Force logout seluruh sesi lama: hapus token Sanctum dan tandai semua
     * perangkat sebagai revoked. Dipanggil hanya setelah autentikasi kedua
     * (OTP) berhasil, sehingga penyerang tidak bisa memicu logout massal
     * hanya dengan menebak password.
     */
    private function revokeExistingSessions(User $user): void
    {
        DB::transaction(function () use ($user): void {
            $tokenIds = $user->tokens()->pluck('id')->all();

            if ($tokenIds !== []) {
                PersonalAccessToken::query()->whereIn('id', $tokenIds)->delete();
            }

            $this->deviceManagement->logoutAllDevices($user);
        });
    }
}
