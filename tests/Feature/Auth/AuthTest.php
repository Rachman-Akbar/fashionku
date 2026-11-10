<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $this->makeRole('buyer');

        $response = $this->postJson('/api/v1/identity/auth/password-register', [
            'name' => 'Reg User',
            'email' => 'reg@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['access_token', 'api_token', 'token_type']);
        $this->assertDatabaseHas('users', ['email' => 'reg@example.com']);

        $user = User::query()->where('email', 'reg@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('buyer'));
    }

    public function test_register_requires_unique_email(): void
    {
        $this->makeRole('buyer');
        $this->makeUser(['email' => 'dup@example.com']);

        $this->postJson('/api/v1/identity/auth/password-register', [
            'name' => 'Dup',
            'email' => 'dup@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertStatus(422);
    }

    public function test_user_can_login_and_fetch_me(): void
    {
        $user = $this->makeUser([
            'email' => 'login@example.com',
            'password' => 'secret123',
            'is_email_verified' => true,
        ]);

        $login = $this->postJson('/api/v1/identity/auth/password-login', [
            'email' => 'login@example.com',
            'password' => 'secret123',
            'role' => 'buyer',
        ]);

        $login->assertOk();
        $token = $login->json('api_token') ?? $login->json('access_token');
        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/v1/identity/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'login@example.com');
    }

    public function test_login_rejects_wrong_password(): void
    {
        $this->makeUser(['email' => 'bad@example.com', 'password' => 'secret123']);

        $this->postJson('/api/v1/identity/auth/password-login', [
            'email' => 'bad@example.com',
            'password' => 'wrongpass',
        ])->assertStatus(422);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/v1/identity/auth/me')->assertStatus(401);
    }
}
