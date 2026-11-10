<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Application\Services;

use Illuminate\Support\Str;

/**
 * Formatter rumus kode unik.
 *
 * Contoh rumus: "{type}-{name:6}-{date}-{seq:4}".
 * Token yang didukung: type, name, brand, category, store, movement, status,
 * year, month, day, date, time, seq, rand. Lebar opsional setelah tanda titik dua.
 */
final class CodePatternFormatter
{
    public const DEFAULTS = [
        'sku' => '{name:20}-{date:6}-{seq:4}',
        'material_code' => 'RM-{name:6}',
        'order_number' => 'MAN-{datetime}-{rand:6}',
        'stock_reference' => 'STK-{movement}-{date}-{seq:3}',
        'material_reference' => 'RM-{movement:3}-{date}-{seq:4}',
        'invoice_reference' => 'INV/{type:3}/{date}/{rand:4}',
    ];

    public const LABELS = [
        'sku' => 'SKU Produk',
        'material_code' => 'Kode Bahan Baku',
        'order_number' => 'Nomor Pesanan',
        'stock_reference' => 'Nomor Stok Produk',
        'material_reference' => 'Nomor Stok Bahan Baku',
        'invoice_reference' => 'Nomor Invoice Finance',
    ];

    public const TOKENS = [
        'type' => 'Tipe kode, mis. SKU/RM/INV',
        'name' => 'Nama produk atau bahan baku',
        'brand' => 'Merek produk',
        'category' => 'Kategori produk',
        'store' => 'Nama toko',
        'movement' => 'Jenis pergerakan stok',
        'status' => 'Status transaksi',
        'year' => 'Tahun, mis. 26',
        'month' => 'Bulan, mis. 09',
        'day' => 'Tanggal, mis. 27',
        'date' => 'Tanggal lengkap, mis. 260927',
        'time' => 'Waktu, mis. 142530',
        'datetime' => 'Tanggal + waktu, mis. 20260927142530',
        'seq' => 'Nomor urut harian',
        'rand' => 'Kode acak',
    ];

    public static function render(string $pattern, array $context = []): string
    {
        $pattern = trim($pattern);
        if ($pattern === '') {
            $pattern = '{type}-{date}-{seq:4}';
        }

        $now = $context['now'] ?? now();
        $sequence = max(1, (int) ($context['seq'] ?? 1));

        $output = preg_replace_callback('/\{([a-z_]+)(?::(\d+))?\}/i', function (array $matches) use ($context, $now, $sequence): string {
            $token = strtolower($matches[1]);
            $width = isset($matches[2]) ? max(1, (int) $matches[2]) : null;

            $value = match ($token) {
                'type' => strtoupper((string) ($context['type'] ?? 'CODE')),
                'name' => self::token((string) ($context['name'] ?? '')),
                'brand' => self::token((string) ($context['brand'] ?? '')),
                'category' => self::token((string) ($context['category'] ?? '')),
                'store' => self::token((string) ($context['store'] ?? '')),
                'movement' => strtoupper((string) ($context['movement'] ?? 'ADJ')),
                'status' => strtoupper((string) ($context['status'] ?? '')),
                'year' => $now->format('y'),
                'month' => $now->format('m'),
                'day' => $now->format('d'),
                'date' => $now->format('ymd'),
                'time' => $now->format('His'),
                'datetime' => $now->format('YmdHis'),
                'seq' => str_pad((string) $sequence, $width ?: 4, '0', STR_PAD_LEFT),
                'rand' => strtoupper(Str::random($width ?: 4)),
                default => '',
            };

            if ($width !== null && $token !== 'seq' && $token !== 'rand') {
                $value = Str::substr($value, 0, $width);
            }

            return $value === '' ? 'X' : $value;
        }, $pattern);

        $output = preg_replace('/\s+/', '-', trim((string) $output));
        $output = preg_replace('/-{2,}/', '-', (string) $output);

        return trim(trim((string) $output, '-'), '/');
    }

    public static function token(string $value): string
    {
        $value = Str::upper(Str::slug($value, '-'));

        return $value === '' ? '' : (string) preg_replace('/[^A-Z0-9]+/', '', $value);
    }

    public static function sanitize(string $pattern): string
    {
        $pattern = strtoupper(trim($pattern));
        $pattern = preg_replace('/[^A-Z0-9{}\-_\/:.\[\]#]/', '', $pattern) ?? '';
        $pattern = preg_replace_callback('/\{([A-Z_]+)(:[0-9]{1,4})?\}/', function (array $matches): string {
            return array_key_exists(strtolower($matches[1]), self::TOKENS) ? '{'.$matches[1].($matches[2] ?? '').'}' : '';
        }, $pattern) ?? $pattern;

        return trim(preg_replace('/-{2,}/', '-', $pattern) ?? $pattern, '-/');
    }
}
