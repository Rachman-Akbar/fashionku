<?php

declare(strict_types=1);

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('roles') || ! Schema::hasTable('user_roles')) {
            return;
        }

        DB::transaction(function (): void {
            $sellerRoleId = DB::table('roles')->where('name', 'seller')->value('id');

            if ($sellerRoleId === null) {
                return;
            }

            $adminRoleId = DB::table('roles')
                ->where('name', 'admin')
                ->value('id');

            if ($adminRoleId === null) {
                $adminRoleId = DB::table('roles')->insertGetId([
                    'name' => 'admin',
                    'description' => 'Administrator Fashionku',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('roles')->where('id', $adminRoleId)->update([
                    'is_active' => true,
                    'deleted_at' => null,
                    'updated_at' => now(),
                ]);
            }

            $sellerUserIds = DB::table('user_roles')
                ->where('role_id', $sellerRoleId)
                ->pluck('user_id');

            foreach ($sellerUserIds as $userId) {
                DB::table('user_roles')->updateOrInsert(
                    ['user_id' => $userId, 'role_id' => $adminRoleId],
                    ['created_at' => now(), 'updated_at' => now()],
                );
            }

            if (Schema::hasTable('role_permissions')) {
                $permissionIds = DB::table('role_permissions')
                    ->where('role_id', $sellerRoleId)
                    ->pluck('permission_id');

                foreach ($permissionIds as $permissionId) {
                    DB::table('role_permissions')->updateOrInsert(
                        ['role_id' => $adminRoleId, 'permission_id' => $permissionId],
                        ['created_at' => now(), 'updated_at' => now()],
                    );
                }

                DB::table('role_permissions')->where('role_id', $sellerRoleId)->delete();
            }

            DB::table('user_roles')->where('role_id', $sellerRoleId)->delete();

            if (Schema::hasTable('personal_access_tokens') && $sellerUserIds->isNotEmpty()) {
                DB::table('personal_access_tokens')
                    ->where('tokenable_type', User::class)
                    ->whereIn('tokenable_id', $sellerUserIds)
                    ->delete();
            }

            DB::table('roles')->where('id', $sellerRoleId)->update([
                'is_active' => false,
                'deleted_at' => now(),
                'updated_at' => now(),
            ]);

            if (Schema::hasTable('conversations')) {
                DB::table('conversations')
                    ->where('target_role', 'seller')
                    ->update(['target_role' => 'admin', 'updated_at' => now()]);
            }
        });
    }

    public function down(): void
    {
        // Seller accounts are promoted to admin; demoting them would restore
        // elevated legacy access and could lock migrated users out.
    }
};
