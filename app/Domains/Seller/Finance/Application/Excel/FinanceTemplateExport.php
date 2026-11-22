<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FinanceTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'finance';
    }

    public function getHeadings(): array
    {
        return [
            'kode_keuangan',
            'tanggal',
            'kategori',
            'tipe',
            'judul',
            'deskripsi',
            'jumlah',
            'terbayar',
            'status',
            'jatuh_tempo',
            'tanggal_terbayar',
            'kode_referensi',
            'pihak_ke',
            'catatan',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                'FIN-202411001',
                '2024-11-15',
                'penjualan',
                'income',
                'Penjualan Harian',
                'Hasil penjualan toko 15 Nov',
                5000000,
                5000000,
                'paid',
                '',
                '2024-11-15',
                'INV-202411001',
                'Budi Santoso',
                'Pembayaran tunai',
            ],
            [
                'FIN-202411002',
                '2024-11-15',
                'pembelian_bahan',
                'expense',
                'Pembelian Bahan Baku',
                'Beli katun dan benang',
                2000000,
                2000000,
                'paid',
                '',
                '2024-11-15',
                '',
                'Supplier A',
                'Transfer bank',
            ],
            [
                'FIN-202411003',
                '2024-11-16',
                'piutang',
                'receivable',
                'Piutang Pelanggan',
                'Piutang dari PLG-003',
                1500000,
                500000,
                'partial',
                '2024-11-30',
                '',
                '',
                'Ahmad Wijaya',
                'Cicilan 1 dari 3',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kode_keuangan', 'Wajib', 'Kode Unik', 'Kode unik transaksi keuangan. Contoh: FIN-202411001. Harus unik.'],
            ['tanggal', 'Opsional', 'Tanggal (YYYY-MM-DD)', 'Tanggal transaksi. Default: hari ini. Contoh: 2024-11-15.'],
            ['kategori', 'Opsional', 'Teks (lowercase)', 'Kategori transaksi. Akan disimpan lowercase. Contoh: penjualan, pembelian_bahan, gaji, sewa, piutang, hutang.'],
            ['tipe', 'Opsional', 'Enum: income/expense/receivable/payable', 'Jenis transaksi. Default: expense. income=pemasukan, expense=pengeluaran, receivable=piutang, payable=hutang.'],
            ['judul', 'Wajib', 'Teks', 'Judul singkat transaksi. Contoh: Penjualan Harian, Pembelian Bahan Baku.'],
            ['deskripsi', 'Opsional', 'Teks Panjang', 'Deskripsi detail transaksi.'],
            ['jumlah', 'Wajib', 'Angka', 'Total nominal transaksi. Contoh: 5000000.'],
            ['terbayar', 'Opsional', 'Angka', 'Nominal yang sudah dibayar. Default: 0. Untuk piutang/hutang bisa diisi sebagian.'],
            ['status', 'Opsional', 'Enum: pending/partial/paid/overdue/cancelled', 'Status pembayaran. Default: pending.'],
            ['jatuh_tempo', 'Opsional', 'Tanggal (YYYY-MM-DD)', 'Tanggal jatuh tempo untuk piutang/hutang. Contoh: 2024-11-30.'],
            ['tanggal_terbayar', 'Opsional', 'Tanggal (YYYY-MM-DD)', 'Tanggal lunas penuh. Diisi otomatis saat status paid.'],
            ['kode_referensi', 'Opsional', 'Kode Invoice Order', 'Kode order terkait (orders.order_number). Jika diisi, akan terhubung ke order.'],
            ['pihak_ke', 'Opsional', 'Nama (lowercase)', 'Nama pihak kedua (customer/supplier). Akan dicari dari users.name case-insensitive. Jika tidak ada, dibuat otomatis.'],
            ['catatan', 'Opsional', 'Teks', 'Catatan tambahan.'],
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
