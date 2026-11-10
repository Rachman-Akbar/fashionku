<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\Auth\Application\Services\EmailVerificationEngine;
use App\Domains\Identity\Auth\Infrastructure\Mail\PasswordChangedMail;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

final class ResetPasswordWithCodeUseCase
{
    public function __construct(
        private readonly EmailVerificationEngine $engine,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(string $email, string $code, string $password): void
    {
        $this->engine->verify($email, $code);

        $user = $this->userRepository->findAnyByEmail($email);

        if ($user === null) {
            throw ValidationException::withMessages([
                'email' => ['Akun dengan email tersebut tidak ditemukan.'],
            ]);
        }

        $user->forceFill([
            'password' => $password,
            'is_email_verified' => true,
            'has_set_password' => true,
        ])->save();

        $user->tokens()->delete();

        try {
            Mail::to($user->email)->send(new PasswordChangedMail($user->name));
        } catch (\Throwable $throwable) {
            Log::error('Gagal mengirim notifikasi password berhasil di-reset.', [
                'email' => $user->email,
                'exception' => $throwable,
            ]);
        }
    }
}
