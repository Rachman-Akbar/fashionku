<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Katalog Fashionku: catalog group, kategori fashion, atribut (ukuran/warna/material),
 * serta konfigurasi biaya layanan per kategori.
 */
final class FashionCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Fashionku: membuat katalog fashion...');

        $now = now()->toDateTimeString();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');

        // ── Catalog groups ──────────────────────────────────────────────────
        $groups = [
            ['Pakaian', 'pakaian', 10],
            ['Gaya Hidup', 'gaya-hidup', 20],
        ];

        $groupIds = [];
        foreach ($groups as [$name, $slug, $sort]) {
            $groupIds[$slug] = DB::table('catalog_groups')->insertGetId([
                'name' => $name,
                'slug' => $slug,
                'is_active' => true,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── Kategori fashion (akar -> anak) ────────────────────────────────
        $tree = [
            'pakaian' => [
                'pakaian-pria' => ['Pakaian Pria', 'pakaian-pria', [
                    'kaos' => 'Kaos',
                    'kemeja' => 'Kemeja',
                    'jaket' => 'Jaket',
                    'celana-pria' => 'Celana',
                ]],
                'pakaian-wanita' => ['Pakaian Wanita', 'pakaian-wanita', [
                    'dress' => 'Dress',
                    'blus' => 'Blus & Atasan',
                    'rok' => 'Rok',
                    'outer-wanita' => 'Outerwear',
                ]],
            ],
            'gaya-hidup' => [
                'alas-kaki' => ['Alas Kaki', 'alas-kaki', [
                    'sepatu' => 'Sepatu',
                    'sandal' => 'Sandal',
                ]],
                'tas' => ['Tas', 'tas', [
                    'tas-ransel' => 'Tas Ransel',
                    'tas-selempang' => 'Tas Selempang',
                    'dompet' => 'Dompet',
                ]],
                'aksesori' => ['Aksesori', 'aksesori', [
                    'jam-tangan' => 'Jam Tangan',
                    'kacamata' => 'Kacamata',
                    'perhiasan' => 'Perhiasan',
                ]],
            ],
        ];

        $leafIds = [];
        foreach ($tree as $groupSlug => $roots) {
            $groupId = $groupIds[$groupSlug];
            $sort = 10;

            foreach ($roots as $rootSlug => [$rootName, $rootSlugName, $children]) {
                $rootId = DB::table('categories')->insertGetId([
                    'catalog_group_id' => $groupId,
                    'parent_id' => null,
                    'parent_scope_id' => 0,
                    'level' => 1,
                    'sort_order' => $sort,
                    'is_active' => true,
                    'is_visible_in_menu' => true,
                    'name' => $rootName,
                    'slug' => $rootSlugName,
                    'full_slug' => $rootSlugName,
                    'image_url' => null,
                    'icon_url' => null,
                    'created_by' => $actorId,
                    'updated_by' => $actorId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $sort += 10;

                $childSort = 10;
                foreach ($children as $childSlug => $childName) {
                    $leafIds[$childSlug] = DB::table('categories')->insertGetId([
                        'catalog_group_id' => $groupId,
                        'parent_id' => $rootId,
                        'parent_scope_id' => $rootId,
                        'level' => 2,
                        'sort_order' => $childSort,
                        'is_active' => true,
                        'is_visible_in_menu' => true,
                        'name' => $childName,
                        'slug' => $childSlug,
                        'full_slug' => $rootSlugName.'/'.$childSlug,
                        'image_url' => null,
                        'icon_url' => null,
                        'created_by' => $actorId,
                        'updated_by' => $actorId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $childSort += 10;
                }
            }
        }

        // ── Atribut fashion ─────────────────────────────────────────────────
        $attributes = [
            ['name' => 'Ukuran', 'slug' => 'ukuran'],
            ['name' => 'Warna', 'slug' => 'warna'],
            ['name' => 'Material', 'slug' => 'material'],
        ];

        foreach ($attributes as $attr) {
            DB::table('product_attributes')->insertOrIgnore([
                'name' => $attr['name'],
                'slug' => $attr['slug'],
                'type' => 'select',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── Biaya layanan per kategori (komisi platform) ────────────────────
        foreach ($leafIds as $slug => $categoryId) {
            DB::table('admin_fee_configs')->insert([
                'category_id' => $categoryId,
                'name' => 'Biaya layanan '.ucfirst(str_replace('-', ' ', $slug)),
                'code' => 'fee-'.$slug,
                'percentage' => 2.5,
                'fixed_amount' => 0,
                'min_fee' => 500,
                'max_fee' => 25000,
                'is_active' => true,
                'description' => 'Biaya layanan platform untuk transaksi kategori ini.',
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command?->info('Fashionku: katalog selesai — '.count($groupIds).' group, '.count($leafIds).' kategori, '.count($attributes).' atribut.');
    }
}
