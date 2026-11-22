<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Excel;

use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionModel;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class PromotionTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'promotion';
    }

    public function getHeadings(): array
    {
        return [
            'image_url',
            'mobile_image_url',
            'nama',
            'jenis_klik',
            'target_id',
            'target_url',
            'urutan',
            'aktif',
            'pembayaran_kode',
            'pembayaran_user',
            'paket',
            'jumlah_bayar',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                '',
                '',
                'promo akhir tahun',
                'product',
                '1',
                '',
                1,
                'ya',
                'PAY-202411001',
                'Budi Santoso',
                'Gold',
                500000,
            ],
            [
                '',
                '',
                'banner kategori pakaian',
                'category',
                '2',
                '',
                2,
                'ya',
                'PAY-202411002',
                'Siti Rahayu',
                'Silver',
                300000,
            ],
            [
                '',
                '',
                'iklan url',
                'url',
                '',
                'https://fashionku.com/promo',
                3,
                'ya',
                '',
                '',
                '',
                0,
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['image_url', 'Opsional', 'Gambar', 'Gambar desktop promosi disematkan di dalam sel ini.'],
            ['mobile_image_url', 'Opsional', 'Gambar', 'Gambar mobile promosi disematkan di dalam sel ini.'],
            ['nama', 'Wajib', 'Teks (lowercase)', 'Nama promosi. WAJIB lowercase. Contoh: promo akhir tahun. Sistem otomatis lowercase.'],
            ['jenis_klik', 'Opsional', 'Enum: none/product/category/url', 'Aksi saat diklik: none=tidak ada aksi, product=ke produk (target_id=product_id), category=ke kategori (target_id=category_id), url=ke URL (target_url). Default: none.'],
            ['target_id', 'Opsional', 'Angka', 'ID target untuk product/category. Contoh: 1.'],
            ['target_url', 'Opsional', 'URL', 'URL untuk jenis klik url. Wajib jika jenis_klik=url. Contoh: https://fashionku.com/promo.'],
            ['urutan', 'Opsional', 'Angka', 'Urutan tampil. Default: 0.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif. Default: ya.'],
            ['pembayaran_kode', 'Opsional', 'Kode Pembayaran', 'Kode pembayaran promosi (promotion_payments.payment_number). Jika diisi, promosi terkait pembayaran.'],
            ['pembayaran_user', 'Opsional', 'Teks', 'Nama user pembayar (referensi saja).'],
            ['paket', 'Opsional', 'Teks', 'Nama paket promosi (referensi).'],
            ['jumlah_bayar', 'Opsional', 'Angka', 'Jumlah pembayaran (referensi).'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 0;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-promotion.png');
        return file_exists($path) ? $path : null;
    }
}
