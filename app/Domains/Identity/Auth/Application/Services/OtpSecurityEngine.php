<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\Services;

use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

final class OtpSecurityEngine
{
    public const CODE_LENGTH = 6;
    public const DEFAULT_TTL_SECONDS = 300;
    public const MAX_ATTEMPTS = 5;
    public const RESEND_COOLDOWN_SECONDS = 60;
    public const RATE_LIMIT_WINDOW_SECONDS = 600;
    public const RATE_LIMIT_MAX_REQUESTS = 3;

    private const VALID_PURPOSES = [
        OtpPurpose::REGISTER->value,
        OtpPurpose::LOGIN->value,
        OtpPurpose::GOOGLE_LOGIN->value,
        OtpPurpose::DELETE_ACCOUNT->value,
        OtpPurpose::REMOVE_DEVICE->value,
        OtpPurpose::CHANGE_EMAIL->value,
        OtpPurpose::CHANGE_PASSWORD->value,
        OtpPurpose::SENSITIVE_ACTION->value,
    ];

    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function issue(
        string $email,
        string $purpose,
        ?string $userId = null,
        ?string $phone = null,
        ?string $challengeId = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
        ?array $metadata = null,
        ?int $ttlSeconds = null,
    ): string {
        $email = $this->normalizeEmail($email);
        $this->validatePurpose($purpose);

        $ttl = $ttlSeconds ?? self::DEFAULT_TTL_SECONDS;
        $this->checkRateLimit($email, $purpose, $ipAddress);

        $code = $this->generateCode();
        $codeHash = Hash::make($code);

        DB::transaction(function () use ($email, $purpose, $userId, $phone, $challengeId, $codeHash, $ttl, $ipAddress, $userAgent, $metadata): void {
            $this->invalidateExistingOtps($email, $purpose, $challengeId);

            DB::table('otp_challenges')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $userId,
                'email' => $email,
                'phone' => $phone,
                'purpose' => $purpose,
                'code_hash' => $codeHash,
                'attempts' => 0,
                'max_attempts' => self::MAX_ATTEMPTS,
                'expires_at' => now()->addSeconds($ttl),
                'challenge_id' => $challengeId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'metadata' => $metadata ? json_encode($metadata) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('security_events')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $userId,
                'email' => $email,
                'event_type' => 'otp_issued',
                'purpose' => $purpose,
                'severity' => 'info',
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'metadata' => $metadata ? json_encode($metadata) : null,
                'success' => true,
                'occurred_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return $code;
    }

    public function verify(
        string $email,
        string $purpose,
        string $code,
        ?string $challengeId = null,
        ?string $userId = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): void {
        $email = $this->normalizeEmail($email);
        $givenCode = trim((string) $code);
        $this->validatePurpose($purpose);

        $otp = DB::table('otp_challenges')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('created_at')
            ->lockForUpdate()
            ->first();

        if (! $otp) {
            $this->logSecurityEvent($userId, $email, 'otp_verify_failed', $purpose, $ipAddress, $userAgent, false, 'OTP tidak ditemukan atau sudah digunakan');
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        if ($otp->expires_at < now()) {
            $this->logSecurityEvent($userId, $email, 'otp_verify_failed', $purpose, $ipAddress, $userAgent, false, 'OTP kedaluwarsa');
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        if ($otp->attempts >= $otp->max_attempts) {
            $this->logSecurityEvent($userId, $email, 'otp_verify_failed', $purpose, $ipAddress, $userAgent, false, 'Maksimal percobaan terlampaui');
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        if (! Hash::check($givenCode, $otp->code_hash)) {
            DB::table('otp_challenges')
                ->where('id', $otp->id)
                ->increment('attempts');

            $this->logSecurityEvent($userId, $email, 'otp_verify_failed', $purpose, $ipAddress, $userAgent, false, 'Kode salah');
            throw ValidationException::withMessages([
                'code' => ['Kode verifikasi tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        DB::transaction(function () use ($otp, $userId, $email, $purpose, $ipAddress, $userAgent): void {
            DB::table('otp_challenges')
                ->where('id', $otp->id)
                ->update([
                    'consumed_at' => now(),
                    'attempts' => $otp->max_attempts,
                    'updated_at' => now(),
                ]);

            $this->logSecurityEvent($userId, $email, 'otp_verified', $purpose, $ipAddress, $userAgent, true, null);
        });
    }

    public function verifyAndConsume(
        string $email,
        string $purpose,
        string $code,
        ?string $challengeId = null,
        ?string $userId = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): void {
        $this->verify($email, $purpose, $code, $challengeId, $userId, $ipAddress, $userAgent);
    }

    public function resend(
        string $email,
        string $purpose,
        ?string $userId = null,
        ?string $phone = null,
        ?string $challengeId = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
        ?array $metadata = null,
        ?int $ttlSeconds = null,
    ): string {
        $email = $this->normalizeEmail($email);
        $this->validatePurpose($purpose);

        // Resend replaces the previous OTP, so we skip cooldown check here.
        // The rate limit in issue() still applies.

        return $this->issue($email, $purpose, $userId, $phone, $challengeId, $ipAddress, $userAgent, $metadata, $ttlSeconds);
    }

    public function isValid(
        string $email,
        string $purpose,
        string $code,
        ?string $challengeId = null,
        ?string $userId = null,
    ): bool {
        $email = $this->normalizeEmail($email);
        $givenCode = trim((string) $code);
        $this->validatePurpose($purpose);

        $otp = DB::table('otp_challenges')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('created_at')
            ->first();

        if (! $otp) {
            return false;
        }

        if ($otp->expires_at < now()) {
            return false;
        }

        if ($otp->attempts >= $otp->max_attempts) {
            return false;
        }

        return Hash::check($givenCode, $otp->code_hash);
    }

    public function getRemainingAttempts(
        string $email,
        string $purpose,
        ?string $challengeId = null,
        ?string $userId = null,
    ): int {
        $email = $this->normalizeEmail($email);
        $this->validatePurpose($purpose);

        $otp = DB::table('otp_challenges')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('created_at')
            ->first();

        if (! $otp) {
            return 0;
        }

        return max(0, $otp->max_attempts - $otp->attempts);
    }

    public function getTimeRemaining(
        string $email,
        string $purpose,
        ?string $challengeId = null,
        ?string $userId = null,
    ): int {
        $email = $this->normalizeEmail($email);
        $this->validatePurpose($purpose);

        $otp = DB::table('otp_challenges')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('created_at')
            ->first();

        if (! $otp) {
            return 0;
        }

        return max(0, (int) $otp->expires_at->diffInSeconds(now()));
    }

    public function invalidateAllForUser(string $userId, ?string $purpose = null): void
    {
        $query = DB::table('otp_challenges')
            ->where('user_id', $userId)
            ->whereNull('consumed_at');

        if ($purpose) {
            $this->validatePurpose($purpose);
            $query->where('purpose', $purpose);
        }

        $query->update([
            'consumed_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function invalidateByChallengeId(string $challengeId, ?string $purpose = null): void
    {
        $query = DB::table('otp_challenges')
            ->where('challenge_id', $challengeId)
            ->whereNull('consumed_at');

        if ($purpose) {
            $this->validatePurpose($purpose);
            $query->where('purpose', $purpose);
        }

        $query->update([
            'consumed_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function cleanupExpired(): int
    {
        return DB::table('otp_challenges')
            ->where('expires_at', '<', now())
            ->whereNull('consumed_at')
            ->delete();
    }

    public function cleanupOldConsumed(int $days = 30): int
    {
        return DB::table('otp_challenges')
            ->where('consumed_at', '<', now()->subDays($days))
            ->delete();
    }

    public function getActiveOtpCount(string $email, ?string $purpose = null): int
    {
        $email = $this->normalizeEmail($email);

        $query = DB::table('otp_challenges')
            ->where('email', $email)
            ->whereNull('consumed_at')
            ->where('expires_at', '>=', now());

        if ($purpose) {
            $this->validatePurpose($purpose);
            $query->where('purpose', $purpose);
        }

        return $query->count();
    }

    private function generateCode(): string
    {
        return (string) random_int(10 ** (self::CODE_LENGTH - 1), (10 ** self::CODE_LENGTH) - 1);
    }

    private function normalizeEmail(string $email): string
    {
        return mb_strtolower(trim($email));
    }

    private function validatePurpose(string $purpose): void
    {
        if (! in_array($purpose, self::VALID_PURPOSES, true)) {
            throw new RuntimeException("Tujuan OTP tidak valid: {$purpose}");
        }
    }

    private function checkRateLimit(string $email, string $purpose, ?string $ipAddress): void
    {
        $key = "otp_rate_limit:{$purpose}:{$email}";
        if ($ipAddress) {
            $key .= ":{$ipAddress}";
        }

        $attempts = cache()->get($key, 0);
        if ($attempts >= self::RATE_LIMIT_MAX_REQUESTS) {
            throw ValidationException::withMessages([
                'code' => ['Terlalu banyak permintaan OTP. Silakan coba lagi nanti.'],
            ]);
        }

        cache()->put($key, $attempts + 1, now()->addSeconds(self::RATE_LIMIT_WINDOW_SECONDS));
    }

    private function invalidateExistingOtps(string $email, string $purpose, ?string $challengeId): void
    {
        DB::table('otp_challenges')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->update([
                'consumed_at' => now(),
                'updated_at' => now(),
            ]);
    }

    private function logSecurityEvent(
        ?string $userId,
        string $email,
        string $eventType,
        string $purpose,
        ?string $ipAddress,
        ?string $userAgent,
        bool $success,
        ?string $failureReason,
    ): void {
        DB::table('security_events')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'email' => $email,
            'event_type' => $eventType,
            'purpose' => $purpose,
            'severity' => $success ? 'info' : 'warning',
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'metadata' => json_encode(['failure_reason' => $failureReason]),
            'success' => $success,
            'failure_reason' => $failureReason,
            'occurred_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function ttlMinutes(): int
    {
        return (int) round(self::DEFAULT_TTL_SECONDS / 60);
    }

    public function codeLength(): int
    {
        return self::CODE_LENGTH;
    }

    public function maxAttempts(): int
    {
        return self::MAX_ATTEMPTS;
    }

    public function resendCooldownSeconds(): int
    {
        return self::RESEND_COOLDOWN_SECONDS;
    }

    public function getValidPurposes(): array
    {
        return self::VALID_PURPOSES;
    }
}