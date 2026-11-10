<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('financial_payment_histories')) {
            Schema::create('financial_payment_histories', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('financial_transaction_id')->constrained('financial_transactions')->cascadeOnDelete();
                $table->foreignId('store_id')->nullable()->constrained('stores')->nullOnDelete();
                $table->uuid('recorded_by')->nullable()->index();
                $table->decimal('amount', 15, 2);
                $table->decimal('balance_before', 15, 2);
                $table->decimal('balance_after', 15, 2);
                $table->string('payment_method', 50)->default('manual');
                $table->string('reference_number', 100)->nullable()->index();
                $table->text('notes')->nullable();
                $table->timestamp('paid_at');
                $table->timestamps();
                $table->index(['financial_transaction_id', 'paid_at']);
            });
        }

        if (! Schema::hasTable('raw_materials')) {
            Schema::create('raw_materials', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('code', 100);
                $table->string('name');
                $table->string('unit', 50)->default('pcs');
                $table->decimal('stock', 18, 4)->default(0);
                $table->decimal('minimum_stock', 18, 4)->default(0);
                $table->decimal('average_cost', 18, 4)->default(0);
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
                $table->softDeletes();
                $table->unique(['store_id', 'code']);
                $table->index(['store_id', 'name']);
            });
        }

        if (! Schema::hasTable('raw_material_stock_movements')) {
            Schema::create('raw_material_stock_movements', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
                $table->string('type', 30);
                $table->decimal('quantity_delta', 18, 4);
                $table->decimal('balance_after', 18, 4);
                $table->decimal('unit_cost', 18, 4)->default(0);
                $table->decimal('total_cost', 18, 4)->default(0);
                $table->string('reference_type', 50)->default('manual');
                $table->string('reference_number', 100)->nullable()->index();
                $table->text('notes')->nullable();
                $table->timestamp('occurred_at');
                $table->timestamps();
                $table->index(['store_id', 'raw_material_id', 'occurred_at'], 'raw_material_movement_lookup');
            });
        }

        if (! Schema::hasTable('product_costings')) {
            Schema::create('product_costings', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('product_id')->unique()->constrained('products')->cascadeOnDelete();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->decimal('material_cost', 18, 4)->default(0);
                $table->decimal('labor_cost', 18, 4)->default(0);
                $table->decimal('overhead_cost', 18, 4)->default(0);
                $table->decimal('other_cost', 18, 4)->default(0);
                $table->decimal('hpp', 18, 4)->default(0);
                $table->decimal('margin_percent', 8, 4)->default(0);
                $table->decimal('suggested_price', 18, 2)->default(0);
                $table->decimal('selling_price', 18, 2)->default(0);
                $table->timestamps();
                $table->index(['store_id', 'product_id']);
            });
        }

        if (! Schema::hasTable('product_materials')) {
            Schema::create('product_materials', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
                $table->decimal('quantity', 18, 4);
                $table->decimal('unit_cost', 18, 4)->default(0);
                $table->decimal('total_cost', 18, 4)->default(0);
                $table->timestamps();
                $table->unique(['product_id', 'raw_material_id']);
            });
        }
    }

    public function down(): void {}
};
