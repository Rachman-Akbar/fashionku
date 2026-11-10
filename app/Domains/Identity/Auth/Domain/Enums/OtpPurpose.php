<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Domain\Enums;

enum OtpPurpose: string
{
    case REGISTER = 'register';
    case LOGIN = 'login';
    case GOOGLE_LOGIN = 'google_login';
    case DELETE_ACCOUNT = 'delete_account';
    case REMOVE_DEVICE = 'remove_device';
    case CHANGE_EMAIL = 'change_email';
    case CHANGE_PASSWORD = 'change_password';
    case SENSITIVE_ACTION = 'sensitive_action';

    public static function values(): array
    {
        return array_map(fn (self $case): string => $case->value, self::cases());
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::REGISTER => 'Verifikasi Registrasi',
            self::LOGIN => 'Verifikasi Login',
            self::GOOGLE_LOGIN => 'Verifikasi Login Google',
            self::DELETE_ACCOUNT => 'Konfirmasi Hapus Akun',
            self::REMOVE_DEVICE => 'Konfirmasi Hapus Perangkat',
            self::CHANGE_EMAIL => 'Verifikasi Ubah Email',
            self::CHANGE_PASSWORD => 'Verifikasi Ubah Password',
            self::SENSITIVE_ACTION => 'Verifikasi Aksi Sensitif',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::REGISTER => 'Kode ini digunakan untuk memverifikasi pendaftaran akun baru.',
            self::LOGIN => 'Kode ini digunakan untuk verifikasi tambahan saat login.',
            self::GOOGLE_LOGIN => 'Kode ini digunakan untuk verifikasi tambahan setelah login Google.',
            self::DELETE_ACCOUNT => 'Kode ini digunakan untuk mengonfirmasi penghapusan akun secara permanen.',
            self::REMOVE_DEVICE => 'Kode ini digunakan untuk mengonfirmasi penghapusan perangkat dari akun.',
            self::CHANGE_EMAIL => 'Kode ini digunakan untuk memverifikasi perubahan alamat email.',
            self::CHANGE_PASSWORD => 'Kode ini digunakan untuk memverifikasi perubahan kata sandi.',
            self::SENSITIVE_ACTION => 'Kode ini digunakan untuk memverifikasi aksi sensitif lainnya.',
        };
    }
}