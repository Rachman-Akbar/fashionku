<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Kebijakan sesi tunggal: beralih role menerbitkan token baru dan mencabut
 * seluruh sesi lama sehingga tidak ada dua token aktif untuk satu akun.
 */
class SwitchRoleSessionTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_switching_role_revokes_the_previous_session_token(): void
    {
        $user = $this->makeUser([], ['buyer', 'admin']);
        $oldToken = $this->tokenFor($user, 'buyer');

        // Token lama masih berlaku sebelum ganti role.
        $this->withToken($oldToken)
            ->getJson('/api/v1/identity/auth/me')
            ->assertOk();

        $response = $this->withToken($oldToken)->postJson('/api/v1/identity/auth/switch-role', [
            'role' => 'admin',
            'device_name' => 'web-test',
        ]);

        $response->assertOk();
        $newToken = $response->json('access_token') ?? $response->json('api_token');
        $this->assertNotEmpty($newToken);
        $this->assertNotSame($oldToken, $newToken);

        // Sesi lama (token lama) sudah dicabut. Guard auth di-refresh dulu karena
        // dalam satu instance test aplikasi guard meng-cache user request sebelumnya.
        $this->app['auth']->forgetGuards();

        $this->withToken($oldToken)
            ->getJson('/api/v1/identity/auth/me')
            ->assertUnauthorized();

        // Token baru aktif.
        $this->app['auth']->forgetGuards();

        $this->withToken($newToken)
            ->getJson('/api/v1/identity/auth/me')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);
    }
}
