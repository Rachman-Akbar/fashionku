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

class DeviceManagementTest extends TestCase
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

    private function createDevice(User $user, array $overrides = []): UserDevice
    {
        $token = $user->createToken('test-device', ['access-api', 'active-role:buyer']);
        
        return UserDevice::create(array_merge([
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
        ], $overrides));
    }

    public function test_user_can_list_devices(): void
    {
        $this->makeRole('buyer');
        $user = $this->actingAsRole('buyer', ['email' => 'device-list@example.com']);
        
        $this->createDevice($user);
        $this->createDevice($user, ['device_name' => 'Second Device']);

        $response = $this->getJson('/api/v1/identity/auth/devices');
        
        $response->assertOk();
        $response->assertJsonStructure(['devices']);
        $this->assertCount(2, $response->json('devices'));
    }

    public function test_request_device_removal_otp_works(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'device-otp@example.com']);
        
        $device = $this->createDevice($user);

        $response = $this->postJson("/api/v1/identity/auth/devices/{$device->id}/request-removal-otp", [
            'device_id' => $device->id,
        ]);
        
        $response->assertOk();
        $response->assertJsonStructure(['message', 'device_id', 'expires_in_minutes', 'code_length']);
        
        $code = $this->getCodeFromMail($user->email);
        $this->assertNotEmpty($code);
    }

    public function test_remove_device_with_valid_otp_succeeds(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'device-remove@example.com']);
        
        $device = $this->createDevice($user);
        
        $this->postJson("/api/v1/identity/auth/devices/{$device->id}/request-removal-otp", [
            'device_id' => $device->id,
        ]);
        $code = $this->getCodeFromMail($user->email);

        $response = $this->deleteJson("/api/v1/identity/auth/devices/{$device->id}", [
            'device_id' => $device->id,
            'code' => $code,
        ]);
        
        $response->assertOk();
        $response->assertJsonPath('message', 'Perangkat berhasil dihapus dan sesi telah dicabut.');

        $this->assertSoftDeleted('user_devices', ['id' => $device->id]);
        $this->assertNull(PersonalAccessToken::find($device->sanctum_token_id));
    }

    public function test_remove_device_with_invalid_otp_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'device-invalid@example.com']);
        
        $device = $this->createDevice($user);
        
        $this->postJson("/api/v1/identity/auth/devices/{$device->id}/request-removal-otp", [
            'device_id' => $device->id,
        ]);

        $response = $this->deleteJson("/api/v1/identity/auth/devices/{$device->id}", [
            'device_id' => $device->id,
            'code' => '000000',
        ]);
        
        $response->assertStatus(422);

        $this->assertDatabaseHas('user_devices', ['id' => $device->id, 'status' => 'active']);
        $this->assertNotNull(PersonalAccessToken::find($device->sanctum_token_id));
    }

    public function test_remove_device_with_expired_otp_fails(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        $user = $this->actingAsRole('buyer', ['email' => 'device-expired@example.com']);
        
        $device = $this->createDevice($user);
        
        $this->postJson("/api/v1/identity/auth/devices/{$device->id}/request-removal-otp", [
            'device_id' => $device->id,
        ]);
        $code = $this->getCodeFromMail($user->email);

        // Expire the OTP
        \App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge::where('email', $user->email)
            ->where('purpose', OtpPurpose::REMOVE_DEVICE->value)
            ->update(['expires_at' => now()->subMinutes(10)]);

        $response = $this->deleteJson("/api/v1/identity/auth/devices/{$device->id}", [
            'device_id' => $device->id,
            'code' => $code,
        ]);
        
        $response->assertStatus(422);

        $this->assertDatabaseHas('user_devices', ['id' => $device->id, 'status' => 'active']);
    }

    public function test_user_cannot_remove_other_users_device(): void
    {
        $this->makeRole('buyer');
        Mail::fake();
        
        $user1 = $this->actingAsRole('buyer', ['email' => 'user1@example.com']);
        $user2 = $this->makeUser(['email' => 'user2@example.com']);
        
        $device = $this->createDevice($user2);
        
        $response = $this->postJson("/api/v1/identity/auth/devices/{$device->id}/request-removal-otp", [
            'device_id' => $device->id,
        ]);
        
        $response->assertStatus(422);
        $response->assertJsonPath('errors.device_id.0', 'Perangkat tidak ditemukan.');
    }

    public function test_logout_other_devices_revokes_tokens(): void
    {
        $this->makeRole('buyer');
        $user = $this->actingAsRole('buyer', ['email' => 'logout-other@example.com']);
        
        $device1 = $this->createDevice($user);
        $device2 = $this->createDevice($user, ['device_name' => 'Device 2']);
        
        $response = $this->postJson('/api/v1/identity/auth/logout-other-devices');
        
        $response->assertOk();
        
        $this->assertNull(PersonalAccessToken::findToken($device1->sanctum_token_id));
        $this->assertNull(PersonalAccessToken::findToken($device2->sanctum_token_id));
    }

    public function test_logout_all_devices_revokes_all_tokens(): void
    {
        $this->makeRole('buyer');
        $user = $this->actingAsRole('buyer', ['email' => 'logout-all@example.com']);
        
        $this->createDevice($user);
        $this->createDevice($user, ['device_name' => 'Device 2']);
        
        $response = $this->postJson('/api/v1/identity/auth/logout-all-devices');
        
        $response->assertOk();
        
        $user->refresh();
        $this->assertEquals(0, $user->tokens()->count());
    }
}