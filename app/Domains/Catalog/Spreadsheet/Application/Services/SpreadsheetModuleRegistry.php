<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Spreadsheet\Application\Services;

final class SpreadsheetModuleRegistry
{
    private const MODULES = [
        'raw-material' => [
            'entity' => 'raw_materials',
            'keyColumn' => 'code',
            'fileKeyColumn' => 'kode_bahan',
            'required' => ['kode_bahan', 'nama', 'satuan'],
            'columns' => ['kode_bahan', 'nama', 'satuan', 'stok_awal', 'biaya_satuan', 'stok_minimum', 'aktif'],
        ],
        'product' => [
            'entity' => 'products',
            'keyColumn' => 'sku',
            'fileKeyColumn' => 'sku',
            'required' => ['sku', 'nama', 'kategori'],
            'columns' => ['sku', 'nama', 'kategori', 'brand', 'deskripsi', 'status', 'harga', 'berat', 'aktif'],
        ],
        'stock' => [
            'entity' => 'product_variants',
            'keyColumn' => 'sku',
            'fileKeyColumn' => 'sku',
            'required' => ['sku', 'stok_tersedia'],
            'columns' => ['sku', 'stok_tersedia', 'stok_reserved', 'stok_booked', 'stok_preorder', 'alasan_penyesuaian'],
        ],
        'income' => [
            'entity' => 'financial_transactions',
            'keyColumn' => 'reference_number',
            'fileKeyColumn' => 'kode_transaksi',
            'required' => ['kode_transaksi', 'tanggal', 'judul', 'jumlah'],
            'columns' => ['kode_transaksi', 'tanggal', 'kategori', 'judul', 'jumlah', 'status', 'jatuh_tempo', 'keterangan'],
        ],
        'expense' => [
            'entity' => 'financial_transactions',
            'keyColumn' => 'reference_number',
            'fileKeyColumn' => 'kode_transaksi',
            'required' => ['kode_transaksi', 'tanggal', 'judul', 'jumlah'],
            'columns' => ['kode_transaksi', 'tanggal', 'kategori', 'judul', 'jumlah', 'status', 'jatuh_tempo', 'keterangan'],
        ],
    ];

    public function has(string $module): bool
    {
        return array_key_exists($module, self::MODULES);
    }

    public function get(string $module): array
    {
        if (! $this->has($module)) {
            throw new \InvalidArgumentException("Modul spreadsheet tidak dikenal: {$module}.");
        }

        return self::MODULES[$module];
    }

    public function modules(): array
    {
        return array_keys(self::MODULES);
    }
}
