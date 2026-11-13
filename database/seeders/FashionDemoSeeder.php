<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Data dasar Fashionku: akun demo (seller & buyer) dan satu toko utama (single-store).
 * Password semua akun demo: 12345678.
 */
final class FashionDemoSeeder extends Seeder
{
    public const PASSWORD = '12345678';

    public static function uuidFor(string $key): string
    {
        $hash = md5('fashionku.'.$key);

        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            substr($hash, 12, 4),
            substr($hash, 16, 4),
            substr($hash, 20, 12)
        );
    }

    public function run(): void
    {
        $this->command?->info('Fashionku: membuat akun demo & toko utama...');

        // Single-store: operator/pemilik toko memakai role `admin`.
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        $buyerRoleId = DB::table('roles')->where('name', 'buyer')->value('id');
        $now = now()->toDateTimeString();

        // ── Admin/operator pengelola toko ────────────────────────────────────
        $ownerId = self::uuidFor('seller.utama');
        $this->createUser($ownerId, 'nadia@fashionku.id', 'Nadia Prameswari', [($adminRoleId ?? 0), ($buyerRoleId ?? 0)], $now);
        $this->createUser(self::uuidFor('seller.kedua'), 'rafi@fashionku.id', 'Rafi Ardiansyah', [($adminRoleId ?? 0)], $now);

        // ── Buyer demo ───────────────────────────────────────────────────────
        $buyers = [
            [self::uuidFor('buyer.1'), 'sinta@gmail.com', 'Sinta Maharani'],
            [self::uuidFor('buyer.2'), 'dimas@gmail.com', 'Dimas Prayoga'],
            [self::uuidFor('buyer.3'), 'alya@gmail.com', 'Alya Putri'],
            [self::uuidFor('buyer.4'), 'bagus@gmail.com', 'Bagus Wicaksono'],
        ];

        foreach ($buyers as [$id, $email, $name]) {
            $this->createUser($id, $email, $name, [($buyerRoleId ?? 0)], $now);
        }

        // ── Toko utama Fashionku (single-store) ─────────────────────────────
        $existingStoreId = DB::table('stores')->whereNull('deleted_at')->orderBy('id')->value('id');

        if ($existingStoreId === null) {
            $storeId = DB::table('stores')->insertGetId([
                'user_id' => $ownerId,
                'name' => 'Fashionku',
                'slug' => 'fashionku',
                'description' => 'Fashionku adalah destination fashion modern untuk pria dan wanita. Kami menghadirkan pakaian, alas kaki, tas, dan aksesori berkualitas dengan ukuran lengkap, warna trendi, dan pengiriman ke seluruh Indonesia.',
                'short_description' => 'Destination fashion pria & wanita. Ukuran lengkap, pengiriman ke seluruh Indonesia.',
                'phone' => '081234567890',
                'email' => 'halo@fashionku.id',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'address' => 'Jl. Cihampelas No. 120, Bandung',
                'status' => 'approved',
                'is_active' => true,
                'store_type' => 'power_merchant',
                'logo' => 'https://picsum.photos/seed/fashionku-logo/400/400',
                'banner_url' => 'https://picsum.photos/seed/fashionku-banner/1440/400',
                'created_by' => $ownerId,
                'updated_by' => $ownerId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('store_details')->insert([
                'store_id' => $storeId,
                'owner_name' => 'Nadia Prameswari',
                'owner_phone' => '081234567890',
                'description' => 'Butik fashion online dengan koleksi pria dan wanita, ukuran lengkap S-XXL, dan pengiriman cepat.',
                'shipping_policy' => 'Pesanan diproses maksimal 2x24 jam kerja. Gratis ongkir untuk pembelian di atas Rp300.000.',
                'return_policy' => 'Pengembalian maksimal 7 hari setelah diterima dengan kondisi asli, label utuh, belum dipakai, dan kemasan lengkap.',
                'open_days' => 'Senin s/d Minggu',
                'open_time' => '08:00:00',
                'close_time' => '21:00:00',
                'whatsapp_url' => 'https://wa.me/6281234567890',
                'instagram_url' => 'https://instagram.com/fashionku.id',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('shipping_settings')->insert([
                'store_id' => $storeId,
                'store_latitude' => -6.90342770,
                'store_longitude' => 107.61806640,
                'free_shipping_max_distance' => 5,
                'default_flat_rate' => 12000,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('addresses')->insert([
                'store_id' => $storeId,
                'country' => 'Indonesia',
                'province' => 'Jawa Barat',
                'city_or_regency' => 'Bandung',
                'district' => 'Coblong',
                'subdistrict' => 'Cipaganti',
                'postal_code' => '40131',
                'full_address' => 'Jl. Cihampelas No. 120, Bandung',
                'notes' => 'Alamat toko Fashionku',
                'label' => 'Toko',
                'recipient_name' => 'Fashionku',
                'phone_number' => '081234567890',
                'latitude' => -6.90342770,
                'longitude' => 107.61806640,
                'is_primary' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── Alamat, keranjang & wishlist buyer ──────────────────────────────
        $buyerAddresses = [
            [self::uuidFor('buyer.1'), 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8, Kebayoran Baru', 'Rumah', 'Sinta Maharani', '081111110001', -6.2445, 106.7986],
            [self::uuidFor('buyer.2'), 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Surabaya', 'Kos', 'Dimas Prayoga', '081111110002', -7.2575, 112.7521],
            [self::uuidFor('buyer.3'), 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur', 'Villa', 'Alya Putri', '081111110003', -8.6870, 115.2620],
            [self::uuidFor('buyer.4'), 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6, Sleman', 'Rumah', 'Bagus Wicaksono', '081111110004', -7.7460, 110.4050],
        ];

        foreach ($buyerAddresses as [$userId, $province, $city, $district, $subdistrict, $postal, $full, $label, $recipient, $phone, $lat, $lng]) {
            DB::table('addresses')->insert([
                'user_id' => $userId,
                'country' => 'Indonesia',
                'province' => $province,
                'city_or_regency' => $city,
                'district' => $district,
                'subdistrict' => $subdistrict,
                'postal_code' => $postal,
                'full_address' => $full,
                'notes' => null,
                'label' => $label,
                'recipient_name' => $recipient,
                'phone_number' => $phone,
                'latitude' => $lat,
                'longitude' => $lng,
                'komerce_destination_id' => 'KMB-'.substr($postal, 0, 4),
                'is_primary' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('carts')->insertOrIgnore([
                'user_id' => $userId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('wishlists')->insert([
                'id' => $userId,
                'user_id' => $userId,
                'name' => 'utama',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command?->info('Fashionku: akun demo & toko utama selesai.');
    }

    private function createUser(string $id, string $email, string $name, array $roleIds, string $now): void
    {
        DB::table('users')->insert([
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
        ]);

        foreach (array_filter($roleIds) as $roleId) {
            DB::table('user_roles')->insert([
                'user_id' => $id,
                'role_id' => $roleId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
