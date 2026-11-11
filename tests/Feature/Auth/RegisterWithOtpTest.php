<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class RegisterWithOtpTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function makeRole(string $name): \App\Domains\Identity\User\Domain\Entities\Role
    {
        return \App\Domains\Identity\User\Domain\Entities\Role::query()->firstOrCreate(
            ['name' => $name],
            ['description' => $name, 'is_active' => true],
        );
    }

    private function getCodeFromMail(string $email): string
    {
        $queued = Mail::queued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($email));
        $this->assertCount(1, $queued, 'Expected exactly one verification mail for '.$email);
        /** @var EmailVerificationMail $mail */
        $mail = $queued->first();
        return (string) $mail->code;
    }

    public function test_registration_with_otp_succeeds(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $initiate = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'OTP User',
            'email' => 'otp-reg@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $initiate->assertStatus(202);
        $initiate->assertJsonStructure(['challenge_id', 'registration_challenge_id', 'email', 'expires_in_minutes', 'code_length']);

        $challengeId = $initiate->json('challenge_id');
        $code = $this->getCodeFromMail('otp-reg@example.com');

        $verify = $this->postJson('/api/v1/identity/auth/verify-registration-otp', [
            'challenge_id' => $challengeId,
            'code' => $code,
        ]);

        $verify->assertOk();
        $verify->assertJsonStructure(['access_token', 'api_token', 'token_type', 'user']);

        $this->assertDatabaseHas('users', ['email' => 'otp-reg@example.com']);
        $user = User::where('email', 'otp-reg@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->is_email_verified);
        $this->assertTrue($user->hasRole('buyer'));
    }

    public function test_registration_with_otp_rejects_wrong_code(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $initiate = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Wrong Code User',
            'email' => 'wrong-code@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $initiate->assertStatus(202);
        $challengeId = $initiate->json('challenge_id');

        $verify = $this->postJson('/api/v1/identity/auth/verify-registration-otp', [
            'challenge_id' => $challengeId,
            'code' => '000000',
        ]);

        $verify->assertStatus(422);

        $this->assertDatabaseMissing('users', ['email' => 'wrong-code@example.com']);
    }

    public function test_registration_with_otp_rejects_expired_code(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $initiate = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Expired Code User',
            'email' => 'expired-code@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $initiate->assertStatus(202);
        $challengeId = $initiate->json('challenge_id');

        $code = $this->getCodeFromMail('expired-code@example.com');

        // Manually expire the OTP
        \App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge::where('email', 'expired-code@example.com')
            ->update(['expires_at' => now()->subMinutes(10)]);

        $verify = $this->postJson('/api/v1/identity/auth/verify-registration-otp', [
            'challenge_id' => $challengeId,
            'code' => $code,
        ]);

        $verify->assertStatus(422);

        $this->assertDatabaseMissing('users', ['email' => 'expired-code@example.com']);
    }

    public function test_registration_with_otp_rejects_reused_code(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $initiate = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Reuse Code User',
            'email' => 'reuse-code@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $initiate->assertStatus(202);
        $challengeId = $initiate->json('challenge_id');
        $code = $this->getCodeFromMail('reuse-code@example.com');

        $verify1 = $this->postJson('/api/v1/identity/auth/verify-registration-otp', [
            'challenge_id' => $challengeId,
            'code' => $code,
        ]);
        $verify1->assertOk();

        $verify2 = $this->postJson('/api/v1/identity/auth/verify-registration-otp', [
            'challenge_id' => $challengeId,
            'code' => $code,
        ]);
        $verify2->assertStatus(422);
    }

    public function test_registration_with_otp_prevents_duplicate_registration(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Duplicate User',
            'email' => 'duplicate@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertStatus(202);

        $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Duplicate User 2',
            'email' => 'duplicate@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertStatus(422);
    }

    public function test_registration_with_otp_resend_works(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $initiate = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Resend User',
            'email' => 'resend@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $initiate->assertStatus(202);
        $challengeId = $initiate->json('challenge_id');

        $resend = $this->postJson('/api/v1/identity/auth/resend-registration-otp', [
            'challenge_id' => $challengeId,
        ]);

        $resend->assertOk();
        $resend->assertJsonPath('message', 'Kode verifikasi baru telah dikirim.');

        $queued = Mail::queued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo('resend@example.com'));
        $this->assertCount(2, $queued);
        /** @var EmailVerificationMail $mail */
        $mail = $queued->last();
        $code = (string) $mail->code;
        $this->assertNotEmpty($code);
    }

    public function test_concurrent_registration_same_email_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();

        $response1 = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Concurrent 1',
            'email' => 'concurrent@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response2 = $this->postJson('/api/v1/identity/auth/register-with-otp', [
            'name' => 'Concurrent 2',
            'email' => 'concurrent@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $this->assertTrue(
            $response1->status() === 202 || $response2->status() === 202,
            'At least one should succeed'
        );
        $this->assertTrue(
            $response1->status() === 422 || $response2->status() === 422,
            'At least one should fail'
        );
    }
}