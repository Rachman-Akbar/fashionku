<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Kode pelanggan (mis. "BS-0001") dibentuk dari inisial nama dan dijamin
 * unik di seluruh tabel `seller_customers`.
 *
 * Sebelumnya rumus yang sama tersalin di 3 tempat (controller, repository,
 * migrasi); satu sumber ini dipakai supaya aturan kode konsisten.
 */
final class CustomerCodeGenerator
{
    public function generate(string $name): string
    {
        $words = preg_split('/\s+/', Str::upper(trim($name))) ?: [];
        $prefix = '';
        foreach ($words as $word) {
            if ($word !== '') {
                $prefix .= $word[0];
            }
        }

        $prefix = preg_replace('/[^A-Z0-9]/', '', $prefix) ?: 'CUST';

        $sequence = 1;

        while (true) {
            $code = $prefix.'-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);

            if (! DB::table('seller_customers')->where('code', $code)->exists()) {
                return $code;
            }

            $sequence++;
        }
    }
}
