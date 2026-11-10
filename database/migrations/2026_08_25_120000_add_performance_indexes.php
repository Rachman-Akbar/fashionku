<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->index(['user_id', 'status', 'created_at'], 'orders_user_status_created_index');
            $table->index(['payment_status', 'created_at'], 'orders_payment_status_created_index');
        });

        Schema::table('sub_orders', function (Blueprint $table): void {
            $table->index(['store_id', 'status', 'created_at'], 'sub_orders_store_status_created_index');
            $table->index(['order_id', 'store_id'], 'sub_orders_order_store_index');
        });

        Schema::table('order_items', function (Blueprint $table): void {
            $table->index(['product_id', 'created_at'], 'order_items_product_created_index');
        });

        Schema::table('financial_transactions', function (Blueprint $table): void {
            $table->index(['store_id', 'type', 'status', 'occurred_at'], 'financial_transactions_report_index');
            $table->index(['store_id', 'type', 'due_date', 'status'], 'financial_transactions_aging_index');
        });

        Schema::table('seller_settlements', function (Blueprint $table): void {
            $table->index(['store_id', 'created_at'], 'seller_settlements_store_created_index');
        });

        Schema::table('seller_withdrawals', function (Blueprint $table): void {
            $table->index(['store_id', 'created_at'], 'seller_withdrawals_store_created_index');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->index(['store_id', 'is_active', 'deleted_at'], 'products_store_active_index');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->index(['product_id', 'stock'], 'product_variants_stock_index');
        });

        Schema::table('schedules', function (Blueprint $table): void {
            $table->index(['user_id', 'is_completed', 'date'], 'schedules_user_completed_date_index');
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table): void {
            $table->dropIndex('schedules_user_completed_date_index');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropIndex('product_variants_stock_index');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex('products_store_active_index');
        });

        Schema::table('seller_withdrawals', function (Blueprint $table): void {
            $table->dropIndex('seller_withdrawals_store_created_index');
        });

        Schema::table('seller_settlements', function (Blueprint $table): void {
            $table->dropIndex('seller_settlements_store_created_index');
        });

        Schema::table('financial_transactions', function (Blueprint $table): void {
            $table->dropIndex('financial_transactions_aging_index');
            $table->dropIndex('financial_transactions_report_index');
        });

        Schema::table('order_items', function (Blueprint $table): void {
            $table->dropIndex('order_items_product_created_index');
        });

        Schema::table('sub_orders', function (Blueprint $table): void {
            $table->dropIndex('sub_orders_order_store_index');
            $table->dropIndex('sub_orders_store_status_created_index');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex('orders_payment_status_created_index');
            $table->dropIndex('orders_user_status_created_index');
        });
    }
};
