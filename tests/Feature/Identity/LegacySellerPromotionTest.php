<?php

declare(strict_types=1);

namespace Tests\Feature\Identity;

use App\Domains\Identity\User\Domain\Entities\Permission;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

final class LegacySellerPromotionTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_seller_accounts_are_promoted_and_sessions_revoked(): void
    {
        $adminRole = Role::query()->create([
            'name' => 'admin',
            'description' => 'Admin',
            'is_active' => true,
        ]);
        $sellerRole = Role::query()->create([
            'name' => 'seller',
            'description' => 'Legacy seller',
            'is_active' => true,
        ]);
        $permission = Permission::query()->create([
            'name' => 'products.manage',
            'description' => 'Manage products',
            'is_active' => true,
        ]);
        $user = User::query()->create([
            'name' => 'Legacy Seller',
            'email' => 'legacy-seller@example.test',
            'password' => 'password',
            'is_email_verified' => true,
            'is_active' => true,
        ]);

        DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => $sellerRole->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('role_permissions')->insert([
            'role_id' => $sellerRole->id,
            'permission_id' => $permission->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $user->createToken('legacy-seller', ['access-api', 'active-role:seller']);
        $conversationId = DB::table('conversations')->insertGetId([
            'type' => 'announcement',
            'target_role' => 'seller',
            'is_active' => true,
            'created_by' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $migration = require database_path('migrations/2026_11_28_000002_merge_legacy_seller_accounts_into_admin.php');
        $migration->up();

        $this->assertDatabaseHas('user_roles', [
            'user_id' => $user->id,
            'role_id' => $adminRole->id,
        ]);
        $this->assertDatabaseMissing('user_roles', [
            'user_id' => $user->id,
            'role_id' => $sellerRole->id,
        ]);
        $this->assertDatabaseHas('role_permissions', [
            'role_id' => $adminRole->id,
            'permission_id' => $permission->id,
        ]);
        $this->assertDatabaseMissing('role_permissions', ['role_id' => $sellerRole->id]);
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
        ]);
        $this->assertDatabaseHas('conversations', [
            'id' => $conversationId,
            'target_role' => 'admin',
        ]);
        $this->assertFalse((bool) $sellerRole->fresh()->is_active);
        $this->assertNotNull($sellerRole->fresh()->deleted_at);
    }
}
