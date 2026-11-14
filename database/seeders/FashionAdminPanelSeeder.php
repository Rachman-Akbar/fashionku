<?php

declare(strict_types=1);

namespace Database\Seeders;

use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Data operasional panel admin yang dipakai sehari-hari: notifikasi masuk,
 * tiket bantuan pembeli, chat, agenda kerja, bahan baku + HPP produk, dan
 * transaksi keuangan (pengeluaran, utang, piutang).
 *
 * Semua waktu relatif terhadap `now()` supaya panel terasa sedang dipakai.
 */
final class FashionAdminPanelSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Fashionku: menyiapkan data panel admin...');

        $now = CarbonImmutable::now();
        $adminId = FashionDemoSeeder::uuidFor('seller.utama');

        $this->seedRawMaterials($now);
        $this->seedProductCostings($now);
        $this->seedFinance($now, $adminId);
        $this->seedSchedules($now, $adminId);
        $this->seedTickets($now, $adminId);
        $this->seedChats($now, $adminId);
        $this->seedNotifications($now, $adminId);

        $this->command?->info('Fashionku: data panel admin selesai.');
    }

    private function seedRawMaterials(CarbonImmutable $now): void
    {
        $materials = [
            ['RM-KTN-24S', 'Katun Combed 24s', 'kg', 182.5, 60, 96500],
            ['RM-KTN-30S', 'Katun Combed 30s', 'kg', 118.0, 40, 104000],
            ['RM-FLC-20S', 'Cotton Fleece 20s', 'kg', 86.25, 30, 118500],
            ['RM-LNN-BLD', 'Linen Blend', 'meter', 142.0, 50, 68500],
            ['RM-DNM-12OZ', 'Denim 12 oz', 'meter', 94.5, 40, 92000],
            ['RM-KTN-PRM', 'Katun Primisima Batik', 'meter', 61.0, 30, 78000],
            ['RM-RYN', 'Rayon', 'meter', 113.5, 35, 42000],
            ['RM-CRD-500D', 'Cordura 500D', 'meter', 56.0, 20, 135000],
            ['RM-KLT-SAPI', 'Kulit Sapi Full Grain', 'sqft', 72.0, 25, 187000],
            ['RM-BNG-JHT', 'Benang Jahit', 'roll', 228.0, 80, 12500],
            ['RM-KNC', 'Kancing', 'gross', 87.0, 30, 27000],
            ['RM-RST-YKK', 'Resleting YKK', 'pcs', 415.0, 150, 6500],
            ['RM-LBL', 'Label Woven', 'pcs', 1480.0, 400, 850],
            ['RM-BOX', 'Box Packaging', 'pcs', 310.0, 350, 4200],
        ];

        foreach ($materials as $index => [$code, $name, $unit, $opening, $minimum, $cost]) {
            $rawMaterialId = DB::table('raw_materials')->insertGetId([
                'code' => $code,
                'name' => $name,
                'unit' => $unit,
                'stock' => 0,
                'minimum_stock' => $minimum,
                'average_cost' => $cost,
                'is_active' => true,
                'created_at' => $now->subDays(120)->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ]);

            $movements = [
                ['daysAgo' => 95, 'type' => 'in', 'quantity' => $opening + 90, 'unit_cost' => (int) round($cost * 0.94), 'note' => 'Stok awal gudang'],
                ['daysAgo' => 62, 'type' => 'out', 'quantity' => -1 * (30 + ($index % 6) * 7), 'unit_cost' => (int) round($cost * 0.94), 'note' => 'Pemakaian produksi'],
                ['daysAgo' => 41, 'type' => 'out', 'quantity' => -1 * (22 + ($index % 5) * 5), 'unit_cost' => (int) round($cost * 0.94), 'note' => 'Pemakaian produksi'],
                ['daysAgo' => 28, 'type' => 'in', 'quantity' => 80, 'unit_cost' => (int) round($cost * 0.98), 'note' => 'Pembelian PO supplier'],
                ['daysAgo' => 17, 'type' => 'out', 'quantity' => -1 * (25 + ($index % 4) * 6), 'unit_cost' => (int) round($cost * 0.98), 'note' => 'Pemakaian produksi'],
                ['daysAgo' => 4, 'type' => 'in', 'quantity' => 70, 'unit_cost' => $cost, 'note' => 'Pembelian PO supplier'],
                ['daysAgo' => 1, 'type' => 'out', 'quantity' => -1 * (15 + ($index % 3) * 4), 'unit_cost' => $cost, 'note' => 'Pemakaian produksi'],
            ];

            $balance = 0.0;
            $oldCost = (float) round($cost * 0.94);

            foreach ($movements as $movement) {
                $quantity = (float) $movement['quantity'];
                $balance += $quantity;
                $occurredAt = $now->subDays($movement['daysAgo'])->setTime(9 + ($index % 8), ($index * 7) % 60);

                $movementId = DB::table('raw_material_stock_movements')->insertGetId([
                    'raw_material_id' => $rawMaterialId,
                    'type' => $movement['type'],
                    'quantity_delta' => $quantity,
                    'balance_after' => max(0, $balance),
                    'unit_cost' => $movement['unit_cost'],
                    'total_cost' => round(abs($quantity) * $movement['unit_cost'], 2),
                    'reference_type' => $movement['type'] === 'in' ? 'purchase' : 'production',
                    'reference_number' => $movement['type'] === 'in'
                        ? 'PO-'.now()->format('Y').'-'.str_pad((string) ($index * 4 + $movement['daysAgo']), 4, '0', STR_PAD_LEFT)
                        : 'PRD-'.now()->format('Ymd').'-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    'notes' => $movement['note'],
                    'occurred_at' => $occurredAt->toDateTimeString(),
                    'created_at' => $occurredAt->toDateTimeString(),
                    'updated_at' => $occurredAt->toDateTimeString(),
                ]);

                $newCost = (float) $movement['unit_cost'];
                if ($movement['type'] === 'in' && abs($newCost - $oldCost) > 0.01) {
                    DB::table('raw_material_cost_histories')->insert([
                        'raw_material_id' => $rawMaterialId,
                        'raw_material_stock_movement_id' => $movementId,
                        'old_average_cost' => $oldCost,
                        'new_average_cost' => $newCost,
                        'change_amount' => $newCost - $oldCost,
                        'change_percent' => $oldCost > 0 ? round((($newCost - $oldCost) / $oldCost) * 100, 4) : 0,
                        'direction' => $newCost > $oldCost ? 'up' : 'down',
                        'reference_type' => 'purchase',
                        'reference_number' => 'PO-'.now()->format('Y').'-'.str_pad((string) ($index * 4 + $movement['daysAgo']), 4, '0', STR_PAD_LEFT),
                        'occurred_at' => $occurredAt->toDateTimeString(),
                        'created_at' => $occurredAt->toDateTimeString(),
                        'updated_at' => $occurredAt->toDateTimeString(),
                    ]);
                    $oldCost = $newCost;
                }
            }

            DB::table('raw_materials')->where('id', $rawMaterialId)->update([
                'stock' => max(0, $balance),
                'average_cost' => $cost,
                'updated_at' => $now->toDateTimeString(),
            ]);
        }
    }

    private function seedProductCostings(CarbonImmutable $now): void
    {
        $materials = DB::table('raw_materials')->orderBy('id')->get(['id', 'average_cost']);
        $products = DB::table('products')
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get(['id', 'name']);

        if ($materials->isEmpty() || $products->isEmpty()) {
            return;
        }

        $histories = DB::table('raw_material_cost_histories')
            ->orderByDesc('occurred_at')
            ->get(['id', 'raw_material_id'])
            ->groupBy('raw_material_id');

        $impactCreated = 0;
        $impacts = [];

        foreach ($products as $index => $product) {
            $selling = (float) DB::table('product_variants')
                ->where('product_id', $product->id)
                ->orderByDesc('is_default')
                ->value('price');

            if ($selling <= 0) {
                continue;
            }

            $first = $materials[$index % $materials->count()];
            $second = $materials[($index * 3 + 5) % $materials->count()];
            if ((int) $second->id === (int) $first->id) {
                $second = $materials[($index + 1) % $materials->count()];
            }

            // Komposisi bahan dibuat proporsional terhadap harga jual (32-43%).
            $materialTarget = $selling * (0.32 + (($index % 12) / 100));
            $qtyFirst = round(($materialTarget * 0.62) / max(1, (float) $first->average_cost), 2);
            $qtySecond = round(($materialTarget * 0.38) / max(1, (float) $second->average_cost), 2);

            $materialCost = round(
                $qtyFirst * (float) $first->average_cost + $qtySecond * (float) $second->average_cost,
                2
            );
            $labor = round($selling * 0.16, 2);
            $overhead = round($selling * 0.07, 2);
            $other = round($selling * 0.02, 2);
            $hpp = round($materialCost + $labor + $overhead + $other, 2);
            $margin = 28 + ($index % 18);
            $suggested = round($hpp * (1 + $margin / 100), 2);

            DB::table('product_materials')->insert([
                [
                    'product_id' => $product->id,
                    'raw_material_id' => $first->id,
                    'quantity' => max(0.01, $qtyFirst),
                    'unit_cost' => $first->average_cost,
                    'total_cost' => round(max(0.01, $qtyFirst) * (float) $first->average_cost, 2),
                    'created_at' => $now->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ],
                [
                    'product_id' => $product->id,
                    'raw_material_id' => $second->id,
                    'quantity' => max(0.01, $qtySecond),
                    'unit_cost' => $second->average_cost,
                    'total_cost' => round(max(0.01, $qtySecond) * (float) $second->average_cost, 2),
                    'created_at' => $now->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ],
            ]);

            DB::table('product_costings')->insert([
                'product_id' => $product->id,
                'material_cost' => $materialCost,
                'labor_cost' => $labor,
                'overhead_cost' => $overhead,
                'other_cost' => $other,
                'hpp' => $hpp,
                'margin_percent' => $margin,
                'suggested_price' => $suggested,
                'selling_price' => $selling,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ]);

            // Beberapa produk punya riwayat perubahan HPP karena harga bahan naik.
            if ($impactCreated < 7 && $index % 13 === 0) {
                $history = $histories->get((int) $first->id)?->first();
                $oldHpp = round($hpp * 0.94, 2);
                $impacts[] = [
                    'product_id' => $product->id,
                    'raw_material_id' => $first->id,
                    'raw_material_cost_history_id' => $history?->id,
                    'old_material_cost' => round($materialCost * 0.93, 2),
                    'new_material_cost' => $materialCost,
                    'old_hpp' => $oldHpp,
                    'new_hpp' => $hpp,
                    'hpp_change_amount' => round($hpp - $oldHpp, 2),
                    'hpp_change_percent' => round((($hpp - $oldHpp) / max(1, $oldHpp)) * 100, 4),
                    'old_suggested_price' => round($oldHpp * (1 + $margin / 100), 2),
                    'new_suggested_price' => $suggested,
                    'trigger_type' => 'raw_material_cost_change',
                    'occurred_at' => $now->subDays(3 + ($impactCreated % 5))->toDateTimeString(),
                    'created_at' => $now->toDateTimeString(),
                    'updated_at' => $now->toDateTimeString(),
                ];
                $impactCreated++;
            }
        }

        foreach ($impacts as $impact) {
            DB::table('product_costing_impacts')->insert($impact);
        }
    }

    private function seedFinance(CarbonImmutable $now, string $adminId): void
    {
        $reference = static fn (string $prefix, int $index): string => $prefix.'-'.$now->format('Ymd').'-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

        $expenses = [
            ['Marketing', 'Iklan Meta Ads minggu ini', 1_850_000, 1],
            ['Marketing', 'Iklan TikTok & affiliate', 1_275_000, 3],
            ['Logistik', 'Subsidi ongkir promo gratis ongkir', 480_000, 0],
            ['Operasional', 'Packing, bubble wrap & lakban', 640_000, 2],
            ['Operasional', 'Sewa gudang bulanan', 3_500_000, 12],
            ['Gaji', 'Gaji admin, packing & CS', 8_400_000, 5],
            ['Operasional', 'Listrik, air & internet gudang', 1_150_000, 8],
            ['Logistik', 'Pickup kurir & retur barang', 325_000, 6],
            ['Marketing', 'Foto produk & sewa studio', 1_500_000, 14],
            ['Operasional', 'ATK, kertas invoice & label', 215_000, 18],
            ['Operasional', 'Servis mesin jahit', 475_000, 21],
            ['Marketing', 'Giveaway & sample KOL', 900_000, 25],
            ['Operasional', 'Konsumsi tim packing', 300_000, 30],
            ['Logistik', 'Ongkir retur pelanggan', 180_000, 35],
        ];

        foreach ($expenses as $index => [$category, $title, $amount, $daysAgo]) {
            $occurredAt = $now->subDays($daysAgo)->setTime(10 + ($index % 8), ($index * 11) % 60);

            DB::table('financial_transactions')->insert([
                'order_id' => null,
                'user_id' => null,
                'reference_number' => $reference('EXP', $index),
                'type' => 'expense',
                'category' => strtolower($category),
                'title' => $title,
                'description' => 'Pengeluaran operasional toko: '.$title,
                'amount' => $amount,
                'paid_amount' => $amount,
                'status' => 'posted',
                'due_date' => null,
                'occurred_at' => $occurredAt->toDateTimeString(),
                'settled_at' => $occurredAt->toDateTimeString(),
                'is_active' => true,
                'metadata' => json_encode(['source' => 'manual_entry']),
                'created_by' => $adminId,
                'updated_by' => $adminId,
                'created_at' => $occurredAt->toDateTimeString(),
                'updated_at' => $occurredAt->toDateTimeString(),
            ]);
        }

        // Utang usaha: satu sudah lewat jatuh tempo, satu jatuh tempo minggu ini.
        $payables = [
            ['Inv supplier katun combed 24s & 30s', 12_400_000, 6_000_000, 3, 'partial', 'open'],
            ['Inv konveksi jahit batch Desember', 8_750_000, 0, 7, 'unpaid', 'open'],
            ['Inv supplier box & label packaging', 2_100_000, 2_100_000, -2, 'paid', 'paid'],
            ['Inv import sepatu & tas (termin 2)', 15_000_000, 5_000_000, -1, 'partial', 'open'],
        ];

        foreach ($payables as $index => [$title, $amount, $paid, $dueOffset, $paymentLabel, $status]) {
            $issuedAt = $now->subDays(20 - $index * 3)->setTime(11, 0);
            $transactionId = DB::table('financial_transactions')->insertGetId([
                'order_id' => null,
                'user_id' => null,
                'reference_number' => $reference('PAY', $index),
                'type' => 'payable',
                'category' => 'supplier',
                'title' => $title,
                'description' => 'Tagihan supplier, termin pembayaran '.($dueOffset >= 0 ? 'jatuh tempo '.$dueOffset.' hari lagi' : 'sudah lewat jatuh tempo'),
                'amount' => $amount,
                'paid_amount' => $paid,
                'status' => $status,
                'due_date' => $now->addDays($dueOffset)->toDateString(),
                'occurred_at' => $issuedAt->toDateTimeString(),
                'settled_at' => $status === 'paid' ? $now->subDays(2)->toDateTimeString() : null,
                'is_active' => true,
                'metadata' => json_encode(['payment_term' => 'net-30', 'payment_label' => $paymentLabel]),
                'created_by' => $adminId,
                'updated_by' => $adminId,
                'created_at' => $issuedAt->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ]);

            if ($paid > 0) {
                $paidAt = $now->subDays(4 + $index)->setTime(14, 20);
                DB::table('financial_payment_histories')->insert([
                    'financial_transaction_id' => $transactionId,
                    'recorded_by' => $adminId,
                    'amount' => $paid,
                    'balance_before' => $amount,
                    'balance_after' => $amount - $paid,
                    'payment_method' => 'bank_transfer',
                    'reference_number' => 'TRF-'.$now->format('Ymd').'-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    'notes' => $paid >= $amount ? 'Pelunasan tagihan supplier' : 'Pembayaran termin pertama',
                    'paid_at' => $paidAt->toDateTimeString(),
                    'created_at' => $paidAt->toDateTimeString(),
                    'updated_at' => $paidAt->toDateTimeString(),
                ]);
            }
        }

        $receivables = [
            ['Pencairan dana marketplace (Shopee & TikTok)', 6_250_000, 0, 2],
            ['Invoice reseller Bandung — batch 24 pcs', 3_400_000, 1_700_000, 5],
        ];

        foreach ($receivables as $index => [$title, $amount, $paid, $dueOffset]) {
            $issuedAt = $now->subDays(6 - $index * 2)->setTime(9, 30);
            $transactionId = DB::table('financial_transactions')->insertGetId([
                'order_id' => null,
                'user_id' => null,
                'reference_number' => $reference('RCV', $index),
                'type' => 'receivable',
                'category' => 'penjualan',
                'title' => $title,
                'description' => 'Piutang penjualan yang belum cair',
                'amount' => $amount,
                'paid_amount' => $paid,
                'status' => $paid >= $amount ? 'paid' : ($paid > 0 ? 'partial' : 'open'),
                'due_date' => $now->addDays($dueOffset)->toDateString(),
                'occurred_at' => $issuedAt->toDateTimeString(),
                'settled_at' => null,
                'is_active' => true,
                'metadata' => json_encode(['source' => 'sales']),
                'created_by' => $adminId,
                'updated_by' => $adminId,
                'created_at' => $issuedAt->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ]);

            if ($paid > 0) {
                $paidAt = $now->subDays(2)->setTime(16, 5);
                DB::table('financial_payment_histories')->insert([
                    'financial_transaction_id' => $transactionId,
                    'recorded_by' => $adminId,
                    'amount' => $paid,
                    'balance_before' => $amount,
                    'balance_after' => $amount - $paid,
                    'payment_method' => 'bank_transfer',
                    'reference_number' => 'RCV-TRF-'.$now->format('Ymd').'-'.($index + 1),
                    'notes' => 'Pembayaran sebagian dari reseller',
                    'paid_at' => $paidAt->toDateTimeString(),
                    'created_at' => $paidAt->toDateTimeString(),
                    'updated_at' => $paidAt->toDateTimeString(),
                ]);
            }
        }
    }

    private function seedSchedules(CarbonImmutable $now, string $adminId): void
    {
        $schedules = [
            ['Packing & serahkan pesanan ke kurir', 'order', 'in_progress', 0, '09:00:00', '11:00:00', 'high', '#10B981', 'Operasional', 'Tim packing', 0],
            ['Restock katun combed 24s ke supplier', 'inventory', 'todo', 0, '13:00:00', '15:00:00', 'high', '#F59E0B', 'Gudang', 'Nadia', 0],
            ['Balas chat & keluhan pembeli', 'support', 'todo', 0, '16:00:00', '17:00:00', 'normal', '#3B82F6', 'CS', 'Rafi', 0],
            ['Foto koleksi outerwear Desember', 'content', 'todo', 1, '10:00:00', '14:00:00', 'normal', '#8B5CF6', 'Konten', 'Tim konten', 1],
            ['Meeting supplier konveksi batch baru', 'meeting', 'todo', 2, '14:00:00', '15:30:00', 'high', '#EF4444', 'Produksi', 'Nadia', 0],
            ['Stock opname gudang & packaging', 'inventory', 'todo', 3, '08:00:00', '12:00:00', 'normal', '#F59E0B', 'Gudang', 'Tim gudang', 0],
            ['Rekap penjualan & laporan mingguan', 'finance', 'done', -1, '16:00:00', '17:30:00', 'normal', '#10B981', 'Keuangan', 'Nadia', 1],
            ['Upload produk baru ke katalog', 'content', 'done', -2, '11:00:00', '13:00:00', 'normal', '#8B5CF6', 'Konten', 'Rafi', 1],
            ['Cek kualitas retur barang', 'other', 'todo', 4, '09:00:00', '10:00:00', 'low', '#6B7280', 'Gudang', 'Tim gudang', 0],
        ];

        foreach ($schedules as $index => [$title, $type, $status, $dayOffset, $start, $end, $priority, $color, $label, $assignee, $done]) {
            $date = $now->addDays($dayOffset);
            $createdAt = $now->subDays(5)->setTime(9, 0);

            DB::table('schedules')->insert([
                'user_id' => $adminId,
                'title' => $title,
                'description' => $type === 'inventory'
                    ? 'Cek fisik stok, catat selisih, lalu sesuaikan di menu inventory.'
                    : null,
                'type' => $type,
                'status' => $status,
                'position' => $index,
                'assignee' => $assignee,
                'label' => $label,
                'priority' => $priority,
                'color' => $color,
                'date' => $date->toDateString(),
                'capacity' => 1,
                'recurrence' => 'none',
                'start_time' => $start,
                'end_time' => $end,
                'is_all_day' => false,
                'is_completed' => $done === 1,
                'completed_at' => $done === 1 ? $date->setTime(17, 0)->toDateTimeString() : null,
                'metadata' => json_encode(['seeded' => true]),
                'completion_proof' => null,
                'is_active' => true,
                'created_by' => $adminId,
                'updated_by' => $adminId,
                'created_at' => $createdAt->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ]);
        }
    }

    private function seedTickets(CarbonImmutable $now, string $adminId): void
    {
        $buyers = DB::table('users')
            ->whereIn('email', ['sinta@gmail.com', 'dimas@gmail.com', 'alya@gmail.com', 'bagus@gmail.com'])
            ->pluck('id')
            ->values();

        if ($buyers->count() < 4) {
            return;
        }

        $orders = DB::table('orders')->orderByDesc('created_at')->limit(8)->pluck('id', 'order_number');

        $tickets = [
            [
                'buyer' => 0, 'category' => 'payment', 'priority' => 'urgent', 'status' => 'open',
                'subject' => 'QRIS sudah terpotong tapi pesanan belum masuk',
                'description' => 'Halo, saya bayar pakai QRIS sekitar 20 menit lalu. Saldo sudah terpotong Rp 329.000, tapi di halaman pesanan statusnya masih menunggu pembayaran. Mohon dicek ya.',
                'minutesAgo' => 24, 'order' => null,
            ],
            [
                'buyer' => 1, 'category' => 'order', 'priority' => 'high', 'status' => 'in_progress',
                'subject' => 'Pesanan belum bergerak dari status diproses',
                'description' => 'Pesanan saya sudah dua hari masih "diproses". Rencana mau dipakai acara Sabtu, masih bisa dikirim hari ini?',
                'minutesAgo' => 95, 'order' => 0,
            ],
            [
                'buyer' => 2, 'category' => 'product', 'priority' => 'normal', 'status' => 'in_progress',
                'subject' => 'Ukuran kemeja linen oversize untuk tinggi 168 cm',
                'description' => 'Saya tinggi 168 cm, berat 62 kg. Lebih baik ambil size M atau L untuk kemeja linen oversize? Takut terlalu panjang di lengan.',
                'minutesAgo' => 210, 'order' => null,
            ],
            [
                'buyer' => 3, 'category' => 'order', 'priority' => 'normal', 'status' => 'resolved',
                'subject' => 'Minta tukar ukuran dress dari M ke L',
                'description' => 'Dress midi linen yang saya terima sedikit sempit di pinggang. Bisa tukar ke ukuran L? Label masih utuh dan belum saya pakai keluar.',
                'minutesAgo' => 2 * 1440, 'order' => 1,
            ],
            [
                'buyer' => 0, 'category' => 'store', 'priority' => 'low', 'status' => 'open',
                'subject' => 'Bisa kirim ke Singapura?',
                'description' => 'Saya mau kirim beberapa item ke saudara di Singapura. Apakah bisa dikirim ke luar negeri dan berapa estimasi ongkirnya?',
                'minutesAgo' => 1440, 'order' => null,
            ],
            [
                'buyer' => 2, 'category' => 'technical', 'priority' => 'normal', 'status' => 'closed',
                'subject' => 'Tidak bisa login setelah ganti nomor HP',
                'description' => 'Setelah ganti nomor HP, kode OTP tidak masuk ke nomor baru saya. Sudah coba kirim ulang tiga kali.',
                'minutesAgo' => 6 * 1440, 'order' => null,
            ],
        ];

        foreach ($tickets as $index => $ticket) {
            $buyerId = $buyers[$ticket['buyer']];
            $createdAt = $now->subMinutes($ticket['minutesAgo']);
            $resolved = in_array($ticket['status'], ['resolved', 'closed'], true);
            $lastRepliedAt = $ticket['status'] === 'open'
                ? null
                : $createdAt->addMinutes(35 + ($index * 11));

            $ticketNumber = 'TKT-'.$createdAt->format('Ymd').'-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);

            $ticketId = DB::table('support_tickets')->insertGetId([
                'ticket_number' => $ticketNumber,
                'user_id' => $buyerId,
                'order_id' => $ticket['order'] !== null ? $orders->values()[$ticket['order']] ?? null : null,
                'category' => $ticket['category'],
                'subject' => $ticket['subject'],
                'description' => $ticket['description'],
                'priority' => $ticket['priority'],
                'status' => $ticket['status'],
                'assigned_to' => $ticket['status'] === 'open' ? null : $adminId,
                'last_replied_at' => $lastRepliedAt?->toDateTimeString(),
                'resolved_at' => $resolved ? $lastRepliedAt?->toDateTimeString() : null,
                'is_active' => true,
                'created_by' => $buyerId,
                'updated_by' => $adminId,
                'created_at' => $createdAt->toDateTimeString(),
                'updated_at' => ($lastRepliedAt ?? $createdAt)->toDateTimeString(),
            ]);

            DB::table('support_ticket_messages')->insert([
                'ticket_id' => $ticketId,
                'user_id' => $buyerId,
                'message' => $ticket['description'],
                'attachments' => null,
                'is_internal' => false,
                'read_at' => $createdAt->addMinutes(2)->toDateTimeString(),
                'created_at' => $createdAt->toDateTimeString(),
                'updated_at' => $createdAt->toDateTimeString(),
            ]);

            if ($lastRepliedAt !== null) {
                $adminReply = match ($ticket['category']) {
                    'payment' => 'Terima kasih laporannya. Pembayaran QRIS Anda sudah kami cek dan akan kami sinkronkan dalam beberapa menit. Mohon tunggu, pesanan tidak akan hangus.',
                    'order' => 'Pesanan sudah kami teruskan ke tim packing. Estimasi pickup kurir hari ini sebelum jam 17.00, nomor resi akan muncul di halaman pesanan.',
                    'product' => 'Untuk tinggi 168 cm, kami sarankan size M agar panjang lengan tidak berlebih. Kalau ingin lebih longgar, size L masih oke dengan potongan oversize.',
                    'technical' => 'Nomor HP sudah kami perbarui. Silakan coba kirim ulang kode OTP, jika masih tidak masuk hubungi kami lagi ya.',
                    'store' => 'Untuk pengiriman ke Singapura saat ini belum tersedia otomatis. Bisa via ekspedisi rekanan, nanti kami bantu hitung ongkirnya.',
                    default => 'Terima kasih sudah menghubungi Fashionku. Kami bantu cek dan kabari secepatnya.',
                };

                DB::table('support_ticket_messages')->insert([
                    'ticket_id' => $ticketId,
                    'user_id' => $adminId,
                    'message' => $adminReply,
                    'attachments' => null,
                    'is_internal' => false,
                    'read_at' => $lastRepliedAt->addMinutes(3)->toDateTimeString(),
                    'created_at' => $lastRepliedAt->toDateTimeString(),
                    'updated_at' => $lastRepliedAt->toDateTimeString(),
                ]);
            }

            if ($index === 1) {
                DB::table('support_ticket_messages')->insert([
                    'ticket_id' => $ticketId,
                    'user_id' => $adminId,
                    'message' => 'Internal: stok varian warna hitam tinggal 2 pcs, tawarkan warna navy bila pembeli butuh cepat.',
                    'attachments' => null,
                    'is_internal' => true,
                    'read_at' => null,
                    'created_at' => $createdAt->addMinutes(50)->toDateTimeString(),
                    'updated_at' => $createdAt->addMinutes(50)->toDateTimeString(),
                ]);
            }

            if ($resolved) {
                DB::table('support_ticket_messages')->insert([
                    'ticket_id' => $ticketId,
                    'user_id' => $buyerId,
                    'message' => 'Sudah diterima dan sesuai, terima kasih bantuannya.',
                    'attachments' => null,
                    'is_internal' => false,
                    'read_at' => $lastRepliedAt->addMinutes(20)->toDateTimeString(),
                    'created_at' => $lastRepliedAt->addMinutes(18)->toDateTimeString(),
                    'updated_at' => $lastRepliedAt->addMinutes(18)->toDateTimeString(),
                ]);
            }
        }
    }

    private function seedChats(CarbonImmutable $now, string $adminId): void
    {
        $buyers = DB::table('users')
            ->whereIn('email', ['sinta@gmail.com', 'dimas@gmail.com', 'alya@gmail.com', 'bagus@gmail.com'])
            ->get(['id', 'name'])
            ->values();

        if ($buyers->count() < 4) {
            return;
        }

        $latestOrders = DB::table('orders')->orderByDesc('created_at')->limit(6)->get(['id', 'order_number'])->values();

        $chats = [
            [
                'buyer' => 0, 'subject' => 'Stok kaos oversize cream', 'minutesAgo' => 16,
                'order' => null,
                'messages' => [
                    [0, 'Kak, kaos oversize cream size L masih ready?'],
                    [1, 'Halo Kak Sinta, ready. Stok terakhir 4 pcs untuk size L.'],
                    [0, 'Oke, kalau tinggi 165 cm berat 55 kg mending L atau XL ya?'],
                    [1, 'Lebih aman L Kak, potongannya sudah oversize. Kalau mau lebih longgar bisa XL.'],
                ],
            ],
            [
                'buyer' => 1, 'subject' => 'Pesanan mau dikirim hari ini', 'minutesAgo' => 48,
                'order' => 1,
                'messages' => [
                    [0, 'Halo, pesanan saya bisa dikirim hari ini? Mau dipakai Sabtu.'],
                    [1, 'Bisa Kak Dimas, pesanan sudah masuk antrian packing. Insya Allah pickup sore ini.'],
                    [0, 'Siap, kalau bisa pilih JNE REG ya.'],
                    [1, 'Baik, sudah kami catat. Nomor resi menyusul lewat halaman pesanan.'],
                ],
            ],
            [
                'buyer' => 2, 'subject' => 'Tukar ukuran dress midi', 'minutesAgo' => 150,
                'order' => 0,
                'messages' => [
                    [0, 'Kak, dress midi linen yang datang agak sempit di pinggang. Bisa tukar L?'],
                    [1, 'Bisa Kak Alya, label masih utuh ya? Nanti kami kirim panduan pengembaliannya.'],
                    [0, 'Masih utuh, belum dipakai keluar.'],
                ],
            ],
            [
                'buyer' => 3, 'subject' => 'Rekomendasi sepatu kerja pria', 'minutesAgo' => 380,
                'order' => null,
                'messages' => [
                    [0, 'Rekomendasi sepatu kerja yang nyaman dipakai seharian?'],
                    [1, 'Loafers kulit cokelat atau pantofel navy paling sering dipilih. Keduanya solnya empuk.'],
                    [0, 'Kalau ukuran 42 biasanya pakai 42 juga kan?'],
                    [1, 'Betul Kak, true to size. Kalau kaki agak lebar, naik setengah size tidak tersedia, jadi ambil 43.'],
                ],
            ],
            [
                'buyer' => 1, 'subject' => 'Invoice pesanan untuk reimbursement', 'minutesAgo' => 2 * 1440,
                'order' => 2,
                'messages' => [
                    [0, 'Bisa kirim invoice pesanan saya dalam bentuk PDF?'],
                    [1, 'Tentu, sudah kami kirim ke email yang terdaftar ya Kak.'],
                ],
            ],
        ];

        foreach ($chats as $index => $chat) {
            $buyer = $buyers[$chat['buyer']];
            $conversationCreatedAt = $now->subMinutes($chat['minutesAgo'] + 60);
            $lastMessageAt = $now->subMinutes($chat['minutesAgo']);

            $conversationId = DB::table('conversations')->insertGetId([
                'type' => $chat['order'] !== null ? 'order' : 'direct',
                'order_id' => $chat['order'] !== null ? $latestOrders[$chat['order']]->id ?? null : null,
                'subject' => $chat['subject'],
                'target_role' => null,
                'is_active' => true,
                'created_by' => $buyer->id,
                'updated_by' => $adminId,
                'created_at' => $conversationCreatedAt->toDateTimeString(),
                'updated_at' => $lastMessageAt->toDateTimeString(),
            ]);

            DB::table('conversation_participants')->insert([
                [
                    'conversation_id' => $conversationId,
                    'user_id' => $buyer->id,
                    'last_read_at' => $lastMessageAt->toDateTimeString(),
                    'joined_at' => $conversationCreatedAt->toDateTimeString(),
                    'left_at' => null,
                    'is_muted' => false,
                ],
                [
                    'conversation_id' => $conversationId,
                    'user_id' => $adminId,
                    'last_read_at' => $index < 2 ? $lastMessageAt->subMinutes(30)->toDateTimeString() : $lastMessageAt->toDateTimeString(),
                    'joined_at' => $conversationCreatedAt->toDateTimeString(),
                    'left_at' => null,
                    'is_muted' => false,
                ],
            ]);

            $total = count($chat['messages']);
            foreach ($chat['messages'] as $position => [$sender, $message]) {
                $sentAt = $conversationCreatedAt->addMinutes((int) round(($position + 1) * (($chat['minutesAgo'] + 60) / ($total + 1))));
                $messageId = DB::table('chat_messages')->insertGetId([
                    'conversation_id' => $conversationId,
                    'sender_id' => $sender === 0 ? $buyer->id : $adminId,
                    'message_type' => 'text',
                    'message' => $message,
                    'attachments' => null,
                    'edited_at' => null,
                    'created_at' => $sentAt->toDateTimeString(),
                    'updated_at' => $sentAt->toDateTimeString(),
                ]);

                // Pesan lama sudah dibaca kedua pihak; pesan terakhir bisa belum.
                if ($position < $total - 1) {
                    DB::table('chat_message_reads')->insertOrIgnore([
                        ['message_id' => $messageId, 'user_id' => $buyer->id, 'read_at' => $sentAt->addMinutes(2)->toDateTimeString()],
                        ['message_id' => $messageId, 'user_id' => $adminId, 'read_at' => $sentAt->addMinutes(3)->toDateTimeString()],
                    ]);
                } else {
                    DB::table('chat_message_reads')->insertOrIgnore([
                        ['message_id' => $messageId, 'user_id' => $sender === 0 ? $buyer->id : $adminId, 'read_at' => $sentAt->toDateTimeString()],
                    ]);
                }
            }
        }
    }

    private function seedNotifications(CarbonImmutable $now, string $adminId): void
    {
        $latestOrders = DB::table('orders')->orderByDesc('created_at')->limit(4)->get(['id', 'order_number', 'total_amount', 'status'])->values();
        $latestTickets = DB::table('support_tickets')->orderByDesc('created_at')->limit(3)->get(['id', 'ticket_number', 'subject', 'priority'])->values();
        $latestReview = DB::table('product_reviews')
            ->join('products', 'products.id', '=', 'product_reviews.product_id')
            ->orderByDesc('product_reviews.created_at')
            ->select('product_reviews.*', 'products.name as product_name')
            ->first();
        $lowStock = DB::table('product_variants as pv')
            ->join('products as p', 'p.id', '=', 'pv.product_id')
            ->where('pv.stock', '<=', DB::raw('pv.min_stock'))
            ->orderBy('pv.stock')
            ->limit(3)
            ->get(['pv.id', 'pv.sku', 'pv.name as variant_name', 'pv.stock', 'p.name as product_name'])
            ->values();

        $rows = [];

        foreach ($latestOrders as $index => $order) {
            $rows[] = [
                'user_id' => $adminId,
                'actor_id' => null,
                'module' => 'orders',
                'type' => 'order.created',
                'title' => $index === 0 ? 'Pesanan baru masuk' : 'Pesanan baru',
                'message' => $order->order_number.' · Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                'reference_type' => 'order',
                'reference_id' => (string) $order->id,
                'url' => '/admin/orders?order='.$order->id,
                'meta' => json_encode(['order_number' => $order->order_number, 'status' => $order->status]),
                'read_at' => $index < 2 ? null : $now->subMinutes(30)->toDateTimeString(),
                'created_at' => $now->subMinutes(5 + $index * 23)->toDateTimeString(),
            ];
        }

        foreach ($latestTickets as $index => $ticket) {
            $rows[] = [
                'user_id' => $adminId,
                'actor_id' => null,
                'module' => 'support',
                'type' => 'support.ticket.created',
                'title' => 'Help baru: '.$ticket->ticket_number,
                'message' => $ticket->subject,
                'reference_type' => 'support_ticket',
                'reference_id' => (string) $ticket->id,
                'url' => '/admin/help?ticket='.$ticket->id,
                'meta' => json_encode(['priority' => $ticket->priority]),
                'read_at' => $index === 0 ? null : $now->subMinutes(90)->toDateTimeString(),
                'created_at' => $now->subMinutes(20 + $index * 55)->toDateTimeString(),
            ];
        }

        foreach ($lowStock as $index => $variant) {
            $rows[] = [
                'user_id' => $adminId,
                'actor_id' => null,
                'module' => 'inventory',
                'type' => 'stock.low',
                'title' => 'Stok menipis',
                'message' => $variant->product_name.' ('.$variant->variant_name.') tersisa '.$variant->stock.' pcs · SKU '.$variant->sku,
                'reference_type' => 'product_variant',
                'reference_id' => (string) $variant->id,
                'url' => '/admin/products/'.$variant->id.'/stock',
                'meta' => json_encode(['stock' => (int) $variant->stock, 'sku' => $variant->sku]),
                'read_at' => $index === 0 ? null : $now->subHours(2)->toDateTimeString(),
                'created_at' => $now->subMinutes(45 + $index * 15)->toDateTimeString(),
            ];
        }

        if ($latestReview !== null) {
            $rows[] = [
                'user_id' => $adminId,
                'actor_id' => $latestReview->user_id,
                'module' => 'reviews',
                'type' => 'review.created',
                'title' => 'Ulasan baru '.$latestReview->rating.' bintang',
                'message' => $latestReview->product_name.' · '.mb_strimwidth((string) $latestReview->review, 0, 90, '...'),
                'reference_type' => 'product_review',
                'reference_id' => (string) $latestReview->id,
                'url' => '/admin/reviews/'.$latestReview->id,
                'meta' => json_encode(['rating' => (int) $latestReview->rating]),
                'read_at' => $now->subHours(3)->toDateTimeString(),
                'created_at' => $now->subHours(4)->toDateTimeString(),
            ];
        }

        $pendingPromotion = DB::table('promotions')->where('approval_status', 'pending')->first();
        if ($pendingPromotion !== null) {
            $rows[] = [
                'user_id' => $adminId,
                'actor_id' => null,
                'module' => 'promotions',
                'type' => 'promotion.submitted',
                'title' => 'Promosi menunggu persetujuan',
                'message' => $pendingPromotion->name,
                'reference_type' => 'promotion',
                'reference_id' => (string) $pendingPromotion->id,
                'url' => '/admin/promotions?promotion='.$pendingPromotion->id,
                'meta' => json_encode(['approval_status' => 'pending']),
                'read_at' => null,
                'created_at' => $now->subMinutes(75)->toDateTimeString(),
            ];
        }

        $rows[] = [
            'user_id' => $adminId,
            'actor_id' => null,
            'module' => 'finance',
            'type' => 'finance.payout',
            'title' => 'Dana marketplace cair',
            'message' => 'Rp 6.250.000 masuk ke rekening BCA · pencairan Shopee & TikTok',
            'reference_type' => 'financial_transaction',
            'reference_id' => null,
            'url' => '/admin/finance',
            'meta' => json_encode(['amount' => 6250000]),
            'read_at' => $now->subDay()->toDateTimeString(),
            'created_at' => $now->subDay()->subHours(3)->toDateTimeString(),
        ];

        foreach ($rows as $row) {
            DB::table('admin_notifications')->insert([
                ...$row,
                'is_active' => true,
                'created_at' => $row['created_at'],
                'updated_at' => $row['created_at'],
            ]);
        }
    }
}
