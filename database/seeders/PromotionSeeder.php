<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Banner promosi yang tampil di beranda. Promosi yang disimpan langsung aktif.
 * Target promosi memakai kategori/produk yang benar-benar ada di katalog.
 */
final class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');

        $categories = DB::table('categories')->pluck('id', 'slug');
        $products = DB::table('products')
            ->where('status', 'published')
            ->orderByDesc('created_at')
            ->limit(30)
            ->pluck('id', 'slug');

        $productId = static fn (string $slug): ?int => isset($products['fashionku-'.$slug])
            ? (int) $products['fashionku-'.$slug]
            : null;

        $rows = [
            [
                'name' => 'Koleksi Baru Desember',
                'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'category',
                'target_id' => $categories['pakaian'] ?? null,
                'target_url' => null,
                'sort_order' => 1,
            ],
            [
                'name' => 'Diskon Dress & Blus Wanita',
                'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'category',
                'target_id' => $categories['pakaian-wanita'] ?? null,
                'target_url' => null,
                'sort_order' => 2,
            ],
            [
                'name' => 'Gratis Ongkir di Atas 300RB',
                'image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/promotions',
                'sort_order' => 3,
            ],
            [
                'name' => 'Sneakers & Sepatu Pilihan',
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'category',
                'target_id' => $categories['sepatu'] ?? null,
                'target_url' => null,
                'sort_order' => 4,
            ],
            [
                'name' => 'Batik Nusantara Pilihan',
                'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'product',
                'target_id' => $productId('kemeja-batik-lengan-panjang-parang'),
                'target_url' => null,
                'sort_order' => 5,
            ],
            [
                'name' => 'Flash Sale Tas & Dompet',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'category',
                'target_id' => $categories['tas'] ?? null,
                'target_url' => null,
                'sort_order' => 6,
            ],
            [
                'name' => 'Promo Payday Akhir Bulan',
                'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/promotions',
                'sort_order' => 7,
            ],
            [
                'name' => 'Promo Kemeja Kerja',
                'image_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'category',
                'target_id' => $categories['kemeja'] ?? null,
                'target_url' => null,
                'sort_order' => 8,
            ],
        ];

        foreach ($rows as $index => $row) {
            $createdAt = $now->copy()->subHours(30 - $index * 2);

            $payload = [
                'image_url' => $row['image_url'],
                'mobile_image_url' => $row['mobile_image_url'],
                'click_action' => $row['click_action'],
                'target_id' => $row['target_id'],
                'target_url' => $row['target_url'],
                'sort_order' => $row['sort_order'],
                'is_active' => true,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'updated_at' => $now->toDateTimeString(),
            ];

            $existing = DB::table('promotions')->where('name', $row['name'])->first();

            if ($existing) {
                DB::table('promotions')->where('id', $existing->id)->update($payload);
            } else {
                DB::table('promotions')->insert([
                    ...$payload,
                    'name' => $row['name'],
                    'created_at' => $createdAt->toDateTimeString(),
                ]);
            }
        }
    }
}
