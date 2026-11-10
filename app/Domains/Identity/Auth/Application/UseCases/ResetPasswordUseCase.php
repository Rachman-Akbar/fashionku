<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use Illuminate\Auth\Passwords\PasswordBroker;
use Illuminate\Auth\Passwords\TokenRepositoryInterface;
use Illuminate\Validation\ValidationException;

final class ResetPasswordUseCase
{
    public function __construct(
        private readonly PasswordBroker $broker,
    ) {}

    public function execute(string $email, string $token, string $password): void
    {
        $userClass = $this->broker->getUserModel();

        $user = $userClass::where('email', mb_strtolower(trim($email)))->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak ditemukan.'],
            ]);
        }

        $repository = app(TokenRepositoryInterface::class);
        if (! $repository->exists($user, $token)) {
            throw ValidationException::withMessages([
                'token' => ['Token reset password tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        $user->forceFill([
            'password' => $password,
        ])->save();

        $repository->delete($user);

        $user->tokens()->delete();
    }
}
