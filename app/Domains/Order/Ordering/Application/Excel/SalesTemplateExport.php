<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\Excel;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SalesTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'sales';
    }

    public function getHeadings(): array
    {
        return [
            'kode_invoice',
            'tanggal',
            'kode_pelanggan',
            'nama_pelanggan',
            'email_pelanggan',
            'telepon_pelanggan',
            'kode_produk',
            'nama_produk',
            'jumlah',
            'harga_satuan',
            'kode_voucher',
            'ongkir',
            'diskon',
            'total',
            'status',
            'catatan',
            'username_kasir',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                'INV-202411001',
                '2024-11-15',
                'PLG-001',
                'Budi Santoso',
                'budi@email.com',
                '081234567890',
                'PRD-001-M',
                'Kaos Polos Premium - Medium',
                2,
                150000,
                'DISKON10',
                15000,
                30000,
                315000,
                'confirmed',
                'Kirim besok pagi',
                'kasir_budi',
            ],
            [
                'INV-202411002',
                '2024-11-15',
                'PLG-002',
                'Siti Rahayu',
                'siti@email.com',
                '082198765432',
                'PRD-002-32',
                'Celana Jeans Slimfit - 32',
                1,
                250000,
                '',
                20000,
                0,
                270000,
                'pending',
                '',
                'kasir_siti',
            ],
            [
                'INV-202411003',
                '2024-11-16',
                '',
                'Walk-in Customer',
                '',
                '081312345678',
                'PRD-003-OS',
                'Topi Baseball - One Size',
                3,
                75000,
                'PROMO20',
                10000,
                45000,
                240000,
                'delivered',
                'Ambil di toko',
                'kasir_ahmad',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kode_invoice', 'Wajib', 'Kode Unik Invoice', 'Kode unik transaksi. Contoh: INV-202411001. Harus unik.'],
            ['tanggal', 'Opsional', 'Tanggal (YYYY-MM-DD)', 'Tanggal transaksi. Default: hari ini. Contoh: 2024-11-15.'],
            ['kode_pelanggan', 'Opsional', 'Kode Pelanggan', 'Kode pelanggan dari master pelanggan (seller_customers.code). Akan dicari case-insensitive. Jika ditemukan, data pelanggan lain diabaikan.'],
            ['nama_pelanggan', 'Opsional', 'Teks', 'Nama pelanggan. Digunakan jika kode_pelanggan tidak diisi/ketemu.'],
            ['email_pelanggan', 'Opsional', 'Email', 'Email pelanggan. Digunakan untuk mencari pelanggan jika kode tidak ada.'],
            ['telepon_pelanggan', 'Opsional', 'Teks', 'Telepon pelanggan. Digunakan bersamaan nama untuk pencarian.'],
            ['kode_produk', 'Wajib', 'SKU Varian Produk', 'SKU varian produk yang sudah ada di master. Harus persis sama. Contoh: PRD-001-M.'],
            ['nama_produk', 'Opsional', 'Teks', 'Nama produk/varian (hanya referensi, tidak diproses).'],
            ['jumlah', 'Wajib', 'Angka Bulat', 'Jumlah item. Minimal 1. Contoh: 2.'],
            ['harga_satuan', 'Wajib', 'Angka', 'Harga per unit dalam rupiah tanpa titik/koma. Contoh: 150000.'],
            ['kode_voucher', 'Opsional', 'Kode Voucher', 'Kode voucher yang sudah ada di sistem (vouchers.code). Akan dicari case-insensitive.'],
            ['ongkir', 'Opsional', 'Angka', 'Biaya ongkir. Default: 0. Contoh: 15000.'],
            ['diskon', 'Opsional', 'Angka', 'Diskon manual. Default: 0. Contoh: 30000.'],
            ['total', 'Wajib', 'Angka', 'Total bayar (harga x jumlah + ongkir - diskon - voucher). Contoh: 315000.'],
            ['status', 'Opsional', 'Enum: pending/confirmed/processing/shipped/delivered/cancelled', 'Status order. Default: pending.'],
            ['catatan', 'Opsional', 'Teks', 'Catatan order.'],
            ['username_kasir', 'Opsional', 'Nama Kasir (lowercase)', 'Nama kasir/user yang melayani. Akan dicari dari users.name case-insensitive.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return -1;
    }

    public function getExampleImagePath(): ?string
    {
        return null;
    }
}
