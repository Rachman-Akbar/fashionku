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
        $queued = Mail::sent(EmailVerificationMail::class, fn ($mail): bool => $mail->hasTo($email));
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

    public function test_delete_account_succeeds(): void
    {
        $this->makeRole('buyer');
        $user = $this->actingAsRole('buyer', ['email' => 'delete-valid@example.com']);

        $this->createDevice($user);

        $userId = (string) $user->id;

        $response = $this->deleteJson('/api/v1/identity/auth/account');

        $response->assertOk();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('message', 'Akun berhasil dihapus secara permanen.');

        $this->assertSoftDeleted('users', ['id' => $userId]);

        $deletedUser = User::withTrashed()->find($userId);
        $this->assertNotNull($deletedUser);
        $this->assertStringStartsWith('deleted_', $deletedUser->email);
        $this->assertEquals('Deleted User', $deletedUser->name);
        $this->assertFalse($deletedUser->is_active);

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_unauthenticated_user_cannot_delete_account(): void
    {
        $this->makeRole('buyer');
        $this->makeUser(['email' => 'unauth@example.com']);

        $response = $this->deleteJson('/api/v1/identity/auth/account');

        $response->assertStatus(401);
    }

    public function test_user_cannot_delete_other_user_account(): void
    {
        $this->makeRole('buyer');

        $user1 = $this->actingAsRole('buyer', ['email' => 'user1-delete@example.com']);
        $user2 = $this->makeUser(['email' => 'user2-delete@example.com']);

        $this->createDevice($user2);

        $response = $this->deleteJson('/api/v1/identity/auth/account');

        // The delete should work for user1 (authenticated), not user2
        $this->assertSoftDeleted('users', ['id' => (string) $user1->id]);
        $this->assertDatabaseHas('users', ['id' => (string) $user2->id, 'deleted_at' => null]);
    }

    public function test_delete_account_revokes_all_devices_and_tokens(): void
    {
        $this->makeRole('buyer');
        $user = $this->actingAsRole('buyer', ['email' => 'delete-devices@example.com']);

        $device1 = $this->createDevice($user);
        $device2 = $this->createDevice($user, ['device_name' => 'Device 2']);

        $this->deleteJson('/api/v1/identity/auth/account')->assertOk();

        $this->assertSoftDeleted('user_devices', ['id' => $device1->id]);
        $this->assertSoftDeleted('user_devices', ['id' => $device2->id]);

        $this->assertNull(PersonalAccessToken::findToken($device1->sanctum_token_id));
        $this->assertNull(PersonalAccessToken::findToken($device2->sanctum_token_id));
    }
}