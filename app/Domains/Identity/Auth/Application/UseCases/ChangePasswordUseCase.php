<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\EmailVerificationEngine;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class ChangePasswordUseCase
{
    public function __construct(
        private readonly EmailVerificationEngine $engine,
    ) {}

    public function execute(
        User $user,
        string $currentPassword,
        string $newPassword,
        string $verificationCode,
    ): void {
        $this->engine->verify((string) $user->email, $verificationCode);

        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]);
        }

        if ($currentPassword === $newPassword) {
            throw ValidationException::withMessages([
                'new_password' => ['Password baru tidak boleh sama dengan password saat ini.'],
            ]);
        }

        $user->forceFill([
            'password' => $newPassword,
            'has_set_password' => true,
        ])->save();

        $user->tokens()->delete();
    }
}
