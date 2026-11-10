<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vouchers', function (Blueprint $table): void {
            $table->unsignedInteger('min_items')->nullable()->after('min_spend');
            $table->unsignedInteger('min_distinct_products')->nullable()->after('min_items');
            $table->text('terms')->nullable()->after('min_distinct_products');
        });
    }

    public function down(): void
    {
        Schema::table('vouchers', function (Blueprint $table): void {
            $table->dropColumn(['min_items', 'min_distinct_products', 'terms']);
        });
    }
};
