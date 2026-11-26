<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
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
    /**
     * Gambar kategori khusus level 3 (kategori daun). Level 1 dan 2 tidak
     * menyimpan gambar karena form gambar hanya muncul untuk level 3; ikon
     * tetap boleh diisi di semua level lewat admin panel. Foto level 3 diambil
     * dari pool Unsplash yang sama dengan FashionProductsSeeder agar kategori
     * dan produknya selaras.
     */
    private const CATEGORY_IMAGES = [
        // Level 3
        'kaos' => '1521572163474-6864f9cf17ab',
        'kemeja' => '1552374196-1ab2a1c593e8',
        'jaket' => '1551028719-00167b16eac5',
        'celana-pria' => '1541099649105-f69ad21f3246',
        'dress' => '1515372039744-b8f02a3ae446',
        'blus' => '1485968579580-b6d095142e6e',
        'rok' => '1487222477894-8943e31ef7b2',
        'outer-wanita' => '1434389677669-e08b4cac3105',
        'sepatu' => '1460353581641-37baddab0fa2',
        'sandal' => '1543163521-1bf539c55dd2',
        'tas-ransel' => '1622560480605-d83c853bc5c3',
        'tas-selempang' => '1475180098004-ca77a66827be',
        'dompet' => '1548036328-c9fa89d128fa',
        'jam-tangan' => '1523170335258-f5ed11844a49',
        'kacamata' => '1511499767150-a48a237f0083',
        'perhiasan' => '1515562141207-7a88fb7ce338',
    ];

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
                        imageUrl: $this->imageUrlFor($leafSlug),
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

        // Seeder menulis langsung ke tabel, sedangkan daftar kategori di admin
        // dibaca dari cache. Bersihkan agar gambar baru langsung terlihat.
        foreach ([
            'catalog_categories_tree_rows_manage_v4',
            'catalog_categories_tree_rows_active_v4',
            'catalog_categories_menu_rows_active_v4',
        ] as $cacheKey) {
            Cache::forget($cacheKey);
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
        ?string $imageUrl = null,
    ): int {
        // Saat seeder dijalankan ulang, jangan buat duplikat kategori: isi
        // gambar yang belum ada pada baris dengan full_slug yang sama.
        $existingId = DB::table('categories')->where('full_slug', $fullSlug)->value('id');

        if ($existingId !== null) {
            // Rapikan level/parent bila data lama pernah bergeser, dan pastikan
            // hanya kategori level 3 yang menyimpan gambar.
            $updates = [
                'parent_id' => $parentId,
                'parent_scope_id' => $parentId ?? 0,
                'level' => $level,
                'full_slug' => $fullSlug,
                'updated_at' => $now,
            ];

            DB::table('categories')->where('id', $existingId)->update($updates);

            if ($level === 3) {
                if ($imageUrl !== null) {
                    DB::table('categories')
                        ->where('id', $existingId)
                        ->whereNull('image_url')
                        ->update(['image_url' => $imageUrl, 'updated_at' => $now]);
                }
            } else {
                DB::table('categories')
                    ->where('id', $existingId)
                    ->whereNotNull('image_url')
                    ->update(['image_url' => null, 'updated_at' => $now]);
            }

            return (int) $existingId;
        }

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
            'image_url' => $level === 3 ? $imageUrl : null,
            'icon_url' => null,
            'created_by' => $actorId,
            'updated_by' => $actorId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    private function imageUrlFor(string $slug): ?string
    {
        $id = self::CATEGORY_IMAGES[$slug] ?? null;

        return $id === null
            ? null
            : sprintf('https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=600&h=600&q=80', $id);
    }
}
