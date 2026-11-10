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
        if (! Schema::hasTable('promotions')) {
            return;
        }

        $missing = [
            'store_id' => ! Schema::hasColumn('promotions', 'store_id'),
            'approval_status' => ! Schema::hasColumn('promotions', 'approval_status'),
            'rejection_reason' => ! Schema::hasColumn('promotions', 'rejection_reason'),
            'submitted_at' => ! Schema::hasColumn('promotions', 'submitted_at'),
            'approved_at' => ! Schema::hasColumn('promotions', 'approved_at'),
            'approved_by' => ! Schema::hasColumn('promotions', 'approved_by'),
        ];

        Schema::table('promotions', function (Blueprint $table) use ($missing): void {
            if ($missing['store_id']) {
                $table->foreignId('store_id')->nullable()->after('id')->constrained('stores')->nullOnDelete();
            }

            if ($missing['approval_status']) {
                $table->enum('approval_status', ['pending', 'approved', 'rejected'])
                    ->default('pending')
                    ->after('is_active')
                    ->index();
            }

            if ($missing['rejection_reason']) {
                $table->text('rejection_reason')->nullable()->after('approval_status');
            }

            if ($missing['submitted_at']) {
                $table->timestamp('submitted_at')->nullable()->after('rejection_reason')->index();
            }

            if ($missing['approved_at']) {
                $table->timestamp('approved_at')->nullable()->after('submitted_at')->index();
            }

            if ($missing['approved_by']) {
                $table->foreignUuid('approved_by')->nullable()->after('approved_at')->constrained('users')->nullOnDelete();
            }
        });

        $legacyPromotions = DB::table('promotions');

        if (! $missing['approval_status']) {
            $legacyPromotions->where(function ($query): void {
                $query->whereNull('approval_status')
                    ->orWhereNotIn('approval_status', ['pending', 'approved', 'rejected']);
            });
        }

        $legacyPromotions->update([
            'approval_status' => 'approved',
            'submitted_at' => DB::raw('COALESCE(submitted_at, created_at, CURRENT_TIMESTAMP)'),
            'approved_at' => DB::raw('COALESCE(approved_at, updated_at, created_at, CURRENT_TIMESTAMP)'),
        ]);

        $this->addIndexIfMissing(
            'promotions',
            'promotions_approval_public_index',
            ['approval_status', 'is_active', 'sort_order', 'deleted_at']
        );
        $this->addIndexIfMissing(
            'promotions',
            'promotions_store_approval_index',
            ['store_id', 'approval_status', 'deleted_at']
        );
    }

    public function down(): void {}

    private function addIndexIfMissing(string $table, string $index, array $columns): void
    {
        $exists = DB::selectOne(
            'SELECT COUNT(*) AS aggregate FROM information_schema.statistics WHERE table_schema = ? AND table_name = ? AND index_name = ?',
            [DB::getDatabaseName(), $table, $index]
        );

        if ((int) ($exists->aggregate ?? 0) > 0) {
            return;
        }

        foreach ($columns as $column) {
            if (! Schema::hasColumn($table, $column)) {
                return;
            }
        }

        $columnList = implode(', ', array_map(fn (string $column): string => "`{$column}`", $columns));
        DB::statement("CREATE INDEX `{$index}` ON `{$table}` ({$columnList})");
    }
};
