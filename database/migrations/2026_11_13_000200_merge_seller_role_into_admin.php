<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Fashionku adalah marketplace single-store: `admin` adalah operator tunggal
 * yang sekaligus berperan sebagai penjual. Role `seller` yang diwarisi dari
 * desain multi-store digabung ke `admin`.
 *
 * Migrasi ini:
 *  - memastikan role `admin` ada (bila belum di-seed),
 *  - menempelkan role `admin` ke seluruh user yang masih memakai role `seller`,
 *  - menonaktifkan role `seller`.
 *
 * Middleware/auth tetap menerima `seller` sebagai alias `admin` sehingga token
 * dan rute lama tidak langsung rusak (backward compatible).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('roles') || ! Schema::hasTable('user_roles')) {
            return;
        }

        $now = now();

        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');

        if ($adminRoleId === null) {
            $adminRoleId = DB::table('roles')->insertGetId([
                'name' => 'admin',
                'description' => 'Administrator/pemilik toko Fashionku (operator tunggal)',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        } else {
            DB::table('roles')->where('id', $adminRoleId)->update([
                'is_active' => true,
                'updated_at' => $now,
            ]);
        }

        $sellerRoleId = DB::table('roles')->where('name', 'seller')->value('id');

        if ($sellerRoleId !== null) {
            $sellerUserIds = DB::table('user_roles')
                ->where('role_id', $sellerRoleId)
                ->pluck('user_id')
                ->all();

            $rows = [];

            foreach ($sellerUserIds as $userId) {
                $alreadyAdmin = DB::table('user_roles')
                    ->where('user_id', $userId)
                    ->where('role_id', $adminRoleId)
                    ->exists();

                if ($alreadyAdmin) {
                    continue;
                }

                $rows[] = [
                    'user_id' => $userId,
                    'role_id' => $adminRoleId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if ($rows !== []) {
                DB::table('user_roles')->insert($rows);
            }

            DB::table('roles')->where('id', $sellerRoleId)->update([
                'is_active' => false,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('roles')) {
            return;
        }

        // Hanya mengaktifkan kembali role seller; relasi user tidak dikembalikan
        // karena admin kini merupakan superset seller.
        DB::table('roles')
            ->where('name', 'seller')
            ->update(['is_active' => true, 'updated_at' => now()]);
    }
};
