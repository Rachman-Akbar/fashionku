<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sistem banned dihapus: status akun cukup lewat `is_active` (aktif/nonaktif).
 * Kolom banned_at dan violation_message ikut dibuang.
 */
return new class extends Migration
{
    private array $columns = ['banned_at', 'violation_message'];

    public function up(): void
    {
        $existing = array_values(array_filter(
            $this->columns,
            fn (string $column): bool => Schema::hasColumn('users', $column)
        ));

        if ($existing === []) {
            return;
        }

        // Index yang memakai kolom tersebut harus dilepas lebih dulu.
        foreach (Schema::getIndexes('users') as $index) {
            if (($index['primary'] ?? false) || empty(array_intersect($index['columns'], $existing))) {
                continue;
            }

            Schema::table('users', function (Blueprint $table) use ($index): void {
                $table->dropIndex($index['name']);
            });
        }

        Schema::table('users', function (Blueprint $table) use ($existing): void {
            $table->dropColumn($existing);
        });

        // Filter daftar user/pelanggan kini cukup memakai is_active.
        Schema::table('users', function (Blueprint $table): void {
            $table->index(['is_active', 'deleted_at'], 'users_access_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (! Schema::hasColumn('users', 'banned_at')) {
                $table->timestamp('banned_at')->nullable()->after('is_active');
            }

            if (! Schema::hasColumn('users', 'violation_message')) {
                $table->text('violation_message')->nullable()->after('banned_at');
            }
        });
    }
};
