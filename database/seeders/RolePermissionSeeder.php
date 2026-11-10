<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Role & permission untuk Fashionku (single-store, dua role bisnis: seller & buyer).
 */
final class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $permissions = [
            ['name' => 'products.manage', 'description' => 'Mengelola produk dan varian', 'is_active' => true],
            ['name' => 'banners.manage', 'description' => 'Mengelola banner toko', 'is_active' => true],
            ['name' => 'promotions.manage', 'description' => 'Mengelola promosi toko', 'is_active' => true],
            ['name' => 'vouchers.manage', 'description' => 'Mengelola voucher toko', 'is_active' => true],
            ['name' => 'orders.view', 'description' => 'Melihat pesanan', 'is_active' => true],
            ['name' => 'orders.manage', 'description' => 'Mengelola pesanan', 'is_active' => true],
            ['name' => 'checkout.create', 'description' => 'Membuat checkout', 'is_active' => true],
            ['name' => 'reports.export', 'description' => 'Mengekspor laporan', 'is_active' => true],
            ['name' => 'finance.manage', 'description' => 'Mengelola keuangan toko', 'is_active' => true],
            ['name' => 'stock.manage', 'description' => 'Mengelola stok dan riwayat pergerakan barang', 'is_active' => true],
            ['name' => 'tickets.create', 'description' => 'Membuat dan membalas Help', 'is_active' => true],
            ['name' => 'tickets.manage', 'description' => 'Mengelola seluruh Help', 'is_active' => true],
            ['name' => 'reviews.create', 'description' => 'Membuat dan mengelola review milik sendiri', 'is_active' => true],
            ['name' => 'reviews.manage', 'description' => 'Memoderasi seluruh review produk', 'is_active' => true],
            ['name' => 'chat.use', 'description' => 'Menggunakan percakapan', 'is_active' => true],
            ['name' => 'announcements.manage', 'description' => 'Mengirim announcement', 'is_active' => true],
        ];

        DB::table('permissions')->upsert(
            array_map(fn (array $permission): array => [
                ...$permission,
                'created_at' => $now,
                'updated_at' => $now,
            ], $permissions),
            ['name'],
            ['description', 'is_active', 'updated_at']
        );

        $roles = [
            ['name' => 'seller', 'description' => 'Pengelola toko Fashionku', 'is_active' => true],
            ['name' => 'buyer', 'description' => 'Pembeli Fashionku', 'is_active' => true],
        ];

        DB::table('roles')->upsert(
            array_map(fn (array $role): array => [
                ...$role,
                'created_at' => $now,
                'updated_at' => $now,
            ], $roles),
            ['name'],
            ['description', 'is_active', 'updated_at']
        );

        // Nonaktifkan role lama yang diwarisi dari marketplace multi-store.
        DB::table('roles')
            ->whereNotIn('name', ['seller', 'buyer'])
            ->update(['is_active' => false, 'updated_at' => $now]);

        $roleIds = DB::table('roles')->pluck('id', 'name');
        $permissionIds = DB::table('permissions')->pluck('id', 'name');

        $assignments = [
            'seller' => [
                'products.manage',
                'banners.manage',
                'promotions.manage',
                'vouchers.manage',
                'orders.view',
                'orders.manage',
                'reports.export',
                'finance.manage',
                'stock.manage',
                'tickets.create',
                'tickets.manage',
                'reviews.create',
                'reviews.manage',
                'chat.use',
            ],
            'buyer' => [
                'orders.view',
                'checkout.create',
                'tickets.create',
                'reviews.create',
                'chat.use',
            ],
        ];

        foreach ($assignments as $roleName => $permissionNames) {
            $roleId = $roleIds[$roleName] ?? null;

            if (! $roleId) {
                continue;
            }

            $rows = collect($permissionNames)
                ->filter(fn (string $name): bool => isset($permissionIds[$name]))
                ->map(fn (string $name): array => [
                    'role_id' => $roleId,
                    'permission_id' => $permissionIds[$name],
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->all();

            DB::table('role_permissions')->where('role_id', $roleId)->delete();

            if ($rows !== []) {
                DB::table('role_permissions')->insert($rows);
            }
        }
    }
}
