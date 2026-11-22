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
            $table->string('code', 100)->nullable()->after('id');
            $table->unique('code', 'products_code_unique');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->decimal('hpp', 18, 4)->default(0)->after('price_sale');
        });

        Schema::create('product_variant_materials', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->decimal('quantity', 18, 4);
            $table->decimal('unit_cost', 18, 4)->default(0);
            $table->decimal('total_cost', 18, 4)->default(0);
            $table->timestamps();
            $table->unique(['variant_id', 'raw_material_id'], 'variant_material_unique');
            $table->index(['raw_material_id'], 'variant_material_raw_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_materials');

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropColumn('hpp');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropUnique('products_code_unique');
            $table->dropColumn('code');
        });
    }
};
