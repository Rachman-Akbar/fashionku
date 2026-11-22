<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'customer';
    }

    public function getHeadings(): array
    {
        return [
            'kode_pelanggan',
            'avatar',
            'nama',
            'email',
            'telepon',
            'alamat',
            'catatan',
            'aktif',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                'PLG-001',
                '',
                'Budi Santoso',
                'budi@email.com',
                '081234567890',
                'Jl. Sudirman No. 123, Jakarta',
                'Pelanggan langganan seitan 2020',
                'ya',
            ],
            [
                'PLG-002',
                '',
                'Siti Rahayu',
                'siti@email.com',
                '082198765432',
                'Jl. Thamrin No. 45, Jakarta',
                'Suka beli produk pakaian',
                'ya',
            ],
            [
                'PLG-003',
                '',
                'Ahmad Wijaya',
                'ahmad@email.com',
                '081312345678',
                'Jl. Gatot Subroto No. 67, Jakarta',
                '',
                'ya',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kode_pelanggan', 'Wajib', 'Kode Unik', 'Kode unik pelanggan. Contoh: PLG-001. Harus unik per toko.'],
            ['avatar', 'Opsional', 'Gambar', 'Foto pelanggan disematkan di dalam sel ini. Kosongkan jika tidak ada foto.'],
            ['nama', 'Wajib', 'Teks', 'Nama lengkap pelanggan. Contoh: Budi Santoso.'],
            ['email', 'Opsional', 'Email', 'Email pelanggan. Format: nama@domain.com.'],
            ['telepon', 'Opsional', 'Teks', 'Nomor telepon/WhatsApp. Contoh: 081234567890.'],
            ['alamat', 'Opsional', 'Teks Panjang', 'Alamat lengkap pelanggan untuk pengiriman.'],
            ['catatan', 'Opsional', 'Teks', 'Catatan tambahan tentang pelanggan.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif pelanggan. Default: ya.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 1;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-customer.png');
        return file_exists($path) ? $path : null;
    }
}
