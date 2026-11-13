<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `financial_transactions.category` dipakai oleh model, request, service, dan
 * resource (nilai default: `penjualan` untuk income, `lainnya` untuk expense)
 * tetapi belum pernah dibuat di skema. Migrasi ini menambahkan kolom tersebut.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('financial_transactions') || Schema::hasColumn('financial_transactions', 'category')) {
            return;
        }

        Schema::table('financial_transactions', function (Blueprint $table): void {
            $table->string('category', 40)->nullable()->after('type')->index();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('financial_transactions') || ! Schema::hasColumn('financial_transactions', 'category')) {
            return;
        }

        Schema::table('financial_transactions', function (Blueprint $table): void {
            $table->dropColumn('category');
        });
    }
};
