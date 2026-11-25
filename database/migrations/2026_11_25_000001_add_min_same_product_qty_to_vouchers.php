<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Syarat kuantitas untuk satu produk yang sama.
 *
 * `min_same_product_qty` = 0/null berarti tanpa syarat. Jika diisi, pesanan
 * hanya memenuhi syarat bila ada minimal satu produk (dalam scope voucher)
 * yang dibeli sebanyak nilai tersebut. Contoh: 3 = wajib 3 pcs dari produk
 * yang sama, berbeda dengan `min_items` (total seluruh item) dan
 * `min_distinct_products` (jumlah produk berbeda).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('vouchers', 'min_same_product_qty')) {
            Schema::table('vouchers', function (Blueprint $table): void {
                $table->unsignedInteger('min_same_product_qty')->default(0)->after('min_distinct_products');
            });
        }
    }

    public function down(): void
    {
        Schema::table('vouchers', function (Blueprint $table): void {
            $table->dropColumn('min_same_product_qty');
        });
    }
};
