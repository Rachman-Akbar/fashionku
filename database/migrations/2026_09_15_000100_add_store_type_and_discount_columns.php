<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table): void {
            $table->string('store_type', 40)->default('regular')->index()->after('is_active');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->decimal('price_original', 15, 2)->nullable()->after('price');
            $table->decimal('price_sale', 15, 2)->nullable()->after('price_original');
            $table->index(['price_sale', 'is_default'], 'product_variants_sale_default_idx');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table): void {
            $table->dropIndex(['store_type']);
            $table->dropColumn('store_type');
        });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropIndex('product_variants_sale_default_idx');
            $table->dropColumn(['price_original', 'price_sale']);
        });
    }
};
