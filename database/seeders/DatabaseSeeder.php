<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Orkestrasi seed Fashionku (single-store fashion marketplace).
 *
 * Urutan: (1) role & permission seller/buyer, (2) akun demo + toko utama,
 * (3) katalog fashion, (4) produk/varian/banner/voucher.
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
        $this->call(FashionRealDataSeeder::class);
    }
}
