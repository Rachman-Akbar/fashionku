<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table): void {
            $table->string('status', 20)->default('todo')->index()->after('type');
            $table->unsignedInteger('position')->default(0)->after('status');
            $table->string('assignee', 120)->nullable()->after('position');
            $table->string('label', 80)->nullable()->after('assignee');
            $table->json('completion_proof')->nullable()->after('metadata');
        });

        // Backfill: jadwal lama yang sudah selesai dimasukkan ke status 'done'.
        DB::table('schedules')
            ->where('is_completed', true)
            ->where('status', 'todo')
            ->update(['status' => 'done']);
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table): void {
            $table->dropColumn(['status', 'position', 'assignee', 'label', 'completion_proof']);
        });
    }
};
