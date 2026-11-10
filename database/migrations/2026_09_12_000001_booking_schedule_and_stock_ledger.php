<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Model stok baru (natural-language requirement):
 *  - stok asli (stock), stok pesan (stock_reserved), stok dibooking (stock_booked),
 *    stok preorder outstanding (stock_preorder), dan batas order (max_order_qty).
 *  - preorder otomatis saat stok habis: products.allows_preorder (default true).
 *  - booking berubah makna menjadi "jadwal kirim/pickup" (orders.scheduled_at).
 *  - ledger stok diberi dimensi (stock_dimension) agar audit per komponen stok.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->boolean('allows_preorder')->default(true)->after('is_active');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->unsignedInteger('stock_reserved')->default(0)->after('po_stock');
            $table->unsignedInteger('stock_booked')->default(0)->after('stock_reserved');
            $table->unsignedInteger('stock_preorder')->default(0)->after('stock_booked');
            $table->unsignedInteger('max_order_qty')->default(999999)->after('stock_preorder');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['booking_expires_at']);
            $table->dropColumn('booking_expires_at');
            $table->timestamp('scheduled_at')->nullable()->after('preorder_release_at')->index();
        });

        Schema::table('stock_movements', function (Blueprint $table): void {
            $table->string('stock_dimension', 20)->default('available')->after('balance_after');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table): void {
            $table->dropColumn('stock_dimension');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn('scheduled_at');
            $table->timestamp('booking_expires_at')->nullable()->after('preorder_release_at')->index();
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropColumn(['max_order_qty', 'stock_preorder', 'stock_booked', 'stock_reserved']);
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('allows_preorder');
        });
    }
};
