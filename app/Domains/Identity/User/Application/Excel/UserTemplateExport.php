<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class UserTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'user';
    }

    public function getHeadings(): array
    {
        return [
            'avatar',
            'nama',
            'email',
            'telepon',
            'username',
            'role',
            'status_aktif',
            'email_verified',
            'catatan',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                '',
                'Budi Santoso',
                'budi@fashionku.com',
                '081234567890',
                'budi_santoso',
                'seller',
                'ya',
                'ya',
                'Pemilik toko',
            ],
            [
                '',
                'Siti Rahayu',
                'siti@fashionku.com',
                '082198765432',
                'siti_rahayu',
                'staff',
                'ya',
                'ya',
                'Staff gudang',
            ],
            [
                '',
                'Ahmad Wijaya',
                'ahmad@fashionku.com',
                '081312345678',
                'ahmad_wijaya',
                'admin',
                'ya',
                'ya',
                'Administrator',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['avatar', 'Opsional', 'Gambar', 'Foto profil user disematkan di dalam sel ini. Kosongkan jika tidak ada foto.'],
            ['nama', 'Wajib', 'Teks', 'Nama lengkap user. Contoh: Budi Santoso.'],
            ['email', 'Wajib', 'Email', 'Email user (unik). Digunakan untuk login. Contoh: budi@fashionku.com.'],
            ['telepon', 'Opsional', 'Teks', 'Nomor telepon/WhatsApp. Contoh: 081234567890.'],
            ['username', 'Opsional', 'Teks', 'Username untuk tampilan. Default: sama dengan nama.'],
            ['role', 'Opsional', 'Nama Role (lowercase)', 'Role user: seller, staff, admin, kasir, dll. Akan dicari case-insensitive. Jika tidak ada, dibuat otomatis.'],
            ['status_aktif', 'Opsional', 'ya/tidak', 'Status aktif user. Default: ya.'],
            ['email_verified', 'Opsional', 'ya/tidak', 'Status verifikasi email. Default: tidak.'],
            ['catatan', 'Opsional', 'Teks', 'Catatan tambahan.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 0;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-user.png');
        return file_exists($path) ? $path : null;
    }
}
