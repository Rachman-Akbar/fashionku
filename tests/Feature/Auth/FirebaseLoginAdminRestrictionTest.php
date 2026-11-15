<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\Auth\Application\UseCases\LoginWithFirebaseUseCase;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Akun admin hanya dibuat manual oleh admin utama, jadi admin tidak boleh
 * mendaftar maupun masuk melalui Google.
 */
class FirebaseLoginAdminRestrictionTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_admin_cannot_initiate_google_login(): void
    {
        Mail::fake();

        $admin = $this->makeUser(['email' => 'admin@fashionku.test'], ['admin']);

        $this->expectException(ValidationException::class);

        try {
            $this->useCase()->initiate($this->firebaseUser($admin->email, 'uid-admin'), 'buyer');
        } finally {
            $this->assertDatabaseMissing('otp_challenges', [
                'email' => $admin->email,
                'purpose' => OtpPurpose::GOOGLE_LOGIN->value,
            ]);
        }
    }

    public function test_admin_google_login_does_not_grant_buyer_role(): void
    {
        Mail::fake();

        $admin = $this->makeUser(['email' => 'admin2@fashionku.test'], ['admin']);

        try {
            $this->useCase()->initiate($this->firebaseUser($admin->email, 'uid-admin-2'), 'buyer');
        } catch (ValidationException) {
            // expected
        }

        $this->assertFalse($admin->fresh()->hasRole('buyer'));
    }

    public function test_non_admin_can_still_initiate_google_login(): void
    {
        Mail::fake();

        $buyer = $this->makeUser(['email' => 'buyer@fashionku.test'], ['buyer']);

        $result = $this->useCase()->initiate($this->firebaseUser($buyer->email, 'uid-buyer'), 'buyer');

        $this->assertTrue($result['otp_required']);
        $this->assertDatabaseHas('otp_challenges', [
            'email' => $buyer->email,
            'purpose' => OtpPurpose::GOOGLE_LOGIN->value,
        ]);
    }

    private function useCase(): LoginWithFirebaseUseCase
    {
        return $this->app->make(LoginWithFirebaseUseCase::class);
    }

    private function firebaseUser(string $email, string $uid): array
    {
        return [
            'uid' => $uid,
            'email' => $email,
            'email_verified' => true,
            'name' => 'Test User',
            'claims' => [
                'firebase' => [
                    'sign_in_provider' => 'google.com',
                ],
            ],
        ];
    }
}