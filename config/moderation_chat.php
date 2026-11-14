<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Template pesan moderasi (chat)
    |--------------------------------------------------------------------------
    |
    | Pesan default yang otomatis dikirim ke chat user (seller/buyer) setiap
    | admin melakukan tindakan moderasi: menonaktifkan / mengaktifkan kembali
    | akun user.
    |
    | Placeholder tersedia:
    |   {user_name}
    |
    */

    'user' => [
        'banned' => [
            'subject' => 'Akun Anda Dinonaktifkan',
            'message' => "Halo {user_name}.\n\nKami informasikan bahwa akun Anda dinonaktifkan oleh tim Marketplace karena melanggar ketentuan layanan.\n\nJika Anda merasa ini adalah kesalahan, silakan hubungi tim Marketplace melalui chat ini.\n\n{reason}",
        ],
        'unbanned' => [
            'subject' => 'Akun Anda Telah Diaktifkan Kembali',
            'message' => "Halo {user_name}!\n\nKabar baik, akun Anda telah diaktifkan kembali oleh tim Marketplace. Anda dapat kembali menggunakan layanan kami seperti biasa.\n\n{reason}",
        ],
    ],
];
