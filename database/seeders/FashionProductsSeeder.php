<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Produk fashion demo: pakaian, alas kaki, tas, aksesori — lengkap dengan
 * varian ukuran/warna, harga, stok, gambar, banner, dan voucher.
 */
final class FashionProductsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Fashionku: membuat produk & varian fashion...');

        $now = now()->toDateTimeString();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');
        $storeId = (int) DB::table('stores')->whereNull('deleted_at')->orderBy('id')->value('id');

        if ($storeId <= 0) {
            $this->command?->warn('Toko utama tidak ditemukan, produk demo dilewati.');

            return;
        }

        $leafIds = DB::table('categories')->pluck('id', 'slug');

        // [nama, slug, kategori, brand, deskripsi, harga, [(varian, harga, stok)], diskon?, featured?]
        $products = [
            ['Kaos Polos Cotton Combed 30s', 'kaos-polos-cotton-combed', 'kaos', 'Fashionku Basic',
                'Kaos polos bahan cotton combed 30s yang adem dan nyaman seharian. Jahitan rapi, tidak mudah melar.',
                89000, [['Putih / M', 89000, 40], ['Putih / L', 89000, 35], ['Hitam / M', 89000, 45], ['Hitam / L', 89000, 30], ['Navy / XL', 95000, 25]], true, true],
            ['Kemeja Flannel Pria Premium', 'kemeja-flannel-pria', 'kemeja', 'Northline',
                'Kemeja flannel lembut dengan motif kotak klasik. Cocok untuk kasual maupun semi-formal.',
                179000, [['Merah / M', 179000, 20], ['Merah / L', 179000, 18], ['Biru / M', 179000, 22], ['Biru / L', 179000, 15]], false, true],
            ['Jaket Denim Oversize', 'jaket-denim-oversize', 'jaket', 'Urban Ridge',
                'Jaket denim washed dengan potongan oversize modern. Bahan tebal namun tetap fleksibel.',
                299000, [['Blue Denim / M', 299000, 12], ['Blue Denim / L', 299000, 10], ['Black Denim / L', 299000, 8]], true, true],
            ['Celana Chino Slim Fit', 'celana-chino-slim', 'celana-pria', 'Northline',
                'Chino cotton-stretch slim fit dengan pinggang nyaman. Tersedia warna netral favorit pria.',
                199000, [['Khaki / 30', 199000, 15], ['Khaki / 32', 199000, 18], ['Navy / 32', 199000, 14], ['Hitam / 34', 199000, 10]], false, false],
            ['Dress Linen Summer', 'dress-linen-summer', 'dress', 'Luna Atelier',
                'Dress linen ringan dengan siluet flowy. Perfect untuk cuaca panas dan liburan.',
                249000, [['Krem / S', 249000, 12], ['Krem / M', 249000, 15], ['Sage / M', 249000, 10], ['Sage / L', 249000, 8]], true, true],
            ['Blus Ruffle Satin', 'blus-ruffle-satin', 'blus', 'Luna Atelier',
                'Blus satin elegan dengan aksen ruffle di bagian lengan. Cocok untuk acara maupun kerja.',
                189000, [['Ivory / S', 189000, 10], ['Ivory / M', 189000, 12], ['Champagne / M', 189000, 9]], false, false],
            ['Rok Plisket Midi', 'rok-plisket-midi', 'rok', 'Luna Atelier',
                'Rok plisket midi dengan bahan jatuh dan nyaman. Mid-rise, zip samping.',
                159000, [['Hitam / S', 159000, 14], ['Hitam / M', 159000, 16], ['Mocca / M', 159000, 11]], false, true],
            ['Sneakers Canvas Unisex', 'sneakers-canvas-unisex', 'sepatu', 'Stride Co.',
                'Sneakers canvas klasik dengan sol karet anti selip. Ringan untuk harian.',
                219000, [['Putih / 39', 219000, 10], ['Putih / 40', 219000, 12], ['Putih / 41', 219000, 14], ['Hitam / 42', 219000, 9]], true, true],
            ['Tas Ransel Katun Vintage', 'tas-ransel-katun-vintage', 'tas-ransel', 'Wander Bag',
                'Tas ransel katun canvas dengan kompartemen laptop 14 inci. Cocok kerja & kuliah.',
                259000, [['Khaki', 259000, 12], ['Army', 259000, 10], ['Black', 259000, 11]], false, false],
            ['Jam Tangan Minimalis Unisex', 'jam-tangan-minimalis', 'jam-tangan', 'Chrono Lite',
                'Jam tangan minimalis dengan dial bersih, strap kulit, dan ketahanan air 3 ATM.',
                349000, [['Silver / Hitam', 349000, 8], ['Gold / Cokelat', 349000, 7]], false, true],
        ];

        $variantList = [];
        foreach ($products as $index => [$name, $slug, $catSlug, $brand, $description, $basePrice, $variants, $discounted, $featured]) {
            $categoryId = $leafIds[$catSlug] ?? null;

            $productId = DB::table('products')->insertGetId([
                'store_id' => $storeId,
                'primary_category_id' => $categoryId,
                'name' => $name,
                'slug' => 'fashionku-'.$slug,
                'description' => $description."\n\nDikemas rapi dengan bubble wrap. Pesanan diproses 1x24 jam kerja.",
                'brand' => $brand,
                'thumbnail' => 'https://picsum.photos/seed/fku-'.$slug.'/600/600',
                'status' => 'published',
                'is_active' => true,
                'allows_preorder' => false,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $isDefault = true;
            $vi = 1;
            foreach ($variants as [$vName, $price, $stock]) {
                $priceOriginal = $discounted ? (int) round($price * 1.2, -2) : null;
                $priceSale = $discounted ? $price : null;
                $code = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', (string) $vi), 0, 4));
                $sku = 'FKU-'.strtoupper(substr($slug, 0, 6)).'-'.sprintf('%02d', $vi).$code;

                $variantId = DB::table('product_variants')->insertGetId([
                    'product_id' => $productId,
                    'store_id' => $storeId,
                    'sku' => $sku,
                    'name' => $vName,
                    'price' => $price,
                    'price_original' => $priceOriginal,
                    'price_sale' => $priceSale,
                    'stock' => $stock,
                    'po_stock' => 0,
                    'stock_reserved' => 0,
                    'stock_booked' => 0,
                    'stock_preorder' => 0,
                    'max_order_qty' => max(3, (int) floor($stock / 3)),
                    'min_stock' => 3,
                    'is_default' => $isDefault,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $isDefault = false;
                $vi++;

                $variantList[] = ['product_id' => $productId, 'variant_id' => $variantId, 'store_id' => $storeId, 'stock' => $stock, 'name' => $name.' - '.$vName];
            }

            $images = [
                ['fku-'.$slug.'-1', 'Foto utama '.$name, 1, 1],
                ['fku-'.$slug.'-2', 'Foto detail '.$name, 0, 2],
                ['fku-'.$slug.'-3', 'Foto lain '.$name, 0, 3],
            ];
            foreach ($images as [$seed, $alt, $isPrimary, $sort]) {
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'url' => 'https://picsum.photos/seed/'.$seed.'/800/800',
                    'alt_text' => $alt,
                    'is_primary' => $isPrimary,
                    'sort_order' => $sort,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            if ($categoryId) {
                DB::table('product_categories')->insert([
                    'product_id' => $productId,
                    'category_id' => $categoryId,
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        // ── Riwayat stok awal ───────────────────────────────────────────────
        foreach ($variantList as $v) {
            DB::table('stock_movements')->insert([
                'store_id' => $v['store_id'],
                'product_id' => $v['product_id'],
                'variant_id' => $v['variant_id'],
                'movement_key' => 'INIT-'.$v['variant_id'],
                'type' => 'initial',
                'quantity_delta' => (int) $v['stock'],
                'balance_after' => (int) $v['stock'],
                'notes' => 'Penyesuaian awal stok demo Fashionku',
                'occurred_at' => $now,
                'created_by' => $actorId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── Voucher ─────────────────────────────────────────────────────────
        $vouchers = [
            ['WELCOME20', 'Voucher Sambutan Fashionku', 'product', 'fixed', 20000, 150000, null, 500, 'platform', null],
            ['GRATISONGKIR', 'Gratis Ongkir Se-Indonesia', 'shipping', 'fixed', 15000, 100000, 15000, 300, 'platform', null],
            ['FKU10', 'Diskon Koleksi Fashionku', 'product', 'percentage', 10, 200000, 50000, 200, 'store', $storeId],
        ];

        foreach ($vouchers as [$code, $vname, $target, $type, $value, $minSpend, $maxDiscount, $limit, $scope, $vstoreId]) {
            DB::table('vouchers')->insert([
                'store_id' => $vstoreId,
                'voucher_scope' => $scope,
                'code' => $code,
                'name' => $vname,
                'image' => 'https://picsum.photos/seed/voucher-'.strtolower($code).'/400/240',
                'discount_target' => $target,
                'discount_type' => $type,
                'discount_value' => $value,
                'min_spend' => $minSpend,
                'min_items' => 1,
                'min_distinct_products' => 1,
                'terms' => 'Berlaku untuk pembelian di Fashionku selama masa promo. Tidak dapat digabungkan voucher lain.',
                'max_discount' => $maxDiscount,
                'starts_at' => now()->subDays(30)->toDateTimeString(),
                'ends_at' => now()->addDays(90)->toDateTimeString(),
                'usage_limit' => $limit,
                'used_count' => 0,
                'is_active' => true,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command?->info('Fashionku: '.count($products).' produk, '.count($variantList).' varian, '.count($vouchers).' voucher selesai.');
    }
}
