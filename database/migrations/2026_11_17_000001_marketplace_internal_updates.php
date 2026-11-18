<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Penyesuaian marketplace internal (bukan lagi multistore):
 *
 *  1. `orders.order_type` kini hanya `reguler` | `terjadwal` (+ `manual` untuk
 *     pesanan manual admin). Preorder tidak lagi menjadi tipe pesanan, melainkan
 *     status "menunggu produk" yang ditandai `orders.is_preorder`.
 *  2. Tambah kolom jadwal pengambilan pembeli (`pickup_at`, `pickup_note`) untuk
 *     metode pengiriman "Diambil Pembeli".
 *  3. Tambah pivot `voucher_products` agar syarat voucher bisa dibatasi ke
 *     produk tertentu dan tidak tercampur saat belanja banyak barang.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->boolean('is_preorder')->default(false)->after('order_type');
            $table->timestamp('pickup_at')->nullable()->after('scheduled_at');
            $table->string('pickup_note', 255)->nullable()->after('pickup_at');
            $table->string('order_type', 30)->default('reguler')->change();
        });

        // normal -> reguler, booking -> terjadwal, preorder -> reguler + is_preorder.
        DB::table('orders')->where('order_type', 'normal')->update(['order_type' => 'reguler']);
        DB::table('orders')->where('order_type', 'booking')->update(['order_type' => 'terjadwal']);
        DB::table('orders')
            ->where('order_type', 'preorder')
            ->update(['order_type' => 'reguler', 'is_preorder' => true]);

        if (! Schema::hasTable('voucher_products')) {
            Schema::create('voucher_products', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('voucher_id')->constrained('vouchers')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['voucher_id', 'product_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('voucher_products');

        DB::table('orders')->where('order_type', 'reguler')->where('is_preorder', true)->update(['order_type' => 'preorder']);
        DB::table('orders')->where('order_type', 'terjadwal')->update(['order_type' => 'booking']);
        DB::table('orders')->where('order_type', 'reguler')->update(['order_type' => 'normal']);

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn(['is_preorder', 'pickup_at', 'pickup_note']);
        });
    }
};
