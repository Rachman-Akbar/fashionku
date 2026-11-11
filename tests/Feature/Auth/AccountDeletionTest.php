<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\Auth\Application\Services\OtpSecurityEngine;
use App\Domains\Identity\Auth\Domain\Enums\OtpPurpose;
use App\Domains\Identity\Auth\Infrastructure\Mail\EmailVerificationMail;
use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\UserDevice;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
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

    private function createDevice(User $user): UserDevice
    {
        $token = $user->createToken('test-device', ['access-api', 'active-role:buyer']);
        
        return UserDevice::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => (string) $user->id,
            'device_name' => 'Test Device',
            'device_type' => 'Desktop',
            'browser' => 'Chrome',
            'browser_version' => '120',
            'os' => 'Windows',
            'os_version' => '10',
            'ip_address' => '127.0.0.1',
            'sanctum_token_id' => (string) $token->accessToken->id,
            'sanctum_token_name' => 'test-device',
            'last_active_at' => now(),
            'expires_at' => now()->addDays(30),
            'status' => 'active',
            'metadata' => json_encode(['test' => true]),
        ]);
    }

    public function test_delete_account_with_valid_otp_succeeds(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-valid@example.com']);
        
        $this->createDevice($user);

        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user->email);

        $userId = (string) $user->id;

        $response = $this->deleteJson('/api/v1/identity/auth/account', [
            'code' => $code,
        ]);
        
        $response->assertOk();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('message', 'Akun berhasil dihapus secara permanen.');

        $this->assertSoftDeleted('users', ['id' => $userId]);
        
        $deletedUser = User::withTrashed()->find($userId);
        $this->assertNotNull($deletedUser);
        $this->assertStringStartsWith('deleted_', $deletedUser->email);
        $this->assertEquals('Deleted User', $deletedUser->name);
        $this->assertFalse($deletedUser->is_active);
        $this->assertNotNull($deletedUser->banned_at);
        
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_delete_account_with_invalid_otp_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-invalid@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');

        $response = $this->deleteJson('/api/v1/identity/auth/account', [
            'code' => '000000',
        ]);
        
        $response->assertStatus(422);

        $this->assertDatabaseHas('users', ['email' => 'delete-invalid@example.com', 'deleted_at' => null]);
    }

    public function test_delete_account_with_expired_otp_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-expired@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user->email);

        // Expire the OTP
        \App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge::where('email', $user->email)
            ->where('purpose', OtpPurpose::DELETE_ACCOUNT->value)
            ->update(['expires_at' => now()->subMinutes(10)]);

        $response = $this->deleteJson('/api/v1/identity/auth/account', [
            'code' => $code,
        ]);
        
        $response->assertStatus(422);

        $this->assertDatabaseHas('users', ['email' => 'delete-expired@example.com', 'deleted_at' => null]);
    }

    public function test_delete_account_with_reused_otp_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-reuse@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user->email);

        $this->deleteJson('/api/v1/identity/auth/account', ['code' => $code])->assertOk();

        // Account already deleted, user is unauthenticated
        $response = $this->deleteJson('/api/v1/identity/auth/account', ['code' => $code]);
        
        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_delete_account(): void
    {
        $this->makeRole('buyer');
        $this->makeUser(['email' => 'unauth@example.com']);

        $response = $this->deleteJson('/api/v1/identity/auth/account', [
            'code' => '123456',
        ]);
        
        $response->assertStatus(401);
    }

    public function test_user_cannot_delete_other_user_account(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        
        $user1 = $this->actingAsRole('buyer', ['email' => 'user1-delete@example.com']);
        $user2 = $this->makeUser(['email' => 'user2-delete@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user1->email);

        // Try to delete user2's account using user1's OTP
        // This should fail because the OTP is tied to user1
        $response = $this->deleteJson('/api/v1/identity/auth/account', [
            'code' => $code,
        ]);
        
        // The delete should work for user1, not user2
        $this->assertSoftDeleted('users', ['id' => (string) $user1->id]);
        $this->assertDatabaseHas('users', ['id' => (string) $user2->id, 'deleted_at' => null]);
    }

    public function test_concurrent_deletion_attempts(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-concurrent@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user->email);

        $response1 = $this->deleteJson('/api/v1/identity/auth/account', ['code' => $code]);
        $response2 = $this->deleteJson('/api/v1/identity/auth/account', ['code' => $code]);

        $successCount = 0;
        if ($response1->status() === 200) $successCount++;
        if ($response2->status() === 200) $successCount++;

        $this->assertEquals(1, $successCount, 'Only one deletion should succeed');
    }

    public function test_delete_account_revokes_all_devices_and_tokens(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-devices@example.com']);
        
        $device1 = $this->createDevice($user);
        $device2 = $this->createDevice($user, ['device_name' => 'Device 2']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        $code = $this->getCodeFromMail($user->email);

        $this->deleteJson('/api/v1/identity/auth/account', ['code' => $code])->assertOk();

        $this->assertSoftDeleted('user_devices', ['id' => $device1->id]);
        $this->assertSoftDeleted('user_devices', ['id' => $device2->id]);
        
        $this->assertNull(PersonalAccessToken::findToken($device1->sanctum_token_id));
        $this->assertNull(PersonalAccessToken::findToken($device2->sanctum_token_id));
    }

    public function test_resend_deletion_otp_works(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'delete-resend@example.com']);
        
        $this->postJson('/api/v1/identity/auth/account/request-deletion-otp');
        
        $response = $this->postJson('/api/v1/identity/auth/account/resend-deletion-otp');
        
        $response->assertOk();
        $response->assertJsonPath('message', 'Kode verifikasi baru telah dikirim.');
        
        $queued = Mail::queued(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($user->email));
        $this->assertCount(2, $queued);
        /** @var EmailVerificationMail $mail */
        $mail = $queued->last();
        $code = (string) $mail->code;
        $this->assertNotEmpty($code);
    }
}