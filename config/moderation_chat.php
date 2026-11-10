<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Template pesan moderasi (chat)
    |--------------------------------------------------------------------------
    |
    | Pesan default yang otomatis dikirim ke chat user (seller/buyer) setiap
    | admin melakukan tindakan moderasi: menyetujui / memberhentikan toko,
    | serta menonaktifkan / mengaktifkan kembali akun user.
    |
    | Placeholder tersedia:
    |   {store_name}, {owner_name}, {user_name}
    |
    */

    'store' => [
        'approved' => [
            'subject' => 'Toko Anda Telah Disetujui',
            'message' => "Halo {owner_name}!\n\nSelamat, toko \"{store_name}\" Anda telah disetujui oleh tim Marketplace dan kini resmi aktif. Anda sudah dapat mulai menjual produk dan menerima pesanan.\n\nTerima kasih telah bergabung bersama kami. 🎉",
        ],
        'suspended' => [
            'subject' => 'Toko Anda Diberhentikan Sementara',
            'message' => "Halo {owner_name}.\n\nDengan ini kami informasikan bahwa toko \"{store_name}\" untuk sementara diberhentikan karena diduga melanggar ketentuan Marketplace. Segala aktivitas penjualan pada toko tersebut dihentikan.\n\nSilakan hubungi tim Marketplace melalui chat ini untuk informasi lebih lanjut.\n\n{reason}",
        ],
    ],

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
