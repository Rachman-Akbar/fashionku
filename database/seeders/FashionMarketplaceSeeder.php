<?php

declare(strict_types=1);

namespace Database\Seeders;

use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Simulasi toko yang sedang berjalan hari ini.
 *
 * Data dibuat relatif terhadap waktu eksekusi (`now()`), bukan tanggal mati:
 * ada pesanan beberapa menit lalu, beberapa jam lalu, kemarin, minggu ini,
 * dan riwayat 2-3 bulan terakhir. Status pesanan selalu konsisten dengan
 * umurnya, sehingga dashboard "hari ini" langsung terisi saat seeder jalan.
 *
 * Password semua akun: FashionDemoSeeder::PASSWORD.
 */
final class FashionMarketplaceSeeder extends Seeder
{
    private const BUYERS = [
        'Sinta Maharani', 'Dimas Prayoga', 'Alya Putri', 'Bagus Wicaksono', 'Nadia Kusuma', 'Rizky Pratama', 'Fitri Handayani', 'Arif Setiawan',
        'Melati Anggraini', 'Yoga Saputra', 'Dewi Lestari', 'Fajar Nugroho', 'Intan Permata', 'Reza Fahlevi', 'Putri Ayu Lestari', 'Hendra Wijaya',
        'Clara Simanjuntak', 'Bimo Aditya', 'Sari Wulandari', 'Taufik Hidayat', 'Nabila Syakira', 'Andi Kurniawan', 'Ratna Sari', 'Ilham Maulana',
        'Vina Oktaviani', 'Bayu Firmansyah', 'Citra Kirana', 'Donny Saputra', 'Eka Puspita', 'Gilang Ramadhan', 'Hana Safitri', 'Irfan Hakim',
        'Jessica Tanoto', 'Kevin Santoso', 'Larasati Dewi', 'Muhammad Rizki', 'Nina Marlina', 'Oscar Simbolon', 'Prasetyo Adi', 'Qonita Rahma',
        'Rangga Pratama', 'Sylvia Handoko', 'Tegar Afandi', 'Ulfa Nurlaila', 'Vino Bastian', 'Wulan Sari', 'Yoga Pranata', 'Zahra Amelia',
        'Aditya Nugraha', 'Bella Anindita', 'Chandra Wijaya', 'Dinda Larasati', 'Eko Purnomo', 'Farah Nabila', 'Galih Prakoso', 'Hesti Puspitasari',
        'Indra Kusuma', 'Jihan Aurelia', 'Krisna Yudha', 'Lestari Ningsih', 'Miko Alfandi', 'Nadya Salsabila', 'Oki Setiabudi', 'Putra Mahendra',
        'Qori Amalia', 'Rian Adinata', 'Sinta Dewanti', 'Tomi Gunawan', 'Umi Kalsum', 'Verdiansyah Putra', 'Winda Kartika', 'Yusril Hakim',
        'Zaskia Mecca', 'Ahmad Fauzi', 'Brigita Sitorus', 'Cahyo Nugroho', 'Dian Purnamasari', 'Erlangga Putra', 'Fransiska Loi', 'Gading Martadinata',
        'Hilda Yuliani', 'Iqbal Mauludi', 'Juwita Sari', 'Kemal Ataturk', 'Lidya Manurung', 'Maulana Yusuf', 'Novi Andriani', 'Opan Sofyan',
        'Puspita Ayu', 'Qodratullah Hasan', 'Rahmat Hidayat', 'Suhailah Rahman', 'Teguh Santoso', 'Ujang Suryana', 'Vera Marlina', 'Wahyu Setiawan',
    ];

    private const CITIES = [
        ['DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8'],
        ['DKI Jakarta', 'Jakarta Pusat', 'Menteng', 'Cikini', '10330', 'Jl. Cikini Raya No. 45'],
        ['DKI Jakarta', 'Jakarta Barat', 'Grogol Petamburan', 'Tanjung Duren', '11470', 'Jl. Tanjung Duren Utara No. 21'],
        ['Jawa Barat', 'Bandung', 'Coblong', 'Cipaganti', '40131', 'Jl. Cipaganti No. 87'],
        ['Jawa Barat', 'Bandung', 'Sukajadi', 'Pasteur', '40161', 'Jl. Dr. Setiabudi No. 210'],
        ['Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jaka Mulya', '17146', 'Jl. Ahmad Yani No. 12'],
        ['Jawa Barat', 'Depok', 'Sukmajaya', 'Mekarsari', '16411', 'Jl. Margonda Raya No. 78'],
        ['Jawa Tengah', 'Semarang', 'Gajahmungkur', 'Bendungan', '50231', 'Jl. Pandanaran No. 34'],
        ['Jawa Tengah', 'Surakarta', 'Laweyan', 'Sriwedari', '57141', 'Jl. Slamet Riyadi No. 456'],
        ['DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6 No. 19'],
        ['DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Demangan', '55281', 'Jl. Gejayan No. 112'],
        ['Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45'],
        ['Jawa Timur', 'Malang', 'Klojen', 'Klojen', '65112', 'Jl. Basuki Rahmat No. 29'],
        ['Jawa Timur', 'Sidoarjo', 'Sidoarjo', 'Pucang Kertu', '61213', 'Jl. Jend. Sudirman No. 88'],
        ['Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22'],
        ['Bali', 'Gianyar', 'Ubud', 'Ubud', '80571', 'Jl. Raya Ubud No. 15'],
        ['Sumatera Utara', 'Medan', 'Medan Baru', 'Sedayu', '20123', 'Jl. Gatot Subroto No. 301'],
        ['Sumatera Selatan', 'Palembang', 'Ilir Barat I', 'Kemang Manis', '30131', 'Jl. Veteran No. 66'],
        ['Riau', 'Pekanbaru', 'Sukajadi', 'Harjosari', '28292', 'Jl. Soekarno Hatta No. 141'],
        ['Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', 'Kota Karang', '35116', 'Jl. Wolter Monginsidi No. 73'],
        ['Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karama', '90231', 'Jl. Boulevard No. 18'],
        ['Kalimantan Timur', 'Balikpapan', 'Balikpapan Kota', 'Klandasan Ilir', '76112', 'Jl. MT Haryono No. 55'],
        ['Nusa Tenggara Barat', 'Mataram', 'Mataram', 'Pejanggik', '83117', 'Jl. Pejanggik No. 9'],
        ['Aceh', 'Banda Aceh', 'Baiturrahman', 'Kupiah', '23352', 'Jl. Tgk. Chik Ditiro No. 61'],
    ];

    private const COURIERS = [
        ['JNE', 'REG'], ['J&T Express', 'YES'], ['SiCepat', 'REG'], ['AnterAja', 'REG'], ['Lion Parcel', 'REG'], ['JNE', 'JTR'],
    ];

    private const PAYMENT_METHODS = ['midtrans', 'bank_transfer', 'ewallet', 'qris'];

    private const REVIEW_TEXTS = [
        'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.',
        'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.',
        'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.',
        'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.',
        'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.',
        'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.',
        'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.',
        'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.',
        'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.',
        'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.',
        'Pesan warna hitam, ternyata sedikit lebih gelap dari foto tapi justru lebih elegan. Recommended.',
        'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.',
        'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.',
        'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.',
        'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.',
    ];

    private const REVIEW_TEXTS_CRITICAL = [
        'Warna yang dikirim beda tipis dari foto, tapi masih oke. Ukuran sedikit lebih kecil dari perkiraan.',
        'Barang oke, sayang pengiriman hampir seminggu. Seller sempat bantu cek posisi paket, terima kasih.',
        'Bahannya enak, tapi ada lipatan bekas packing yang susah hilang. Bisa disetrika sih.',
        'Sesuai harga, jahitan bagian dalam ada yang kurang rapi. Untuk harian masih layak dipakai.',
    ];

    public function run(): void
    {
        $this->command?->info('Fashionku: membuat pembeli, pesanan hari ini, ulasan, dan riwayat stok...');

        $now = CarbonImmutable::now();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');

        $buyers = $this->seedBuyers($now);

        $variants = DB::table('product_variants as pv')
            ->join('products as p', 'p.id', '=', 'pv.product_id')
            ->where('p.status', 'published')
            ->where('p.is_active', true)
            ->whereNull('p.deleted_at')
            ->orderBy('pv.product_id')
            ->orderBy('pv.id')
            ->get([
                'pv.id', 'pv.product_id', 'pv.sku', 'pv.price', 'pv.stock',
                'p.name as product_name', 'p.thumbnail', 'p.created_at as product_created_at',
            ]);

        if ($variants->isEmpty()) {
            $this->command?->warn('Fashionku: belum ada produk published, pesanan dilewati.');

            return;
        }

        $vouchers = DB::table('vouchers')
            ->where('is_active', true)
            ->where('starts_at', '<=', $now->toDateTimeString())
            ->where('ends_at', '>=', $now->toDateTimeString())
            ->whereNull('deleted_at')
            ->get();

        $sales = [];
        $voucherUsage = [];
        $orderStats = ['total' => 0, 'paid' => 0, 'completed' => 0, 'reviews' => 0];
        $buyerVoucherClaims = [];

        foreach ($this->orderPlan() as $seq => $minutesAgo) {
            $buyer = $buyers[($seq * 37 + 11) % count($buyers)];
            $placedAt = $now->subMinutes($minutesAgo);
            $status = $this->statusFor($minutesAgo, $seq);
            $ageMinutes = max($minutesAgo, 45);

            // Milestone mengikuti umur pesanan agar selalu berakhir sebelum "sekarang".
            $shippedAt = $placedAt->addMinutes((int) round($ageMinutes * 0.45));
            $receivedAt = $placedAt->addMinutes((int) round($ageMinutes * 0.7));
            $completedAt = $placedAt->addMinutes((int) round($ageMinutes * 0.85));
            $cancelledAt = $placedAt->addMinutes((int) round($ageMinutes * 0.3));

            $itemCount = 1 + ($seq % 3);
            $items = [];
            for ($n = 0; $n < $itemCount; $n++) {
                // Produk hanya bisa terjual setelah tanggal rilisnya.
                $offset = 0;
                do {
                    $variant = $variants[(($seq * 13) + ($n * 47) + $offset) % $variants->count()];
                    $offset++;
                } while (
                    $offset < $variants->count()
                    && CarbonImmutable::parse((string) $variant->product_created_at)->greaterThan($placedAt)
                );

                $items[] = ['variant' => $variant, 'quantity' => 1 + ((($seq + $n) % 3) === 0 ? 1 : 0)];
            }

            $itemsTotal = array_sum(array_map(
                static fn (array $item): float => (float) $item['variant']->price * $item['quantity'],
                $items
            ));

            $paymentStatus = match (true) {
                $status === 'cancelled' => 'cancelled',
                $status === 'pending' => 'unpaid',
                default => 'paid',
            };
            $paymentMethod = self::PAYMENT_METHODS[$seq % count(self::PAYMENT_METHODS)];

            // Voucher dipakai sesekali untuk pesanan yang sudah dibayar.
            $voucher = null;
            $discount = 0;
            $shippingDiscount = 0;
            $pendingVoucherClaim = null;
            if ($paymentStatus === 'paid' && $seq % 6 === 0 && $vouchers->isNotEmpty()) {
                $candidates = $vouchers
                    ->filter(static fn ($v): bool => (float) $v->min_spend <= $itemsTotal)
                    ->values();
                if ($candidates->isNotEmpty()) {
                    $voucher = $candidates[$seq % $candidates->count()];
                    $value = (float) $voucher->discount_value;
                    $raw = $voucher->discount_type === 'percentage' ? $itemsTotal * $value / 100 : $value;
                    if ($voucher->max_discount !== null) {
                        $raw = min($raw, (float) $voucher->max_discount);
                    }
                    if ($voucher->discount_target === 'shipping') {
                        $shippingDiscount = min($raw, 25000);
                    } else {
                        $discount = min($raw, $itemsTotal);
                    }
                    $voucherUsage[(int) $voucher->id] = ($voucherUsage[(int) $voucher->id] ?? 0) + 1;
                    $pendingVoucherClaim = [
                        'user_id' => $buyer['id'],
                        'voucher_id' => (int) $voucher->id,
                        'source_type' => 'order',
                        'source_id' => null, // diisi setelah order tersimpan
                        'used_at' => $placedAt,
                    ];
                    $buyerVoucherClaims[] = $pendingVoucherClaim;
                }
            }

            $shippingCost = $itemsTotal >= 300000 ? 0 : 18000 + (($seq % 5) * 6000);
            $shippingCost = max(0, $shippingCost - $shippingDiscount);
            $totalAmount = max(0, $itemsTotal + $shippingCost - $discount);

            $orderNumber = sprintf('FKU-%s-%04d', $placedAt->format('Ymd'), 9000 + $seq);
            $orderUpdatedAt = match ($status) {
                'cancelled' => $cancelledAt,
                'shipped' => $shippedAt,
                'received' => $receivedAt,
                'completed' => $completedAt,
                default => $placedAt->addMinutes(3 + ($seq % 20)),
            };

            $orderId = DB::table('orders')->insertGetId([
                'order_number' => $orderNumber,
                'order_type' => 'normal',
                'preorder_release_at' => null,
                'scheduled_at' => null,
                'received_at' => in_array($status, ['received', 'completed'], true) ? $receivedAt->toDateTimeString() : null,
                'user_id' => $buyer['id'],
                'voucher_id' => $voucher?->id,
                'total_amount' => $totalAmount,
                'discount_amount' => $discount,
                'shipping_discount_amount' => $shippingDiscount,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                'midtrans_snap_token' => $paymentMethod === 'midtrans' ? 'snap-'.bin2hex(random_bytes(8)) : null,
                'shipping_address' => json_encode([
                    'recipient' => $buyer['name'],
                    'phone' => $buyer['phone'],
                    'address' => $buyer['address'],
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'created_at' => $placedAt->toDateTimeString(),
                'updated_at' => $orderUpdatedAt->toDateTimeString(),
            ]);

            if ($pendingVoucherClaim !== null) {
                $buyerVoucherClaims[array_key_last($buyerVoucherClaims)]['source_id'] = (string) $orderId;
            }

            [$courier, $service] = self::COURIERS[$seq % count(self::COURIERS)];
            $trackingNumber = in_array($status, ['shipped', 'received', 'completed'], true)
                ? strtoupper($courier === 'J&T Express' ? 'JT' : substr($courier, 0, 2)).sprintf('%012d', 810000000000 + $orderId)
                : null;

            $subOrderId = DB::table('sub_orders')->insertGetId([
                'order_id' => $orderId,
                'sub_order_number' => $orderNumber.'-1',
                'total_items_price' => $itemsTotal,
                'shipping_cost' => $shippingCost,
                'courier' => $courier,
                'service' => $service,
                'destination_id' => $buyer['destination_id'],
                'status' => $status,
                'tracking_number' => $trackingNumber,
                'created_at' => $placedAt->toDateTimeString(),
                'updated_at' => $orderUpdatedAt->toDateTimeString(),
            ]);

            $productLines = [];
            foreach ($items as $item) {
                $variant = $item['variant'];
                $orderItemId = DB::table('order_items')->insertGetId([
                    'sub_order_id' => $subOrderId,
                    'product_id' => $variant->product_id,
                    'variant_id' => $variant->id,
                    'product_name' => $variant->product_name,
                    'sku' => $variant->sku,
                    'thumbnail' => $variant->thumbnail,
                    'price' => $variant->price,
                    'quantity' => $item['quantity'],
                    'created_at' => $placedAt->toDateTimeString(),
                    'updated_at' => $placedAt->toDateTimeString(),
                ]);

                $productLines[] = trim((string) $variant->product_name).' x'.$item['quantity'];

                if ($status !== 'cancelled') {
                    $sales[(int) $variant->id][] = [
                        'order_id' => $orderId,
                        'order_item_id' => $orderItemId,
                        'product_id' => (int) $variant->product_id,
                        'quantity' => (int) $item['quantity'],
                        'occurred_at' => $placedAt->addMinutes(20)->toDateTimeString(),
                        'order_number' => $orderNumber,
                    ];
                }

                if ($status === 'completed' && $seq % 3 !== 0) {
                    $rating = $seq % 11 === 0 ? 3 : ($seq % 4 === 0 ? 4 : 5);
                    $pool = $rating >= 4 ? self::REVIEW_TEXTS : self::REVIEW_TEXTS_CRITICAL;
                    $reviewAt = $receivedAt->addDays(1)->min($now->subMinutes(30));

                    DB::table('product_reviews')->insert([
                        'product_id' => $variant->product_id,
                        'order_id' => $orderId,
                        'order_item_id' => $orderItemId,
                        'user_id' => $buyer['id'],
                        'rating' => $rating,
                        'review' => $pool[($seq + (int) $variant->id) % count($pool)],
                        'media' => null,
                        'is_active' => true,
                        'created_by' => $buyer['id'],
                        'updated_by' => $buyer['id'],
                        'created_at' => $reviewAt->toDateTimeString(),
                        'updated_at' => $reviewAt->toDateTimeString(),
                    ]);
                    $orderStats['reviews']++;
                }
            }

            // Catatan pembayaran: pending/expire/settlement.
            $paymentRecordStatus = match (true) {
                $status === 'cancelled' => 'expire',
                $status === 'pending' => 'pending',
                default => 'settlement',
            };
            DB::table('payments')->insert([
                'order_number' => $orderNumber,
                'transaction_id' => 'TRX-'.$orderNumber,
                'payment_method' => $paymentMethod,
                'amount' => $totalAmount,
                'status' => $paymentRecordStatus,
                'payload' => json_encode([
                    'provider' => $paymentMethod,
                    'status_code' => $paymentRecordStatus === 'settlement' ? '200' : '201',
                    'paid_at' => $paymentStatus === 'paid' ? $placedAt->addMinutes(5)->toDateTimeString() : null,
                ]),
                'created_at' => $placedAt->toDateTimeString(),
                'updated_at' => $orderUpdatedAt->toDateTimeString(),
            ]);

            if ($paymentStatus === 'paid') {
                $orderStats['paid']++;
            }

            if ($status === 'completed') {
                $orderStats['completed']++;
                $incomeAt = $completedAt;

                DB::table('financial_transactions')->insert([
                    'order_id' => $orderId,
                    'user_id' => $buyer['id'],
                    'reference_number' => 'INC-'.$incomeAt->format('YmdHis').'-'.strtoupper(substr(md5($orderNumber), 0, 5)),
                    'type' => 'income',
                    'category' => 'penjualan',
                    'title' => 'Pemasukan sesuai dengan no order '.$orderNumber.'-1',
                    'description' => 'Order product '.implode(', ', $productLines).' dengan jumlah '
                        .array_sum(array_column($items, 'quantity')).' nomor order '.$orderNumber,
                    'amount' => $itemsTotal,
                    'paid_amount' => 0,
                    'status' => 'posted',
                    'due_date' => null,
                    'occurred_at' => $incomeAt->toDateTimeString(),
                    'settled_at' => null,
                    'is_active' => true,
                    'metadata' => json_encode([
                        'source' => 'order_completed',
                        'order_number' => $orderNumber.'-1',
                        'sub_order_id' => $subOrderId,
                    ]),
                    'created_by' => $actorId,
                    'updated_by' => $actorId,
                    'created_at' => $incomeAt->toDateTimeString(),
                    'updated_at' => $incomeAt->toDateTimeString(),
                ]);
            }

            if ($status === 'cancelled') {
                // Alasan pembatalan yang wajar untuk toko fashion.
                DB::table('admin_notifications')->insert([
                    'user_id' => $actorId,
                    'actor_id' => $buyer['id'],
                    'module' => 'orders',
                    'type' => 'order.cancelled',
                    'title' => 'Pesanan dibatalkan',
                    'message' => $orderNumber.' · '.($seq % 2 === 0 ? 'Pembeli membatalkan sebelum dikirim' : 'Stok ukuran tidak tersedia'),
                    'reference_type' => 'order',
                    'reference_id' => (string) $orderId,
                    'url' => '/admin/orders?order='.$orderId,
                    'meta' => json_encode(['order_number' => $orderNumber]),
                    'read_at' => $seq % 3 === 0 ? null : $cancelledAt->addMinutes(10)->toDateTimeString(),
                    'is_active' => true,
                    'created_at' => $cancelledAt->toDateTimeString(),
                    'updated_at' => $cancelledAt->toDateTimeString(),
                ]);
            }

            DB::table('seller_customers')->updateOrInsert(
                ['user_id' => $buyer['id']],
                [
                    'note' => $seq % 4 === 0 ? 'Pelanggan reguler, sering repeat order' : 'Pelanggan marketplace',
                    'created_by' => $actorId,
                    'updated_by' => $actorId,
                    'created_at' => $placedAt->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]
            );

            $orderStats['total']++;
        }

        $this->syncStock($variants, $sales, $actorId, $now);
        $this->seedCartActivity($buyers, $variants, $now);
        $this->seedWishlists($buyers, $variants, $now);
        $this->seedVoucherWallet($buyers, $vouchers, $voucherUsage, $buyerVoucherClaims, $now);

        foreach ($voucherUsage as $voucherId => $used) {
            DB::table('vouchers')->where('id', $voucherId)->update([
                'used_count' => $used,
                'updated_by' => $actorId,
                'updated_at' => $now->toDateTimeString(),
            ]);
        }

        $this->command?->info(sprintf(
            'Fashionku: %d pesanan (%d dibayar, %d selesai), %d ulasan, %d pembeli.',
            $orderStats['total'],
            $orderStats['paid'],
            $orderStats['completed'],
            $orderStats['reviews'],
            count($buyers)
        ));
    }

    /**
     * Akun pembeli + alamat. Empat pembeli pertama memakai akun demo yang sama
     * supaya tidak ada identitas ganda di data.
     *
     * @return list<array{id: string, name: string, phone: string, address: string, destination_id: string}>
     */
    private function seedBuyers(CarbonImmutable $now): array
    {
        $buyerRoleId = DB::table('roles')->where('name', 'buyer')->value('id');
        $password = Hash::make(FashionDemoSeeder::PASSWORD);
        $buyers = [];

        foreach (self::BUYERS as $index => $name) {
            $demoAccount = $index < 4;
            $userId = $demoAccount
                ? FashionDemoSeeder::uuidFor('buyer.'.($index + 1))
                : FashionDemoSeeder::uuidFor('marketplace.buyer.'.($index + 1));
            $email = $demoAccount
                ? strtolower(explode(' ', $name)[0]).'@gmail.com'
                : $this->slugify($name).'@gmail.com';

            $city = self::CITIES[$index % count(self::CITIES)];
            $phone = '08'.(11 + ($index % 89)).str_pad((string) (100000 + $index), 7, '0', STR_PAD_LEFT);

            DB::table('users')->updateOrInsert(
                ['email' => $email],
                [
                    'id' => $userId,
                    'password' => $password,
                    'has_set_password' => true,
                    'name' => $name,
                    'avatar' => sprintf('https://randomuser.me/api/portraits/%s/%d.jpg', $index % 2 === 0 ? 'women' : 'men', ($index % 50) + 1),
                    'is_email_verified' => true,
                    'is_active' => true,
                    'banned_at' => null,
                    'created_at' => $now->subDays(150 - $index)->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]
            );

            if ($buyerRoleId !== null) {
                DB::table('user_roles')->insertOrIgnore([
                    'user_id' => $userId,
                    'role_id' => $buyerRoleId,
                    'created_at' => $now->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]);
            }

            $destinationId = 'KMB-'.substr($city[4], 0, 3).'-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);
            $address = $city[5].', '.$city[3].', '.$city[1].' '.$city[4];

            // Akun demo sudah punya alamat dari FashionDemoSeeder; jangan ditimpa.
            $hasAddress = DB::table('addresses')
                ->where('user_id', $userId)
                ->where('is_primary', true)
                ->exists();

            if (! $hasAddress) {
                DB::table('addresses')->insert([
                    'user_id' => $userId,
                    'country' => 'Indonesia',
                    'province' => $city[0],
                    'city_or_regency' => $city[1],
                    'district' => $city[2],
                    'subdistrict' => $city[3],
                    'postal_code' => $city[4],
                    'full_address' => $address,
                    'notes' => $index % 3 === 0 ? 'Titip ke satpam bila tidak ada orang di rumah' : null,
                    'label' => 'Rumah',
                    'recipient_name' => $name,
                    'phone_number' => $phone,
                    'latitude' => round(-6.2 + (($index % 40) / 10), 8),
                    'longitude' => round(106.8 + (($index % 30) / 10), 8),
                    'komerce_destination_id' => $destinationId,
                    'is_primary' => true,
                    'created_at' => $now->subDays(120 - ($index % 100))->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]);
            } else {
                $destinationId = (string) (DB::table('addresses')
                    ->where('user_id', $userId)
                    ->where('is_primary', true)
                    ->value('komerce_destination_id') ?? $destinationId);
            }

            $buyers[] = [
                'id' => $userId,
                'name' => $name,
                'phone' => $phone,
                'address' => $address,
                'destination_id' => $destinationId,
            ];
        }

        return $buyers;
    }

    /**
     * Sebaran umur pesanan (menit lalu). 132 pesanan: belasan masuk hari ini,
     * puluhan beberapa hari terakhir, sisanya riwayat 3 bulan.
     *
     * @return list<int>
     */
    private function orderPlan(): array
    {
        $minutes = [];

        // Menit-menit terakhir: dashboard "pesanan terbaru" langsung terisi.
        foreach ([4, 11, 19, 27, 38, 52, 66, 83, 97, 115, 134, 156] as $value) {
            $minutes[] = $value;
        }
        // Sisa hari ini hingga 24 jam terakhir.
        foreach ([185, 220, 265, 310, 360, 415, 470, 540, 610, 690, 780, 870, 960, 1080, 1200, 1320] as $value) {
            $minutes[] = $value;
        }
        // 1-11 hari terakhir.
        for ($i = 0; $i < 24; $i++) {
            $minutes[] = 1440 + ($i * 137);
        }
        // 4-14 hari terakhir.
        for ($i = 0; $i < 32; $i++) {
            $minutes[] = 4 * 1440 + ($i * 331);
        }
        // Riwayat 15-66 hari terakhir.
        for ($i = 0; $i < 48; $i++) {
            $minutes[] = 15 * 1440 + ($i * 1571);
        }

        return $minutes;
    }

    /**
     * Status pesanan mengikuti umurnya supaya alur terlihat masuk akal.
     */
    private function statusFor(int $minutesAgo, int $seq): string
    {
        $hours = $minutesAgo / 60;

        if ($hours > 72 && $seq % 27 === 0) {
            return 'cancelled';
        }

        if ($hours < 0.75) {
            // Satu pembatalan baru saja masuk, sisanya masih menunggu bayar.
            return $seq === 3 ? 'cancelled' : 'pending';
        }

        if ($hours < 3) {
            return $seq % 3 === 0 ? 'processing' : 'pending';
        }

        if ($hours < 10) {
            return $seq % 5 === 0 ? 'shipped' : 'processing';
        }

        if ($hours < 24) {
            return $seq % 4 === 0 ? 'received' : 'shipped';
        }

        if ($hours < 72) {
            return $seq % 3 === 0 ? 'received' : 'shipped';
        }

        if ($hours < 168) {
            return $seq % 4 === 0 ? 'completed' : 'received';
        }

        return 'completed';
    }

    /**
     * Kurangi stok sesuai penjualan dan catat mutasi keluar yang saldonya
     * berakhir tepat di stok terkini.
     *
     * @param  iterable<int, object>  $variants
     * @param  array<int, list<array<string, mixed>>>  $sales
     */
    private function syncStock(iterable $variants, array $sales, string $actorId, CarbonImmutable $now): void
    {
        $lowStockCandidates = [];

        foreach ($variants as $variant) {
            $variantId = (int) $variant->id;
            $sold = $sales[$variantId] ?? [];
            $soldTotal = array_sum(array_map(static fn (array $row): int => (int) $row['quantity'], $sold));
            $initialStock = (int) $variant->stock;
            $finalStock = max(0, $initialStock - $soldTotal);

            usort($sold, static fn (array $a, array $b): int => strcmp((string) $a['occurred_at'], (string) $b['occurred_at']));

            $balance = $initialStock;
            foreach ($sold as $row) {
                $balance -= (int) $row['quantity'];

                DB::table('stock_movements')->insert([
                    'product_id' => $row['product_id'],
                    'variant_id' => $variantId,
                    'order_id' => $row['order_id'],
                    'order_item_id' => $row['order_item_id'],
                    'movement_key' => 'seed-outbound.'.$row['order_item_id'],
                    'type' => 'outbound',
                    'quantity_delta' => -1 * (int) $row['quantity'],
                    'balance_after' => max(0, $balance),
                    'stock_dimension' => 'available',
                    'reference_type' => 'order_status',
                    'reference_id' => (string) $row['order_id'],
                    'notes' => 'Pengurangan stok pesanan '.$row['order_number'],
                    'occurred_at' => $row['occurred_at'],
                    'created_by' => $actorId,
                    'created_at' => $row['occurred_at'],
                    'updated_at' => $now->toDateTimeString(),
                ]);
            }

            DB::table('product_variants')->where('id', $variantId)->update([
                'stock' => $finalStock,
                'updated_at' => $now->toDateTimeString(),
            ]);

            if ($finalStock <= 5) {
                $lowStockCandidates[] = ['variant' => $variant, 'stock' => $finalStock];
            }
        }

        // Pastikan selalu ada beberapa varian yang benar-benar menipis supaya
        // peringatan stok di panel admin bisa diuji.
        if (count($lowStockCandidates) < 8) {
            foreach ($variants as $variant) {
                if (count($lowStockCandidates) >= 8) {
                    break;
                }

                $alreadyLow = collect($lowStockCandidates)
                    ->contains(fn (array $row): bool => (int) $row['variant']->id === (int) $variant->id);

                if ($alreadyLow) {
                    continue;
                }

                $current = (int) DB::table('product_variants')->where('id', $variant->id)->value('stock');
                $target = count($lowStockCandidates) % 3;
                $delta = $target - $current;

                if ($delta === 0) {
                    continue;
                }

                DB::table('product_variants')->where('id', $variant->id)->update([
                    'stock' => $target,
                    'updated_at' => $now->toDateTimeString(),
                ]);

                DB::table('stock_movements')->insert([
                    'product_id' => $variant->product_id,
                    'variant_id' => $variant->id,
                    'movement_key' => 'seed-opname.'.$variant->id,
                    'type' => 'adjustment',
                    'quantity_delta' => $delta,
                    'balance_after' => $target,
                    'stock_dimension' => 'available',
                    'reference_type' => 'stock_opname',
                    'reference_id' => $now->format('Ymd'),
                    'notes' => 'Penyesuaian stok opname (barang rusak/sampel foto)',
                    'occurred_at' => $now->toDateTimeString(),
                    'created_by' => $actorId,
                    'created_at' => $now->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]);

                $lowStockCandidates[] = ['variant' => $variant, 'stock' => $target];
            }
        }
    }

    /**
     * Keranjang yang masih aktif — sebagian baru diperbarui beberapa menit lalu.
     *
     * @param  list<array<string, string>>  $buyers
     * @param  iterable<int, object>  $variants
     */
    private function seedCartActivity(array $buyers, iterable $variants, CarbonImmutable $now): void
    {
        $available = collect($variants)->filter(
            static fn ($variant): bool => (int) DB::table('product_variants')->where('id', $variant->id)->value('stock') > 0
        )->values();

        if ($available->isEmpty()) {
            return;
        }

        foreach ($buyers as $index => $buyer) {
            if ($index % 4 !== 0) {
                continue;
            }

            $cartId = DB::table('carts')->where('user_id', $buyer['id'])->value('id');

            if (! $cartId) {
                $cartId = DB::table('carts')->insertGetId([
                    'user_id' => $buyer['id'],
                    'created_at' => $now->subDays(20)->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]);
            }

            $updatedAt = $now->subMinutes(3 + ($index % 180));

            foreach (range(0, $index % 2) as $offset) {
                $variant = $available[($index * 5 + $offset * 17) % $available->count()];

                DB::table('cart_items')->updateOrInsert(
                    ['cart_id' => $cartId, 'product_variant_id' => $variant->id],
                    [
                        'quantity' => 1 + (($index + $offset) % 2),
                        'created_at' => $updatedAt->toDateTimeString(),
                        'updated_at' => $updatedAt->toDateTimeString(),
                    ]
                );
            }

            DB::table('carts')->where('id', $cartId)->update([
                'updated_at' => $updatedAt->toDateTimeString(),
            ]);
        }
    }

    /**
     * @param  list<array<string, string>>  $buyers
     * @param  iterable<int, object>  $variants
     */
    private function seedWishlists(array $buyers, iterable $variants, CarbonImmutable $now): void
    {
        $list = collect($variants)->values();

        foreach ($buyers as $index => $buyer) {
            $wishlistId = FashionDemoSeeder::uuidFor('wishlist.'.($index + 1));

            DB::table('wishlists')->updateOrInsert(
                ['user_id' => $buyer['id'], 'name' => 'utama'],
                [
                    'id' => $wishlistId,
                    'created_at' => $now->subDays(90)->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ]
            );

            if ($index % 5 === 0) {
                continue;
            }

            foreach (range(0, $index % 4) as $offset) {
                $variant = $list[($index * 7 + $offset * 19) % $list->count()];

                DB::table('wishlist_items')->insertOrIgnore([
                    'wishlist_id' => $wishlistId,
                    'product_id' => $variant->product_id,
                    'added_at' => $now->subDays($index % 25)->toDateTimeString(),
                ]);
            }
        }
    }

    /**
     * Voucher yang diklaim pembeli + voucher yang sudah terpakai di pesanan.
     *
     * @param  list<array<string, string>>  $buyers
     * @param  iterable<int, object>  $vouchers
     * @param  array<int, int>  $voucherUsage
     * @param  list<array<string, mixed>>  $claims
     */
    private function seedVoucherWallet(array $buyers, iterable $vouchers, array $voucherUsage, array $claims, CarbonImmutable $now): void
    {
        foreach ($claims as $claim) {
            if ($claim['source_id'] === null) {
                continue;
            }

            DB::table('user_vouchers')->insertOrIgnore([
                'user_id' => $claim['user_id'],
                'voucher_id' => $claim['voucher_id'],
                'source_type' => $claim['source_type'],
                'source_id' => $claim['source_id'],
                'status' => 'used',
                'claimed_at' => $claim['used_at']->subMinutes(5)->toDateTimeString(),
                'used_at' => $claim['used_at']->toDateTimeString(),
                'created_at' => $claim['used_at']->subMinutes(5)->toDateTimeString(),
                'updated_at' => $claim['used_at']->toDateTimeString(),
            ]);
        }

        $voucherList = collect($vouchers)->values();

        if ($voucherList->isEmpty()) {
            return;
        }

        foreach ($buyers as $index => $buyer) {
            if ($index % 3 !== 0) {
                continue;
            }

            $voucher = $voucherList[$index % $voucherList->count()];

            DB::table('user_vouchers')->insertOrIgnore([
                'user_id' => $buyer['id'],
                'voucher_id' => $voucher->id,
                'source_type' => 'promotion',
                'source_id' => 'seed-campaign-'.$voucher->id,
                'status' => 'available',
                'claimed_at' => $now->subDays(2 + ($index % 5))->toDateTimeString(),
                'used_at' => null,
                'created_at' => $now->subDays(2 + ($index % 5))->toDateTimeString(),
                'updated_at' => $now->subDays(2 + ($index % 5))->toDateTimeString(),
            ]);
        }
    }

    private function slugify(string $value): string
    {
        return strtolower(trim((string) preg_replace('/[^A-Za-z0-9]+/', '.', $value), '.'));
    }
}
