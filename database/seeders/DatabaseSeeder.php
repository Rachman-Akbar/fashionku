<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Orkestrasi seed Fashionku (single-store fashion marketplace + panel admin).
 *
 * Urutan:
 *  1. role & permission admin/buyer
 *  2. akun demo + profil toko
 *  3. kategori & atribut
 *  4. produk, varian, stok awal, voucher
 *  5. banner promosi
 *  6. pembeli, pesanan realtime, ulasan, mutasi stok
 *  7. data operasional panel admin (notifikasi, help, chat, jadwal, HPP, keuangan)
 *
 * Semua akun demo memakai password FashionDemoSeeder::PASSWORD ('12345678').
 */
final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);
        $this->call(FashionDemoSeeder::class);
        $this->call(FashionCatalogSeeder::class);
        $this->call(FashionProductsSeeder::class);
        $this->call(PromotionSeeder::class);
        $this->call(FashionMarketplaceSeeder::class);
        $this->call(FashionAdminPanelSeeder::class);
    }
}
