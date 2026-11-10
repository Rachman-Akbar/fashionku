<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('raw_material_cost_histories')) {
            Schema::create('raw_material_cost_histories', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
                $table->foreignId('raw_material_stock_movement_id')->nullable();
                $table->foreign('raw_material_stock_movement_id', 'rm_cost_history_movement_fk')->references('id')->on('raw_material_stock_movements')->nullOnDelete();
                $table->decimal('old_average_cost', 18, 4)->default(0);
                $table->decimal('new_average_cost', 18, 4)->default(0);
                $table->decimal('change_amount', 18, 4)->default(0);
                $table->decimal('change_percent', 12, 4)->default(0);
                $table->string('direction', 20)->default('unchanged');
                $table->string('reference_type', 50)->default('restock');
                $table->string('reference_number', 100)->nullable()->index();
                $table->timestamp('occurred_at');
                $table->timestamps();
                $table->index(['store_id', 'raw_material_id', 'occurred_at'], 'raw_material_cost_history_lookup');
            });
        }

        if (! Schema::hasTable('product_costing_impacts')) {
            Schema::create('product_costing_impacts', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
                $table->foreignId('raw_material_cost_history_id')->nullable()->constrained('raw_material_cost_histories')->nullOnDelete();
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
                $table->index(['store_id', 'product_id', 'occurred_at'], 'product_costing_impact_lookup');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_costing_impacts');
        Schema::dropIfExists('raw_material_cost_histories');
    }
};
