<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Hasil jadi per satu kali produksi (yield) untuk resep HPP produk.
 *
 * Isi resep (bahan + tenaga kerja + overhead + biaya lain) adalah biaya satu
 * kali produksi. Dengan `yield_quantity`, sistem tahu berapa unit yang
 * dihasilkan dari resep itu sehingga HPP per unit = total biaya produksi /
 * hasil jadi. Default 1 supaya resep lama (yang dihitung per unit) tetap sama.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('product_costings', 'yield_quantity')) {
            return;
        }

        Schema::table('product_costings', function (Blueprint $table): void {
            $table->decimal('yield_quantity', 18, 4)->default(1)->after('other_cost');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('product_costings', 'yield_quantity')) {
            return;
        }

        Schema::table('product_costings', function (Blueprint $table): void {
            $table->dropColumn('yield_quantity');
        });
    }
};
