<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('promotions')) {
            return;
        }

        $now = now();
        $rows = [
            [
                'name' => 'Promo Koleksi Terbaru',
                'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/search',
                'sort_order' => 1,
            ],
            [
                'name' => 'Diskon Fashion Pria & Wanita',
                'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/search',
                'sort_order' => 2,
            ],
            [
                'name' => 'Gratis Ongkir Pilihan',
                'image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/promotions',
                'sort_order' => 3,
            ],
            [
                'name' => 'Gaya Outfit Harian',
                'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/search',
                'sort_order' => 4,
            ],
            [
                'name' => 'Aksesoris & Pelengkap Fashion',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
                'mobile_image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
                'click_action' => 'url',
                'target_id' => null,
                'target_url' => '/promotions',
                'sort_order' => 5,
            ],
        ];

        foreach ($rows as $row) {
            $payload = array_merge($row, [
                'store_id' => null,
                'promotion_payment_id' => null,
                'is_active' => true,
                'approval_status' => 'approved',
                'rejection_reason' => null,
                'submitted_at' => $now,
                'approved_at' => $now,
                'approved_by' => null,
                'created_by' => null,
                'updated_by' => null,
                'updated_at' => $now,
            ]);

            $existing = DB::table('promotions')->where('name', $row['name'])->first();
            if ($existing) {
                DB::table('promotions')->where('id', $existing->id)->update($payload);
            } else {
                $payload['created_at'] = $now;
                DB::table('promotions')->insert($payload);
            }
        }
    }
}
