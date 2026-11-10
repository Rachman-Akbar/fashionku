<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->index(['name', 'id'], 'products_admin_name_sort_idx');
            $table->index(['store_id', 'name', 'id'], 'products_seller_name_sort_idx');
            $table->index(['store_id', 'is_active', 'id'], 'products_seller_active_idx');
            $table->index(['store_id', 'status', 'id'], 'products_seller_status_idx');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->index(['product_id', 'is_default', 'price', 'id'], 'product_variants_price_filter_idx');
            $table->index(['product_id', 'is_default', 'stock', 'id'], 'product_variants_stock_filter_idx');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropIndex('product_variants_price_filter_idx');
            $table->dropIndex('product_variants_stock_filter_idx');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex('products_admin_name_sort_idx');
            $table->dropIndex('products_seller_name_sort_idx');
            $table->dropIndex('products_seller_active_idx');
            $table->dropIndex('products_seller_status_idx');
        });
    }
};
