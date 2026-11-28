<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Services;

use Illuminate\Support\Facades\DB;

/**
 * Penjaga invarian data pelanggan:
 *
 * 1. Satu user hanya punya tepat satu baris `seller_customers` (juga dijaga
 *    unique index pada kolom `user_id`), sehingga provisioning selalu
 *    "insert jika belum ada" dan tidak pernah menggandakan baris.
 * 2. Setiap baris pelanggan dibuat untuk user dengan role buyer. Provisioner
 *    hanya dipanggil pada jalur pembuatan user buyer (registrasi, admin,
 *    import, maupun simpan biodata).
 *
 * Baris yang sudah ada sengaja TIDAK dihapus saat role berubah (keputusan
 * produk): data pelanggan dipertahankan, hanya perannya sebagai pembeli yang
 * berubah.
 */
final class CustomerRecordProvisioner
{
    public function __construct(private readonly CustomerCodeGenerator $codes) {}

    /**
     * Buat baris pelanggan untuk user bila belum ada.
     *
     * @return bool true bila baris baru dibuat
     */
    public function ensureForBuyer(string $userId, ?string $name = null): bool
    {
        if ($userId === '') {
            return false;
        }

        if (DB::table('seller_customers')->where('user_id', $userId)->exists()) {
            return false;
        }

        $name = trim((string) $name);

        if ($name === '') {
            $name = trim((string) DB::table('users')->where('id', $userId)->value('name'));
        }

        $actorId = auth()->id();

        DB::table('seller_customers')->insert([
            'user_id' => $userId,
            'code' => $this->codes->generate($name),
            'note' => null,
            'created_by' => $actorId,
            'updated_by' => $actorId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return true;
    }

    public function assignBuyerRole(string $userId): void
    {
        $roleId = DB::table('roles')
            ->where('name', 'buyer')
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if ($roleId === null) {
            $roleId = DB::table('roles')->where('name', 'buyer')->value('id');

            if ($roleId !== null) {
                DB::table('roles')->where('id', $roleId)->update([
                    'is_active' => true,
                    'deleted_at' => null,
                    'updated_at' => now(),
                ]);
            } else {
                $roleId = DB::table('roles')->insertGetId([
                    'name' => 'buyer',
                    'description' => 'Role buyer',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        DB::table('user_roles')->updateOrInsert(
            ['user_id' => $userId, 'role_id' => $roleId],
            ['created_at' => now(), 'updated_at' => now()]
        );
    }

    /**
     * Sama dengan ensureForBuyer(), tetapi hanya membuat baris bila user
     * benar-benar memegang role buyer. Dipakai pada jalur yang tidak tahu
     * peran user (mis. resolusi pelanggan pada order manual), supaya data
     * pelanggan tidak pernah menunjuk user non-buyer.
     */
    public function ensureForBuyerIfEligible(string $userId, ?string $name = null): bool
    {
        if ($userId === '' || ! $this->isBuyer($userId)) {
            return false;
        }

        return $this->ensureForBuyer($userId, $name);
    }

    private function isBuyer(string $userId): bool
    {
        return DB::table('user_roles')
            ->where('user_id', $userId)
            ->whereIn(
                'role_id',
                DB::table('roles')
                    ->where('name', 'buyer')
                    ->where('is_active', true)
                    ->whereNull('deleted_at')
                    ->select('id')
            )
            ->exists();
    }
}
