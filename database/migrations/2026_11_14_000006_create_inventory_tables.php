<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Inventori, bahan baku, dan costing. Semua kolom `store_id` dihapus karena
 * Fashionku hanya memiliki satu toko (admin = penjual).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->string('movement_key', 120)->nullable();
            $table->string('type', 30)->index();
            $table->integer('quantity_delta');
            $table->unsignedInteger('balance_after');
            $table->string('stock_dimension', 20)->default('available');
            $table->string('reference_type', 80)->nullable();
            $table->string('reference_id', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['order_item_id', 'movement_key'], 'stock_movements_order_item_key_unique');
            $table->index(['variant_id', 'occurred_at'], 'stock_movements_variant_occurred_index');
            $table->index(['product_id', 'occurred_at'], 'stock_movements_product_occurred_index');
        });

        Schema::create('raw_materials', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 100)->unique();
            $table->string('name');
            $table->string('unit', 50)->default('pcs');
            $table->decimal('stock', 18, 4)->default(0);
            $table->decimal('minimum_stock', 18, 4)->default(0);
            $table->decimal('average_cost', 18, 4)->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['name']);
        });

        Schema::create('raw_material_stock_movements', function (Blueprint $table): void {
            $table->id();
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
            $table->index(['raw_material_id', 'occurred_at'], 'raw_material_movement_lookup');
        });

        Schema::create('raw_material_cost_histories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->foreignId('raw_material_stock_movement_id')->nullable();
            $table->foreign('raw_material_stock_movement_id', 'rm_cost_history_movement_fk')
                ->references('id')->on('raw_material_stock_movements')->nullOnDelete();
            $table->decimal('old_average_cost', 18, 4)->default(0);
            $table->decimal('new_average_cost', 18, 4)->default(0);
            $table->decimal('change_amount', 18, 4)->default(0);
            $table->decimal('change_percent', 12, 4)->default(0);
            $table->string('direction', 20)->default('unchanged');
            $table->string('reference_type', 50)->default('restock');
            $table->string('reference_number', 100)->nullable()->index();
            $table->timestamp('occurred_at');
            $table->timestamps();
            $table->index(['raw_material_id', 'occurred_at'], 'raw_material_cost_history_lookup');
        });

        Schema::create('product_costings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained('products')->cascadeOnDelete();
            $table->decimal('material_cost', 18, 4)->default(0);
            $table->decimal('labor_cost', 18, 4)->default(0);
            $table->decimal('overhead_cost', 18, 4)->default(0);
            $table->decimal('other_cost', 18, 4)->default(0);
            $table->decimal('hpp', 18, 4)->default(0);
            $table->decimal('margin_percent', 8, 4)->default(0);
            $table->decimal('suggested_price', 18, 2)->default(0);
            $table->decimal('selling_price', 18, 2)->default(0);
            $table->timestamps();
        });

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

        Schema::create('product_costing_impacts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->foreignId('raw_material_cost_history_id')->nullable()
                ->constrained('raw_material_cost_histories')->nullOnDelete();
            $table->decimal('old_material_cost', 18, 4)->default(0);
            $table->decimal('new_material_cost', 18, 4)->default(0);
            $table->decimal('old_hpp', 18, 4)->default(0);
            $table->decimal('new_hpp', 18, 4)->default(0);
            $table->decimal('hpp_change_amount', 18, 4)->default(0);
            $table->decimal('hpp_change_percent', 12, 4)->default(0);
            $table->decimal('old_suggested_price', 18, 2)->default(0);
            $table->decimal('new_suggested_price', 18, 2)->default(0);
            $table->string('trigger_type', 50)->default('raw_material_cost_change');
            $table->timestamp('occurred_at');
            $table->timestamps();
            $table->index(['product_id', 'occurred_at'], 'product_costing_impact_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_costing_impacts');
        Schema::dropIfExists('product_materials');
        Schema::dropIfExists('product_costings');
        Schema::dropIfExists('raw_material_cost_histories');
        Schema::dropIfExists('raw_material_stock_movements');
        Schema::dropIfExists('raw_materials');
        Schema::dropIfExists('stock_movements');
    }
};
