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
}
