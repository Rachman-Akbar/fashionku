<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Alur approval promosi dihapus: promosi yang disimpan langsung tayang.
 * Kolom antrean review ikut dibuang agar tidak ada data menggantung.
 */
return new class extends Migration
{
    private array $columns = ['approval_status', 'rejection_reason', 'submitted_at', 'approved_at', 'approved_by'];

    public function up(): void
    {
        $existing = array_values(array_filter(
            $this->columns,
            fn (string $column): bool => Schema::hasColumn('promotions', $column)
        ));

        if ($existing === []) {
            return;
        }

        // Foreign key pada approved_by harus dilepas lebih dulu
        // (dicek lewat Schema agar jalan di MySQL maupun SQLite).
        if (Schema::hasColumn('promotions', 'approved_by')) {
            foreach (Schema::getForeignKeys('promotions') as $foreignKey) {
                if (in_array('approved_by', $foreignKey['columns'], true)) {
                    // SQLite/MySQL sama-sama menerima dropForeign berbasis kolom.
                    Schema::table('promotions', function (Blueprint $table): void {
                        $table->dropForeign(['approved_by']);
                    });

                    break;
                }
            }
        }

        // Index pada kolom yang dibuang harus dilepas lebih dulu
        // (SQLite menolak drop column jika masih dipakai index).
        foreach (Schema::getIndexes('promotions') as $index) {
            if (($index['primary'] ?? false) || empty(array_intersect($index['columns'], $existing))) {
                continue;
            }

            Schema::table('promotions', function (Blueprint $table) use ($index): void {
                $table->dropIndex($index['name']);
            });
        }

        Schema::table('promotions', function (Blueprint $table) use ($existing): void {
            $table->dropColumn($existing);
        });
    }

    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotions', 'approval_status')) {
                $table->string('approval_status', 20)->default('approved')->after('is_active');
            }

            if (! Schema::hasColumn('promotions', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('approval_status');
            }

            if (! Schema::hasColumn('promotions', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->after('rejection_reason');
            }

            if (! Schema::hasColumn('promotions', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('submitted_at');
            }

            if (! Schema::hasColumn('promotions', 'approved_by')) {
                $table->uuid('approved_by')->nullable()->after('approved_at');
            }
        });
    }
};
