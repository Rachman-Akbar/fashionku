<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Isi seluruh tabel dengan data realistik (100 baris per tabel) untuk testing manual.
 * Data dipilih untuk mencerminkan toko fashion Indonesia yang nyata: nama, kota,
 * produk fashion, harga Rupiah, dan alamat Indonesia.
 *
 * Password semua user: 12345678
 *
 * Catatan: Tabel yang menggunakan $table->id() (auto-increment integer) tidak
 * diberi nilai 'id' secara manual; MySQL akan generate-nya. Tabel yang menggunakan
 * UUID diberi nilai 'id' berupa (string) Str::uuid().
 */
final class FashionRealDataSeeder extends Seeder
{
    public const PASSWORD = '12345678';

    public const INDONESIAN_FIRST_NAMES = [
        'Andi','Budi','Citra','Dedi','Eka','Farhan','Gita','Hari','Indira','Joko',
        'Kira','Lina','Maya','Nina','Oki','Putri','Rina','Sari','Tina','Umar',
        'Vera','Wati','Yudi','Zara','Adi','Bella','Chandra','Dewi','Eko','Fiona',
        'Gilang','Hana','Irawan','Juna','Kirana','Lintang','Mira','Nadia','Olivia','Paijo',
        'Qori','Raka','Siti','Tegar','Umaira','Vania','Wira','Xandra','Yanti','Zaki',
        'Alya','Bambang','Cahyo','Dina','Edi','Fadhil','Gunawan','Hari','Ika','Joko',
        'Kusuma','Lestari','Mami','Nurul','Oskar','Putri','Rizal','Surya','Tuti','Ulya',
        'Venny','Wulan','Xenia','Yoga','Zora','Agus','Budi','Candra','Dwi','Eka',
        'Fajri','Galih','Hera','Ika','Joko','Kiki','Lia','Maya','Novi','Oka',
        'Putra','Qonit','Riana','Santi','Tono','Uma','Vera','Wina','Xavi','Yuna',
        'Ahmad','Beni','Cici','Deni','Enny','Farel','Genta','Hesti','Iman','Joko',
        'Karina','Luka','Mira','Nanda','Opan','Putri','Rina','Sari','Tina','Udin',
        'Vera','Widy','Xenia','Yuni','Zaki','Ani','Bimo','Caca','Dedi','Evi',
        'Fathan','Gina','Hari','Intan','Joko','Kina','Linda','Miko','Nina','Oki',
        'Putra','Qisya','Rika','Siti','Tia','Umair','Vania','Wulan','Xenia','Yoga',
        'Zara','Andre','Bella','Coco','Dara','Elsa','Faisal','Gaby','Hani','Ika',
        'Joni','Kaka','Lala','Mita','Nina','Odi','Pia','Qori','Rara','Susi',
        'Tomi','Umaira','Vina','Wawan','Xena','Yudi','Zara'
    ];

    public const INDONESIAN_LAST_NAMES = [
        'Pratama','Putra','Wijaya','Saputra','Kusma','Hidayat','Nugroho','Prasetya','Arifin','Setiawan',
        'Hidayanto','Prabowo','Surya','Yudha','Rahman','Rachman','Hakim','Manurung','Simanjuntak','Hutabarat',
        'Siregar','Marbun','Ginting','Situmorang','Panggabean','Nasution','Sihombing','Tampubolon','Br Ginting','Br Sembiring',
        'Wulandari','Sari','Putri','Lestari','Aprilia','Kurniawati','Rahayu','Susanti','Astuti','Wulandari',
        'Puspitasari','Wati','Yanti','Fitria','Hartati','Maryati','Sri','Dewi','Indah','Rina',
        'Cahya','Dewi','Eka','Fitri','Gina','Hani','Intan','Juita','Karina','Lina',
        'Mira','Nina','Olivia','Putri','Qara','Riana','Siti','Tia','Umaira','Vina',
        'Wulan','Xenia','Yuni','Zara','Agnes','Bella','Cindy','Dina','Elsa','Fifi',
        'Gina','Hani','Intan','Juita','Kina','Lala','Mita','Nina','Oka','Putri',
        'Qisya','Rara','Susi','Tomi','Umaira','Vina','Wulan','Xena','Yoga','Zara'
    ];

    public const INDONESIAN_CITIES = [
        ['Jakarta Selatan','DKI Jakarta','12160'],
        ['Jakarta Pusat','DKI Jakarta','10110'],
        ['Jakarta Barat','DKI Jakarta','11480'],
        ['Jakarta Timur','DKI Jakarta','13320'],
        ['Jakarta Utara','DKI Jakarta','14110'],
        ['Bandung','Jawa Barat','40131'],
        ['Bekasi','Jawa Barat','17111'],
        ['Depok','Jawa Barat','16411'],
        ['Tangerang','Banten','15111'],
        ['South Tangerang','Banten','15310'],
        ['Surabaya','Jawa Timur','60241'],
        ['Semarang','Jawa Tengah','50111'],
        ['Yogyakarta','DI Yogyakarta','55281'],
        ['Denpasar','Bali','80228'],
        ['Medan','Sumatera Utara','20111'],
        ['Palembang','Sumatera Selatan','30111'],
        ['Makassar','Sulawesi Selatan','90111'],
        ['Batam','Kepulauan Riau','29411'],
        ['Bandar Lampung','Lampung','35111'],
        ['Pekanbaru','Riau','28111'],
        ['Padang','Sumatera Barat','25111'],
        ['Banjarmasin','Kalimantan Selatan','70111'],
        ['Balikpapan','Kalimantan Timur','76111'],
        ['Manado','Sulawesi Utara','95111'],
        ['Pontianak','Kalimantan Barat','78111'],
        ['Samarinda','Kalimantan Timur','75111'],
        ['Malang','Jawa Timur','65141'],
        ['Solo','Jawa Tengah','57111'],
        ['Cimahi','Jawa Barat','40512'],
        ['Tasikmalaya','Jawa Barat','46111'],
        ['Cirebon','Jawa Barat','45111'],
        ['Purwakarta','Jawa Barat','41111'],
        ['Karawang','Jawa Barat','41311'],
        ['Subang','Jawa Barat','41211'],
        ['Kuningan','Jawa Barat','45511'],
        ['Majalengka','Jawa Barat','45411'],
        ['Sumedang','Jawa Barat','45311'],
        ['Garut','Jawa Barat','44111'],
        ['Ciamis','Jawa Barat','46211'],
        ['Pangandaran','Jawa Barat','46396'],
        ['Bogor','Jawa Barat','16111'],
        ['Sukabumi','Jawa Barat','43111'],
        ['Cianjur','Jawa Barat','43211'],
    ];

    public const INDONESIAN_STREETS = [
        'Jl. Sudirman','Jl. Thamrin','Jl. Gatot Subroto','Jl. Rasuna Said','Jl. Kuningan','Jl. Sudirman Kav',
        'Jl. MH Thamrin','Jl. Jend. Sudirman','Jl. HR Rasuna Said','Jl. Kuningan Barat','Jl. Kuningan Timur',
        'Jl. Cihampelas','Jl. Braga','Jl. Asia Afrika','Jl. Setiabudi','Jl. Dago','Jl. Riau','Jl. Merdeka',
        'Jl. Diponegoro','Jl. Ahmad Yani','Jl. Jenderal Sudirman','Jl. Pahlawan','Jl. Pemuda','Jl. Hayam Wuruk',
        'Jl. Hasanudin','Jl. Gajah Mada','Jl. Thamrin','Jl. Sudirman','Jl. Rasuna Said','Jl. Kuningan',
        'Jl. Kebon Sirih','Jl. Kramat','Jl. Senen','Jl. Gondangdia','Jl. Cikini','Jl. Menteng',
        'Jl. Tanah Abang','Jl. Glodok','Jl. Pancoran','Jl. Kebayoran','Jl. Cilandak','Jl. Kebayoran Baru',
        'Jl. Slipi','Jl. Grogol','Jl. Palmerah','Jl. Kemang','Jl. Panglima Polim','Jl. Fatmawati',
        'Jl. Pondok Indah','Jl. Cipulir','Jl. Raya Bogor','Jl. Raya Kalimalang','Jl. Raya Narogong','Jl. Raya Cibubur',
        'Jl. Jagorawi','Jl. Lingkar Luar Barat','Jl. Lingkar Luar Timur','Jl. TB Simatupang','Jl. Casablanca',
        'Jl. MT Haryono','Jl. Selatan','Jl. Barat','Jl. Timur','Jl. Utara','Jl. Tengah',
    ];

    public const PRODUCT_NAMES = [
        'Kaos Polos Cotton Combed','Kaos Oversize T-Shirt','Kaos V-Neck Wanita','Kaos Raglan Unisex',
        'Kemeja Flannel Pria','Kemeja Denim Panjang','Kemeja Katun Wanita','Kemeja Linen Pria',
        'Jaket Denim Oversize','Jaket Bomber Pria','Jaket Varsity Wanita','Jaket Windbreaker Unisex',
        'Celana Chino Slim Fit','Celana Jeans Straight','Celana Sweatpants','Celana Jogger Wanita',
        'Dress Linen Summer','Dress Maxi Wanita','Dress Casual Pria','Dress Formal Wanita',
        'Blus Ruffle Satin','Blus Katun Wanita','Blus Chiffon','Blus Formal Pria',
        'Rok Plisket Midi','Rok Denim Wanita','Rok A-line','Rok Panjang Wanita',
        'Sneakers Canvas Unisex','Sneakers Leather Pria','Sepatu Boots Wanita','Sepatu Flatform Wanita',
        'Tas Ransel Katun Vintage','Tas Selempang Kulit','Tas Tote Wanita','Tas Pinggang Unisex',
        'Jam Tangan Minimalis','Jam Tangan Analog','Jam Tangan Digital','Jam Tangan Sport Wanita',
        'Kacamata Mata','Kacamata Hitam','Tas Ransel Laptop','Dompet Kulit Pria',
        'Topi Bucket Wanita','Topi Snapback Pria','Syal Wanita','Kaos Kaki Unisex',
        'Sendal Wanita','Sendal Pria','Sepatu Sneakers Wanita','Sepatu Boots Pria',
        'Gamis Wanita','Jilbab Wanita','Mukena Wanita','Rok Wanita',
        'Celana Pendek Pria','Celana Pendek Wanita','Rok Mini Wanita','Dress Midi Wanita',
        'Jaket Kulit Pria','Jaket Varsity Wanita','Kemeja Batik Pria','Kemeja Batik Wanita',
        'Sarung Wanita','Kain Batik','Stik Lipstik','Parfum Wanita',
        'Parfum Pria','Sprei Wanita','Selimut Wanita','Bantal Wanita',
        'Handuk Wanita','Tissue Wanita','Sabun Mandiri','Shampoo Wanita',
    ];

    public const BRANDS = [
        'Fashionku Basic','Northline','Urban Ridge','Luna Atelier','Stride Co.','Wander Bag',
        'Chrono Lite','Fabric Matic','Stitch & Co','Velvet Thread','Urban Craft','Pure Cotton',
        'Denim Works','Street Wear','Classic Line','Modern Fit','Basik Indonesia','Toko Fashionku',
        'Batik Modern','Nusantara Wear','Indo Fabric','Local Brand','Kain Tenun','Busana Muslim',
        'Hijab Collection','Modest Wear','Islamic Fashion','Pria Klasik','Wanita Elegan','Anak-Anak',
    ];

    /** @var array<int, array<int>> Variant IDs grouped by store_id */
    public array $variantIdsByStore = [];

    public function run(): void
    {
        $this->command?->info('FashionRealData: memulai seeding data realistik 100 baris per tabel...');

        $now = now()->toDateTimeString();

        // Pastikan role & permission ada (single-store: admin = operator toko).
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        $buyerRoleId = DB::table('roles')->where('name', 'buyer')->value('id');

        if (!$adminRoleId || !$buyerRoleId) {
            $this->command?->error('Role admin/buyer belum ada. Jalankan RolePermissionSeeder terlebih dahulu.');
            return;
        }

        $this->seedUsers($adminRoleId, $buyerRoleId, $now);
        $this->seedStoresAndDetails($now);
        $this->seedCatalogAndProducts($now);
        $this->seedOrdersAndPayments($now);
        $this->seedReviewsAndSupport($now);
        $this->seedBannersAndVouchers($now);
        $this->seedChatAndNotifications($now);

        $this->command?->info('FashionRealData: selesai seeding semua tabel dengan data realistik.');
    }

    private function seedUsers(int $operatorRoleId, int $buyerRoleId, string $now): void
    {
        // Bersihkan data user sebelumnya agar seeding idempoten
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('user_roles')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $users = [];
        $userRoles = [];

        // 60 buyer + 40 seller = 100 users
        for ($i = 0; $i < 60; $i++) {
            $id = (string) Str::uuid();
            $first = self::INDONESIAN_FIRST_NAMES[array_rand(self::INDONESIAN_FIRST_NAMES)];
            $last = self::INDONESIAN_LAST_NAMES[array_rand(self::INDONESIAN_LAST_NAMES)];
            $email = strtolower("{$first}.{$last}{$i}@gmail.com");
            $name = "{$first} {$last}";

            $users[] = [
                'id' => $id,
                'email' => $email,
                'password' => Hash::make(self::PASSWORD),
                'has_set_password' => true,
                'name' => $name,
                'avatar' => 'https://picsum.photos/seed/'.md5($id).'/160/160',
                'is_email_verified' => true,
                'is_active' => true,
                'banned_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $userRoles[] = [
                'user_id' => $id,
                'role_id' => $buyerRoleId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        for ($i = 0; $i < 40; $i++) {
            $id = (string) Str::uuid();
            $first = self::INDONESIAN_FIRST_NAMES[array_rand(self::INDONESIAN_FIRST_NAMES)];
            $last = self::INDONESIAN_LAST_NAMES[array_rand(self::INDONESIAN_LAST_NAMES)];
            $email = strtolower("{$first}.{$last}{$i}@toko.com");
            $name = "{$first} {$last}";

            $users[] = [
                'id' => $id,
                'email' => $email,
                'password' => Hash::make(self::PASSWORD),
                'has_set_password' => true,
                'name' => $name,
                'avatar' => 'https://picsum.photos/seed/'.md5($id).'/160/160',
                'is_email_verified' => true,
                'is_active' => true,
                'banned_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $userRoles[] = [
                'user_id' => $id,
                'role_id' => $operatorRoleId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('users')->insert($users);
        DB::table('user_roles')->insert($userRoles);

        $this->command?->info('FashionRealData: '.count($users).' users created.');
    }

    private function seedStoresAndDetails(string $now): void
    {
        // Bersihkan data toko sebelumnya agar seeding idempoten
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('shipping_settings')->truncate();
        DB::table('store_details')->truncate();
        DB::table('addresses')->truncate();
        DB::table('stores')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        $sellerIds = DB::table('user_roles')
            ->where('role_id', $adminRoleId)
            ->whereNotIn('user_id', function ($query) {
                $query->select('user_id')->from('stores');
            })
            ->pluck('user_id');

        if ($sellerIds->isEmpty()) {
            $this->command?->warn('Tidak ada admin/operator untuk membuat toko.');
            return;
        }

        $storeDetails = [];
        $shippingSettings = [];
        $storeAddresses = [];

        foreach ($sellerIds as $index => $userId) {
            $cityData = self::INDONESIAN_CITIES[array_rand(self::INDONESIAN_CITIES)];
            $storeName = 'Toko '.self::PRODUCT_NAMES[array_rand(self::PRODUCT_NAMES)].' '.($index + 1);

            $storeId = DB::table('stores')->insertGetId([
                'user_id' => $userId,
                'name' => $storeName,
                'slug' => Str::slug($storeName).'-'.$index.'-'.Str::random(4),
                'description' => 'Toko fashion online dengan koleksi pakaian, alas kaki, dan aksesori berkualitas.',
                'short_description' => 'Fashion berkualitas dengan ukuran lengkap dan pengiriman cepat.',
                'phone' => '08'.rand(100000000, 999999999),
                'email' => strtolower(Str::slug($storeName)).$index.'@toko.com',
                'city' => $cityData[0],
                'province' => $cityData[1],
                'address' => self::INDONESIAN_STREETS[array_rand(self::INDONESIAN_STREETS)].' No. '.rand(1, 200).', '.$cityData[0],
                'status' => 'approved',
                'is_active' => true,
                'store_type' => 'regular',
                'logo' => 'https://picsum.photos/seed/store-logo-'.Str::random(8).'/400/400',
                'banner_url' => 'https://picsum.photos/seed/store-banner-'.Str::random(8).'/1440/400',
                'created_by' => $userId,
                'updated_by' => $userId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $storeDetails[] = [
                'store_id' => $storeId,
                'owner_name' => DB::table('users')->where('id', $userId)->value('name'),
                'owner_phone' => '08'.rand(100000000, 999999999),
                'description' => 'Butik fashion online dengan koleksi terbaru.',
                'shipping_policy' => 'Pesanan diproses maksimal 2x24 jam kerja.',
                'return_policy' => 'Pengembalian maksimal 7 hari setelah diterima.',
                'open_days' => 'Senin s/d Minggu',
                'open_time' => '08:00:00',
                'close_time' => '21:00:00',
                'whatsapp_url' => 'https://wa.me/628'.rand(100000000, 999999999),
                'instagram_url' => 'https://instagram.com/'.Str::slug($storeName),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $shippingSettings[] = [
                'store_id' => $storeId,
                'store_latitude' => -6.2 + rand(-1000, 1000) / 100000,
                'store_longitude' => 106.8 + rand(-1000, 1000) / 100000,
                'free_shipping_max_distance' => rand(3, 10),
                'default_flat_rate' => rand(10000, 20000),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $storeAddresses[] = [
                'store_id' => $storeId,
                'country' => 'Indonesia',
                'province' => $cityData[1],
                'city_or_regency' => $cityData[0],
                'district' => 'Kecamatan '.rand(1, 20),
                'subdistrict' => 'Kelurahan '.rand(1, 20),
                'postal_code' => $cityData[2],
                'full_address' => self::INDONESIAN_STREETS[array_rand(self::INDONESIAN_STREETS)].' No. '.rand(1, 200),
                'notes' => 'Alamat toko '.$storeName,
                'label' => 'Toko',
                'recipient_name' => $storeName,
                'phone_number' => '08'.rand(100000000, 999999999),
                'latitude' => -6.2 + rand(-1000, 1000) / 100000,
                'longitude' => 106.8 + rand(-1000, 1000) / 100000,
                'is_primary' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('store_details')->insert($storeDetails);
        DB::table('shipping_settings')->insert($shippingSettings);
        DB::table('addresses')->insert($storeAddresses);

        $this->command?->info('FashionRealData: '.count($storeDetails).' toko dan detail selesai.');
    }

    private function seedCatalogAndProducts(string $now): void
    {
        // Bersihkan data produk sebelumnya agar seeding idempoten
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('stock_movements')->truncate();
        DB::table('product_images')->truncate();
        DB::table('product_attribute_values')->truncate();
        DB::table('product_categories')->truncate();
        DB::table('product_variant_values')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('products')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $storeIds = DB::table('stores')->pluck('id');
        $categoryIds = DB::table('categories')->pluck('id');

        if ($storeIds->isEmpty() || $categoryIds->isEmpty()) {
            $this->command?->warn('Toko atau kategori belum tersedia, produk dilewati.');
            return;
        }

        $products = [];
        $variants = [];
        $images = [];
        $productCategories = [];
        $attributeValues = [];
        $stockMovements = [];
        $variantIdsByStore = [];

        $productIndex = 0;
        foreach ($storeIds as $storeId) {
            for ($i = 0; $i < 3; $i++) {
                $productIndex++;
                if ($productIndex > 100) break;

                $categoryId = $categoryIds->random();
                $productName = self::PRODUCT_NAMES[array_rand(self::PRODUCT_NAMES)].' '.$productIndex;
                $brand = self::BRANDS[array_rand(self::BRANDS)];
                $basePrice = rand(50000, 500000);
                $discounted = rand(0, 1);

                $productId = DB::table('products')->insertGetId([
                    'store_id' => $storeId,
                    'primary_category_id' => $categoryId,
                    'name' => $productName,
                    'slug' => Str::slug($productName),
                    'description' => 'Produk fashion berkualitas dari '.$brand.'. Bahan nyaman dan cocok untuk penggunaan sehari-hari.',
                    'brand' => $brand,
                    'thumbnail' => 'https://picsum.photos/seed/prod-'.Str::random(8).'/600/600',
                    'status' => 'published',
                    'is_active' => true,
                    'allows_preorder' => false,
                    'created_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                    'updated_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $productCategories[] = [
                    'product_id' => $productId,
                    'category_id' => $categoryId,
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                // One attribute value set per product (unique constraint: product_id + attribute_id)
                $attributeValues[] = [
                    'product_id' => $productId,
                    'attribute_id' => 1,
                    'value' => ['S','M','L','XL'][rand(0,3)],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $attributeValues[] = [
                    'product_id' => $productId,
                    'attribute_id' => 2,
                    'value' => ['Hitam','Putih','Navy','Merah','Abu-abu'][rand(0,4)],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $variantCount = rand(3, 5);
                $storeVariantIds = [];

                for ($v = 1; $v <= $variantCount; $v++) {
                    $stock = rand(5, 50);
                    $price = $basePrice + rand(-20000, 20000);

                    $variantId = DB::table('product_variants')->insertGetId([
                        'product_id' => $productId,
                        'store_id' => $storeId,
                        'sku' => 'FKU-'.strtoupper(Str::random(4)).'-'.sprintf('%03d', $v),
                        'name' => 'Varian '.$v.' / Ukuran '.['S','M','L','XL'][rand(0,3)].' / Warna '.['Hitam','Putih','Navy','Merah','Abu-abu'][rand(0,4)],
                        'price' => $price,
                        'price_original' => $discounted ? $price + rand(10000, 50000) : null,
                        'price_sale' => $discounted ? $price : null,
                        'stock' => $stock,
                        'po_stock' => 0,
                        'stock_reserved' => 0,
                        'stock_booked' => 0,
                        'stock_preorder' => 0,
                        'max_order_qty' => max(3, floor($stock / 3)),
                        'min_stock' => 3,
                        'is_default' => $v === 1,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $storeVariantIds[] = $variantId;

                    for ($img = 1; $img <= rand(2, 3); $img++) {
                        $images[] = [
                            'product_id' => $productId,
                            'url' => 'https://picsum.photos/seed/img-'.Str::random(8).'-'.$img.'/800/800',
                            'alt_text' => 'Foto '.$productName.' varian '.$v,
                            'is_primary' => $img === 1 && $v === 1,
                            'sort_order' => $img,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }

                    $stockMovements[] = [
                        'store_id' => $storeId,
                        'product_id' => $productId,
                        'variant_id' => $variantId,
                        'movement_key' => 'INIT-'.$variantId,
                        'type' => 'initial',
                        'quantity_delta' => $stock,
                        'balance_after' => $stock,
                        'notes' => 'Stok awal produk '.$productName,
                        'occurred_at' => $now,
                        'created_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                $variantIdsByStore[$storeId] = array_merge($variantIdsByStore[$storeId] ?? [], $storeVariantIds);

                if ($productIndex >= 100) break;
            }
            if ($productIndex >= 100) break;
        }

        DB::table('product_categories')->insert($productCategories);
        DB::table('product_attribute_values')->insert($attributeValues);
        DB::table('product_images')->insert($images);
        DB::table('stock_movements')->insert($stockMovements);

        // Simpan variant IDs untuk penggunaan di orders
        $this->variantIdsByStore = $variantIdsByStore;

        $this->command?->info("FashionRealData: {$productIndex} produk, ".count($variants)." varian, ".count($images)." gambar selesai.");
    }

    private function seedOrdersAndPayments(string $now): void
    {
        $buyerIds = DB::table('user_roles')
            ->where('role_id', DB::table('roles')->where('name', 'buyer')->value('id'))
            ->pluck('user_id');

        if ($buyerIds->isEmpty() || empty($this->variantIdsByStore)) {
            $this->command?->warn('Buyer atau varian produk tidak tersedia, order dilewati.');
            return;
        }

        $orderItems = [];
        $payments = [];
        $financialTransactions = [];

        $allVariantIds = [];
        foreach ($this->variantIdsByStore as $storeId => $vids) {
            foreach ($vids as $vid) {
                $allVariantIds[] = ['id' => $vid, 'store_id' => $storeId];
            }
        }

        for ($i = 1; $i <= 100; $i++) {
            $orderNumber = 'ORD/'.date('ymd').'/'.strtoupper(Str::random(6));
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $buyerIds->random(),
                'order_number' => $orderNumber,
                'status' => ['pending','paid','completed','cancelled','shipped'][rand(0, 4)],
                'payment_status' => 'pending',
                'payment_method' => ['bank_transfer','ewallet','cash_on_delivery'][rand(0, 2)],
                'shipping_address' => self::INDONESIAN_STREETS[array_rand(self::INDONESIAN_STREETS)].' No. '.rand(1, 200),
                'total_amount' => 0,
                'discount_amount' => 0,
                'shipping_discount_amount' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $orderTotal = 0;
            $variantSlice = array_rand($allVariantIds, rand(1, 3));
            if (!is_array($variantSlice)) $variantSlice = [$variantSlice];

            foreach ($variantSlice as $idx) {
                $vi = $allVariantIds[$idx];
                $variantInfo = DB::table('product_variants')->where('id', $vi['id'])->first();
                $productInfo = DB::table('products')->where('id', $variantInfo->product_id)->first();
                $qty = rand(1, 3);
                $price = (int) $variantInfo->price;
                $subTotal = $price * $qty;
                $orderTotal += $subTotal;

                $subOrderId = DB::table('sub_orders')->insertGetId([
                    'order_id' => $orderId,
                    'store_id' => $vi['store_id'],
                    'sub_order_number' => 'SUB/'.date('ymd').'/'.strtoupper(Str::random(6)),
                    'total_items_price' => $subTotal,
                    'shipping_cost' => rand(10000, 20000),
                    'courier' => null,
                    'service' => null,
                    'destination_id' => 'DST-'.strtoupper(Str::random(6)),
                    'status' => ['pending','paid','completed','cancelled','shipped'][rand(0, 4)],
                    'tracking_number' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $orderItems[] = [
                    'sub_order_id' => $subOrderId,
                    'product_id' => $variantInfo->product_id,
                    'variant_id' => $vi['id'],
                    'product_name' => $productInfo->name ?? 'Produk',
                    'sku' => 'FKU-'.strtoupper(Str::random(4)),
                    'price' => $price,
                    'quantity' => $qty,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            $totalWithShipping = $orderTotal + rand(10000, 30000);
            DB::table('orders')->where('id', $orderId)->update([
                'total_amount' => $totalWithShipping,
            ]);

            $payments[] = [
                'order_number' => $orderNumber,
                'transaction_id' => 'TRX/'.date('ymd').'/'.strtoupper(Str::random(6)),
                'payment_method' => ['bank_transfer','ewallet','cash_on_delivery'][rand(0, 2)],
                'amount' => $totalWithShipping,
                'status' => ['pending','paid'][rand(0, 1)],
                'payload' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $financialTransactions[] = [
                'store_id' => $allVariantIds[array_rand($allVariantIds)]['store_id'],
                'order_id' => $orderId,
                'user_id' => $buyerIds->random(),
                'reference_number' => 'INV/'.date('ymd').'/'.strtoupper(Str::random(6)),
                'type' => 'income',
                'title' => 'Pemasukan dari pesanan',
                'description' => 'Hasil penjualan pesanan fashion online',
                'amount' => $totalWithShipping,
                'paid_amount' => $totalWithShipping,
                'status' => 'posted',
                'due_date' => null,
                'occurred_at' => $now,
                'settled_at' => $now,
                'is_active' => true,
                'metadata' => null,
                'created_by' => $buyerIds->random(),
                'updated_by' => $buyerIds->random(),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('order_items')->insert($orderItems);
        DB::table('payments')->insert($payments);
        DB::table('financial_transactions')->insert($financialTransactions);

        $this->command?->info('FashionRealData: 100 order, sub_order, order_item, payment, dan financial_transaction selesai.');
    }

    private function seedReviewsAndSupport(string $now): void
    {
        $buyerIds = DB::table('user_roles')
            ->where('role_id', DB::table('roles')->where('name', 'buyer')->value('id'))
            ->pluck('user_id');

        $variants = DB::table('product_variants')->get();
        $storeIds = DB::table('stores')->pluck('id');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('support_ticket_messages')->truncate();
        DB::table('product_reviews')->truncate();
        DB::table('support_tickets')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        if ($buyerIds->isEmpty() || $variants->isEmpty()) {
            $this->command?->warn('Buyer atau varian tidak tersedia, review/support dilewati.');
            return;
        }

        $reviews = [];
        $ticketIds = [];
        $ticketMessages = [];

        $reviewTexts = [
            'Produk berkualitas, sesuai dengan gambar di toko.',
            'Pengiriman cepat dan packaging rapih.',
            'Bahan nyaman, ukuran pas.',
            'Sangat puas dengan pembelian ini.',
            'Produk bagus, akan belanja lagi.',
            'Cukup baik, tapi pengiriman agak lambat.',
            'Barang sesuai deskripsi, recomended.',
            'Harga terjangkau dengan kualitas baik.',
            'Packaging aman, barang tidak rusak.',
            'Layanan toko ramah dan responsif.',
        ];

        $orderItemsForReview = DB::table('order_items')->select('id as order_item_id', 'sub_order_id')->get();
        $orderIds = DB::table('sub_orders')->select('id as sub_order_id', 'order_id')->get()->keyBy('sub_order_id');
        $reviewOrderItems = $orderItemsForReview->shuffle()->take(100);

        foreach ($reviewOrderItems as $oi) {
            $variant = $variants->random();
            $buyerId = $buyerIds->random();
            $rating = rand(3, 5);
            $orderId = $orderIds->get($oi->sub_order_id)->order_id ?? DB::table('orders')->value('id');

            $reviews[] = [
                'product_id' => $variant->product_id,
                'order_id' => $orderId,
                'order_item_id' => $oi->order_item_id,
                'user_id' => $buyerId,
                'rating' => $rating,
                'review' => $reviewTexts[array_rand($reviewTexts)].' Produk ini memenuhi harapan saya.',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $ticketId = DB::table('support_tickets')->insertGetId([
                'ticket_number' => 'TKT/'.date('Ymd').'/'.strtoupper(Str::random(6)),
                'user_id' => $buyerId,
                'store_id' => $storeIds->random(),
                'category' => 'general',
                'subject' => 'Tanya tentang pesanan',
                'description' => 'Saya ingin bertanya tentang status pesanan saya.',
                'priority' => ['low','medium','high'][rand(0, 2)],
                'status' => ['open','closed','in_progress'][rand(0, 2)],
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $ticketIds[] = $ticketId;
        }

        foreach ($ticketIds as $ticketId) {
            $ticketMessages[] = [
                'ticket_id' => $ticketId,
                'user_id' => $buyerIds->random(),
                'message' => 'Mohon informasi lebih lanjut.',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('product_reviews')->insert($reviews);
        DB::table('support_ticket_messages')->insert($ticketMessages);

        $this->command?->info('FashionRealData: 100 review, support_ticket, dan ticket_message selesai.');
    }

    private function seedBannersAndVouchers(string $now): void
    {
        $storeIds = DB::table('stores')->pluck('id');

        // Bersihkan data banner/voucher sebelumnya agar seeding idempoten
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('banners')->truncate();
        DB::table('vouchers')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        if ($storeIds->isEmpty()) {
            $this->command?->warn('Toko tidak tersedia, banner/voucher dilewati.');
            return;
        }

        $banners = [];
        $vouchers = [];

        for ($i = 1; $i <= 100; $i++) {
            $storeId = $storeIds->random();

            $banners[] = [
                'store_id' => $storeId,
                'name' => 'Promo '.self::PRODUCT_NAMES[array_rand(self::PRODUCT_NAMES)].' Bulan '.date('F'),
                'image_url' => 'https://picsum.photos/seed/banner-'.Str::random(8).'/1200/480',
                'sort_order' => $i,
                'is_active' => true,
                'created_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                'updated_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $vouchers[] = [
                'store_id' => $storeId,
                'voucher_scope' => 'store',
                'code' => 'FKU'.strtoupper(Str::random(6)).$i,
                'name' => 'Voucher Diskon '.$i.'%',
                'image' => 'https://picsum.photos/seed/voucher-'.Str::random(8).'/400/240',
                'discount_target' => 'product',
                'discount_type' => rand(0, 1) ? 'percentage' : 'fixed',
                'discount_value' => rand(5, 50),
                'min_spend' => rand(50000, 200000),
                'min_items' => 1,
                'min_distinct_products' => 1,
                'terms' => 'Berlaku untuk semua produk di toko.',
                'max_discount' => rand(10000, 100000),
                'starts_at' => now()->subDays(30)->toDateTimeString(),
                'ends_at' => now()->addDays(90)->toDateTimeString(),
                'usage_limit' => rand(100, 500),
                'used_count' => 0,
                'is_active' => true,
                'created_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                'updated_by' => DB::table('stores')->where('id', $storeId)->value('user_id'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('banners')->insertOrIgnore($banners);
        DB::table('vouchers')->insertOrIgnore($vouchers);

        $this->command?->info('FashionRealData: 100 banner dan 100 voucher selesai.');
    }

    private function seedChatAndNotifications(string $now): void
    {
        $buyerIds = DB::table('user_roles')
            ->where('role_id', DB::table('roles')->where('name', 'buyer')->value('id'))
            ->pluck('user_id');

        $sellerIds = DB::table('user_roles')
            ->where('role_id', DB::table('roles')->where('name', 'admin')->value('id'))
            ->pluck('user_id');

        // Bersihkan data chat/notifikasi sebelumnya agar seeding idempoten
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('admin_notifications')->truncate();
        DB::table('chat_messages')->truncate();
        DB::table('conversation_participants')->truncate();
        DB::table('conversations')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        if ($buyerIds->isEmpty() || $sellerIds->isEmpty()) {
            $this->command?->warn('Buyer atau seller tidak tersedia, chat/notifikasi dilewati.');
            return;
        }

        $messages = [];
        $notifications = [];

        for ($i = 1; $i <= 100; $i++) {
            $buyerId = $buyerIds->random();
            $sellerId = $sellerIds->random();

            $convId = DB::table('conversations')->insertGetId([
                'type' => 'direct',
                'subject' => 'Pertanyaan Produk '.$i,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('conversation_participants')->insert([
                'conversation_id' => $convId,
                'user_id' => $buyerId,
                'joined_at' => $now,
            ]);
            DB::table('conversation_participants')->insert([
                'conversation_id' => $convId,
                'user_id' => $sellerId,
                'joined_at' => $now,
            ]);

            $messages[] = [
                'conversation_id' => $convId,
                'sender_id' => $buyerId,
                'message_type' => 'text',
                'message' => 'Halo, saya tertarik dengan produk Anda.',
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $notifications[] = [
                'user_id' => $sellerId,
                'actor_id' => $buyerId,
                'module' => 'chat',
                'type' => 'chat_message',
                'title' => 'Pesan baru dari pembeli',
                'message' => 'Anda memiliki pesan baru dalam obrolan.',
                'reference_type' => 'conversation',
                'reference_id' => (string) $convId,
                'url' => null,
                'meta' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('chat_messages')->insert($messages);
        DB::table('admin_notifications')->insert($notifications);

        $this->command?->info('FashionRealData: 100 conversation, chat_message, dan admin_notification selesai.');
    }
}
