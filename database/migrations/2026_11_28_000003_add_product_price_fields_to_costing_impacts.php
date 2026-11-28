<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_costing_impacts', function (Blueprint $table): void {
            $table->foreignId('product_variant_id')
                ->nullable()
                ->after('product_id')
                ->constrained('product_variants')
                ->nullOnDelete();
            $table->decimal('old_selling_price', 18, 2)->default(0);
            $table->decimal('new_selling_price', 18, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('product_costing_impacts', function (Blueprint $table): void {
            $table->dropForeign(['product_variant_id']);
            $table->dropColumn(['product_variant_id', 'old_selling_price', 'new_selling_price']);
        });
    }
};
