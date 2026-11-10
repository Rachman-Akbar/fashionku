<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use RuntimeException;

/**
 * Central email verification engine. Issues short-lived 6-digit OTP codes,
 * persists them in the cache, and consumes them on successful verification.
 *
 * The web app mirrors this behaviour through `frontend/src/core/engine/engine.js`,
 * which drives every sensitive flow (change password, add password, forgot
 * password, profile edit) that calls these endpoints.
 */
final class EmailVerificationEngine
{
    private const TTL_SECONDS = 600;

    private const CODE_LENGTH = 6;

    private const CACHE_PREFIX = 'auth.otp.';

    /**
     * Generate and persist a new code for the given email.
     *
     * @return string the plain 6-digit code (only returned so tests and
     *                mailables can render it; it is never exposed via JSON)
     */
    public function issue(string $email): string
    {
        $email = $this->normalizeEmail($email);

        if ($email === '') {
            throw new RuntimeException('Email verifikasi tidak valid.');
        }

        $code = (string) random_int(10 ** (self::CODE_LENGTH - 1), (10 ** self::CODE_LENGTH) - 1);

        Cache::put(
            self::cacheKey($email),
            [
                'code' => $code,
                'email' => $email,
                'expires_at' => now()->addSeconds(self::TTL_SECONDS)->getTimestamp(),
            ],
            now()->addSeconds(self::TTL_SECONDS),
        );

        return $code;
    }

    /**
     * Validate and consume a code. Throws a validation error when the code
     * is missing, wrong, or expired so the HTTP layer can rely on it directly.
     */
    public function verify(string $email, string $code): void
    {
        $email = $this->normalizeEmail($email);
        $payload = Cache::get(self::cacheKey($email));
        $given = trim((string) $code);

        if (! is_array($payload) || ! hash_equals((string) ($payload['code'] ?? ''), $given)) {
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        Cache::forget(self::cacheKey($email));
    }

    public function ttlMinutes(): int
    {
        return (int) round(self::TTL_SECONDS / 60);
    }

    public function codeLength(): int
    {
        return self::CODE_LENGTH;
    }

    private function normalizeEmail(string $email): string
    {
        return mb_strtolower(trim($email));
    }

    private static function cacheKey(string $email): string
    {
        return self::CACHE_PREFIX.hash('sha256', mb_strtolower(trim($email)));
    }
}
