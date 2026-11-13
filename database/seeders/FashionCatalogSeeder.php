<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Katalog Fashionku: kategori fashion hierarkis 3 level (level 1 = root,
 * level 2 & 3 = turunan), atribut (ukuran/warna/material), serta konfigurasi
 * biaya layanan per kategori.
 *
 * CatalogGroup dihapus: kategori kini murni hierarkis via `parent_id`.
 */
final class FashionCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Fashionku: membuat katalog fashion...');

        $now = now()->toDateTimeString();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');

        // ── Kategori fashion (root -> sub -> leaf) ─────────────────────────
        // [slug root, nama root, [slug sub, nama sub, [slug leaf => nama leaf]]]
        $tree = [
            ['pakaian', 'Pakaian', [
                ['pakaian-pria', 'Pakaian Pria', [
                    'kaos' => 'Kaos',
                    'kemeja' => 'Kemeja',
                    'jaket' => 'Jaket',
                    'celana-pria' => 'Celana',
                ]],
                ['pakaian-wanita', 'Pakaian Wanita', [
                    'dress' => 'Dress',
                    'blus' => 'Blus & Atasan',
                    'rok' => 'Rok',
                    'outer-wanita' => 'Outerwear',
                ]],
            ]],
            ['gaya-hidup', 'Gaya Hidup', [
                ['alas-kaki', 'Alas Kaki', [
                    'sepatu' => 'Sepatu',
                    'sandal' => 'Sandal',
                ]],
                ['tas', 'Tas', [
                    'tas-ransel' => 'Tas Ransel',
                    'tas-selempang' => 'Tas Selempang',
                    'dompet' => 'Dompet',
                ]],
                ['aksesori', 'Aksesori', [
                    'jam-tangan' => 'Jam Tangan',
                    'kacamata' => 'Kacamata',
                    'perhiasan' => 'Perhiasan',
                ]],
            ]],
        ];

        $leafIds = [];
        $categoryCount = 0;

        foreach ($tree as [$rootSlug, $rootName, $subs]) {
            $rootId = $this->insertCategory(
                parentId: null,
                level: 1,
                slug: $rootSlug,
                fullSlug: $rootSlug,
                name: $rootName,
                sortOrder: 10,
                actorId: $actorId,
                now: $now,
            );
            $categoryCount++;

            $subSort = 10;
            foreach ($subs as [$subSlug, $subName, $leaves]) {
                $subFullSlug = $rootSlug.'/'.$subSlug;
                $subId = $this->insertCategory(
                    parentId: $rootId,
                    level: 2,
                    slug: $subSlug,
                    fullSlug: $subFullSlug,
                    name: $subName,
                    sortOrder: $subSort,
                    actorId: $actorId,
                    now: $now,
                );
                $categoryCount++;
                $subSort += 10;

                $leafSort = 10;
                foreach ($leaves as $leafSlug => $leafName) {
                    $leafFullSlug = $subFullSlug.'/'.$leafSlug;
                    $leafIds[$leafSlug] = $this->insertCategory(
                        parentId: $subId,
                        level: 3,
                        slug: $leafSlug,
                        fullSlug: $leafFullSlug,
                        name: $leafName,
                        sortOrder: $leafSort,
                        actorId: $actorId,
                        now: $now,
                    );
                    $categoryCount++;
                    $leafSort += 10;
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

        $this->command?->info('Fashionku: katalog selesai — '.$categoryCount.' kategori, '.count($leafIds).' leaf, '.count($attributes).' atribut.');
    }

    private function insertCategory(
        ?int $parentId,
        int $level,
        string $slug,
        string $fullSlug,
        string $name,
        int $sortOrder,
        ?string $actorId,
        string $now,
    ): int {
        return DB::table('categories')->insertGetId([
            'parent_id' => $parentId,
            'parent_scope_id' => $parentId ?? 0,
            'level' => $level,
            'sort_order' => $sortOrder,
            'is_active' => true,
            'is_visible_in_menu' => true,
            'name' => $name,
            'slug' => $slug,
            'full_slug' => $fullSlug,
            'image_url' => null,
            'icon_url' => null,
            'created_by' => $actorId,
            'updated_by' => $actorId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
