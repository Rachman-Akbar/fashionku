<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->update([
            'status' => DB::raw('LOWER(TRIM(status))'),
        ]);
        DB::table('stores')->update([
            'status' => DB::raw('LOWER(TRIM(status))'),
        ]);

        Schema::table('products', function (Blueprint $table): void {
            $table->index(
                ['status', 'is_active', 'created_at', 'id'],
                'products_public_feed_idx'
            );
            $table->index(
                ['store_id', 'status', 'is_active', 'created_at', 'id'],
                'products_store_feed_idx'
            );
            $table->index(
                ['primary_category_id', 'status', 'is_active', 'created_at', 'id'],
                'products_category_feed_idx'
            );
        });

        Schema::table('stores', function (Blueprint $table): void {
            $table->index(
                ['status', 'is_active', 'id'],
                'stores_public_catalog_idx'
            );
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->index(
                ['product_id', 'is_default', 'id'],
                'product_variants_summary_idx'
            );
            $table->index('sku', 'product_variants_sku_search_idx');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropIndex('product_variants_summary_idx');
            $table->dropIndex('product_variants_sku_search_idx');
        });

        Schema::table('stores', function (Blueprint $table): void {
            $table->dropIndex('stores_public_catalog_idx');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex('products_public_feed_idx');
            $table->dropIndex('products_store_feed_idx');
            $table->dropIndex('products_category_feed_idx');
        });
    }
};
