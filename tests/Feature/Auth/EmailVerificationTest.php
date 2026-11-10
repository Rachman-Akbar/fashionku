<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function codeFor(string $email): string
    {
        $queued = Mail::queued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($email));

        $this->assertCount(1, $queued, 'Expected exactly one verification mail for '.$email);

        /** @var EmailVerificationMail $mail */
        $mail = $queued->first();

        return (string) $mail->code;
    }

    public function test_authenticated_user_can_request_a_verification_code(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'owner@example.com']);

        $this->postJson('/api/v1/identity/auth/send-verification-code')
            ->assertOk()
            ->assertJsonPath('expires_in_minutes', 10);

        Mail::assertQueued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($user->email));
    }

    public function test_change_password_requires_a_valid_verification_code(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', [
            'email' => 'changer@example.com',
            'password' => 'OldPass123',
        ]);

        $this->postJson('/api/v1/identity/auth/change-password', [
            'current_password' => 'OldPass123',
            'new_password' => 'NewPass123',
            'new_password_confirmation' => 'NewPass123',
        ])->assertStatus(422);
    }

    public function test_change_password_rejects_wrong_code(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', [
            'email' => 'wro-ngcode@example.com',
            'password' => 'OldPass123',
        ]);

        $this->postJson('/api/v1/identity/auth/send-verification-code');

        $this->postJson('/api/v1/identity/auth/change-password', [
            'current_password' => 'OldPass123',
            'new_password' => 'NewPass123',
            'new_password_confirmation' => 'NewPass123',
            'verification_code' => '000000',
        ])->assertStatus(422);
    }

    public function test_change_password_succeeds_with_valid_code(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', [
            'email' => 'changer-ok@example.com',
            'password' => 'OldPass123',
        ]);

        $this->postJson('/api/v1/identity/auth/send-verification-code');
        $code = $this->codeFor($user->email);

        $this->postJson('/api/v1/identity/auth/change-password', [
            'current_password' => 'OldPass123',
            'new_password' => 'NewPass123',
            'new_password_confirmation' => 'NewPass123',
            'verification_code' => $code,
        ])->assertOk();

        $this->assertTrue(Hash::check('NewPass123', $user->refresh()->password));
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_forgot_password_resets_via_email_code(): void
    {
        Mail::fake();
        $user = $this->makeUser([
            'email' => 'forgot@example.com',
            'password' => 'OldPass123',
        ]);

        $this->postJson('/api/v1/identity/auth/send-password-reset-code', [
            'email' => 'forgot@example.com',
        ])->assertOk()->assertJsonPath('message', 'Jika email terdaftar, kode verifikasi 6 digit akan dikirim dalam beberapa menit.');

        $code = $this->codeFor($user->email);

        $this->postJson('/api/v1/identity/auth/reset-password-with-code', [
            'email' => 'forgot@example.com',
            'code' => $code,
            'password' => 'FreshPass123',
            'password_confirmation' => 'FreshPass123',
        ])->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('FreshPass123', $user->password));
        $this->assertTrue((bool) $user->is_email_verified);
        $this->assertTrue((bool) $user->has_set_password);
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_verify_email_code_marks_email_as_verified(): void
    {
        Mail::fake();
        $user = $this->makeUser([
            'email' => 'unverified@example.com',
            'is_email_verified' => false,
        ]);

        $this->postJson('/api/v1/identity/auth/send-password-reset-code', [
            'email' => 'unverified@example.com',
        ])->assertOk();

        $code = $this->codeFor($user->email);

        $this->postJson('/api/v1/identity/auth/verify-email-code', [
            'email' => 'unverified@example.com',
            'code' => $code,
        ])->assertOk()->assertJsonPath('message', 'Email berhasil diverifikasi.');

        $this->assertTrue((bool) $user->refresh()->is_email_verified);

        // The code is single-use.
        $this->postJson('/api/v1/identity/auth/verify-email-code', [
            'email' => 'unverified@example.com',
            'code' => $code,
        ])->assertStatus(422);
    }

    public function test_self_profile_edit_requires_verification_code(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'editor@example.com']);

        $this->putJson('/api/v1/identity/users/'.$user->id, [
            'name' => 'Tanpa Verifikasi',
        ])->assertStatus(422);

        $this->postJson('/api/v1/identity/auth/send-verification-code');
        $code = $this->codeFor($user->email);

        $this->putJson('/api/v1/identity/users/'.$user->id, [
            'email' => 'editor@example.com',
            'name' => 'Sudah Diverifikasi',
            'verification_code' => $code,
        ])->assertOk();

        $this->assertSame('Sudah Diverifikasi', $user->refresh()->name);

        $this->postJson('/api/v1/identity/auth/send-verification-code');
        $this->putJson('/api/v1/identity/users/'.$user->id, [
            'name' => 'Kode Dipakai Ulang',
            'verification_code' => $code,
        ])->assertStatus(422);
    }

    public function test_google_user_can_add_password_after_verification(): void
    {
        Mail::fake();
        $user = $this->actingAsRole('buyer', [
            'email' => 'google@example.com',
            'firebase_uid' => 'google-uid-123',
            'has_set_password' => false,
        ]);
        $user->forceFill(['password' => Hash::make(Str::random(40))])->save();

        $this->postJson('/api/v1/identity/auth/send-verification-code');
        $code = $this->codeFor($user->email);

        $this->putJson('/api/v1/identity/users/'.$user->id, [
            'password' => 'MyNewPass123',
            'verification_code' => $code,
        ])->assertOk();

        $this->assertTrue((bool) $user->refresh()->has_set_password);
        $this->assertTrue(Hash::check('MyNewPass123', $user->password));
    }

    public function test_me_reports_has_password_and_email_verification(): void
    {
        $user = $this->actingAsRole('buyer', [
            'email' => 'payload@example.com',
            'has_set_password' => true,
            'is_email_verified' => true,
        ]);

        $this->getJson('/api/v1/identity/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'payload@example.com')
            ->assertJsonPath('user.has_password', true)
            ->assertJsonPath('user.is_email_verified', true);
    }

    public function test_me_reports_no_password_for_google_users(): void
    {
        $this->actingAsRole('buyer', [
            'email' => 'google-payload@example.com',
            'has_set_password' => false,
            'is_email_verified' => true,
        ]);

        $this->getJson('/api/v1/identity/auth/me')
            ->assertOk()
            ->assertJsonPath('user.has_password', false);
    }
}
