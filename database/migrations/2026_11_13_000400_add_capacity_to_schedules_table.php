<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table): void {
            $table->unsignedInteger('capacity')->default(1)->after('date');
            $table->index(['date', 'capacity'], 'schedules_date_capacity_index');
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table): void {
            $table->dropIndex('schedules_date_capacity_index');
            $table->dropColumn('capacity');
        });
    }
};
