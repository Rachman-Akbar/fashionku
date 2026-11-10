<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class OtpSecurityEngineTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function getCodeFromMail(string $email): string
    {
        $queued = Mail::queued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($email));
        $this->assertCount(1, $queued, 'Expected exactly one verification mail for '.$email);
        /** @var EmailVerificationMail $mail */
        $mail = $queued->first();
        return (string) $mail->code;
    }

    public function test_otp_engine_issues_and_verifies_code(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-otp@example.com';

        $code = $engine->issue($email, OtpPurpose::REGISTER->value);
        $this->assertMatchesRegularExpression('/^\d{6}$/', $code);

        $engine->verify($email, OtpPurpose::REGISTER->value, $code);
    }

    public function test_otp_engine_rejects_wrong_code(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-wrong@example.com';

        $engine->issue($email, OtpPurpose::REGISTER->value);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::REGISTER->value, '000000');
    }

    public function test_otp_engine_rejects_reused_code(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-reuse@example.com';

        $code = $engine->issue($email, OtpPurpose::REGISTER->value);
        $engine->verify($email, OtpPurpose::REGISTER->value, $code);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::REGISTER->value, $code);
    }

    public function test_otp_engine_respects_purpose_separation(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-purpose@example.com';

        $registerCode = $engine->issue($email, OtpPurpose::REGISTER->value);
        $loginCode = $engine->issue($email, OtpPurpose::LOGIN->value);

        $this->assertNotEquals($registerCode, $loginCode);

        $engine->verify($email, OtpPurpose::REGISTER->value, $registerCode);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::LOGIN->value, $registerCode);
    }

    public function test_otp_engine_resend_invalidates_previous(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-resend@example.com';

        $code1 = $engine->issue($email, OtpPurpose::REGISTER->value);
        $code2 = $engine->resend($email, OtpPurpose::REGISTER->value);

        $this->assertNotEquals($code1, $code2);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::REGISTER->value, $code1);

        $engine->verify($email, OtpPurpose::REGISTER->value, $code2);
    }

    public function test_otp_engine_max_attempts(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-attempts@example.com';

        $code = $engine->issue($email, OtpPurpose::REGISTER->value);

        for ($i = 0; $i < 5; $i++) {
            try {
                $engine->verify($email, OtpPurpose::REGISTER->value, '000000');
            } catch (\Illuminate\Validation\ValidationException $e) {
                // Expected
            }
        }

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::REGISTER->value, $code);
    }

    public function test_otp_engine_cooldown_on_resend(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-cooldown@example.com';

        $engine->issue($email, OtpPurpose::REGISTER->value);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->resend($email, OtpPurpose::REGISTER->value);
    }

    public function test_otp_stored_as_hash_not_plaintext(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-hash@example.com';

        $code = $engine->issue($email, OtpPurpose::REGISTER->value);

        $otp = OtpChallenge::where('email', $email)
            ->where('purpose', OtpPurpose::REGISTER->value)
            ->first();

        $this->assertNotNull($otp);
        $this->assertTrue(Hash::check($code, $otp->code_hash));
        $this->assertNotEquals($code, $otp->code_hash);
    }

    public function test_otp_challenge_id_isolation(): void
    {
        $engine = app(OtpSecurityEngine::class);
        $email = 'test-challenge@example.com';

        $code1 = $engine->issue($email, OtpPurpose::REGISTER->value, challengeId: 'challenge-1');
        $code2 = $engine->issue($email, OtpPurpose::LOGIN->value, challengeId: 'challenge-2');

        $engine->verify($email, OtpPurpose::REGISTER->value, $code1, challengeId: 'challenge-1');

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $engine->verify($email, OtpPurpose::LOGIN->value, $code1, challengeId: 'challenge-2');
    }
}