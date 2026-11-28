<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Satuan jual produk (mis. pcs, kg, meter). Disimpan sebagai teks bebas agar
 * admin bisa mengetik satuan baru tanpa harus membuat master data terpisah;
 * daftar satuan yang sudah pernah dipakai ditampilkan sebagai saran dropdown.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('products', 'unit')) {
            return;
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->string('unit', 30)->nullable()->after('brand');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('products', 'unit')) {
            return;
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('unit');
        });
    }
};
