<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\Excel;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class VoucherTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'voucher';
    }

    public function getHeadings(): array
    {
        return [
            'kode_voucher',
            'image',
            'nama',
            'target_diskon',
            'tipe_diskon',
            'nilai_diskon',
            'min_belanja',
            'min_item',
            'min_produk_berbeda',
            'maks_diskon',
            'mulai',
            'berakhir',
            'limit_pemakaian',
            'limit_per_user',
            'syarat_ketentuan',
            'produk_terkait',
            'aktif',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                'DISKON10',
                '',
                'Diskon 10% Semua Produk',
                'product',
                'percentage',
                10,
                100000,
                1,
                0,
                50000,
                '2024-11-01 00:00',
                '2024-12-31 23:59',
                1000,
                5,
                'Berlaku untuk pembelian minimal Rp 100.000. Maksimal diskon Rp 50.000.',
                'PRD-001-M;PRD-001-L;PRD-002-32',
                'ya',
            ],
            [
                'FREESHIP',
                '',
                'Gratis Ongkir',
                'shipping',
                'fixed',
                15000,
                200000,
                1,
                0,
                15000,
                '2024-11-01 00:00',
                '2024-12-31 23:59',
                500,
                3,
                'Gratis ongkir untuk belanja min Rp 200.000. Maksimal potongan ongkir Rp 15.000.',
                '',
                'ya',
            ],
            [
                'NEWPROMO',
                '',
                'Promo Baru 20%',
                'product',
                'percentage',
                20,
                150000,
                2,
                1,
                100000,
                '2024-11-15 00:00',
                '2024-11-30 23:59',
                200,
                1,
                'Promo terbatas. Minimal 2 item, 1 produk berbeda.',
                'PRD-003-OS',
                'ya',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kode_voucher', 'Wajib', 'Kode Unik', 'Kode unik voucher (lowercase). Contoh: diskon10, freeship. Harus unik.'],
            ['image', 'Opsional', 'Gambar', 'Gambar voucher disematkan di dalam sel ini. Kosongkan jika tidak ada gambar.'],
            ['nama', 'Wajib', 'Teks', 'Nama voucher untuk tampilan. Contoh: Diskon 10% Semua Produk.'],
            ['target_diskon', 'Opsional', 'Enum: product/shipping', 'Target diskon: product=produk, shipping=ongkir. Default: product.'],
            ['tipe_diskon', 'Opsional', 'Enum: fixed/percentage', 'Tipe diskon: fixed=nominal tetap, percentage=persen. Default: percentage.'],
            ['nilai_diskon', 'Wajib', 'Angka', 'Nilai diskon. Jika percentage: 10 = 10%. Jika fixed: nominal rupiah. Contoh: 10 atau 15000.'],
            ['min_belanja', 'Opsional', 'Angka', 'Minimal belanja untuk pakai voucher. Default: 0. Contoh: 100000.'],
            ['min_item', 'Opsional', 'Angka Bulat', 'Minimal jumlah item. Default: 0. Contoh: 1.'],
            ['min_produk_berbeda', 'Opsional', 'Angka Bulat', 'Minimal produk berbeda. Default: 0. Contoh: 1.'],
            ['maks_diskon', 'Opsional', 'Angka', 'Maksimal potongan (hanya untuk percentage). Default: 0 (tidak dibatasi). Contoh: 50000.'],
            ['mulai', 'Opsional', 'Datetime (YYYY-MM-DD HH:MM)', 'Tanggal mulai berlaku. Default: sekarang. Contoh: 2024-11-01 00:00.'],
            ['berakhir', 'Opsional', 'Datetime (YYYY-MM-DD HH:MM)', 'Tanggal berakhir berlaku. Wajib setelah mulai. Contoh: 2024-12-31 23:59.'],
            ['limit_pemakaian', 'Opsional', 'Angka Bulat', 'Total limit pemakaian voucher. 0 = tidak dibatasi. Default: 0.'],
            ['limit_per_user', 'Opsional', 'Angka Bulat', 'Limit pemakaian per user. 0 = tidak dibatasi. Default: 0.'],
            ['syarat_ketentuan', 'Opsional', 'Teks Panjang', 'Syarat & ketentuan voucher.'],
            ['produk_terkait', 'Opsional', 'SKU dipisah ;', 'SKU produk yang berlaku voucher (pisahkan dengan titik koma). Kosong = semua produk. Contoh: PRD-001-M;PRD-001-L.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif voucher. Default: ya.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 1;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-voucher.png');
        return file_exists($path) ? $path : null;
    }
}
