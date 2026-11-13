<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * CatalogGroup dihapus. Kategori kini murni hierarkis 3 level
 * (level 1 = root/parent_id null, level 2 & 3 = turunan).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('categories')) {
            return;
        }

        if (Schema::hasColumn('categories', 'catalog_group_id')) {
            // SQLite tidak mendukung ALTER TABLE DROP COLUMN untuk kolom yang
            // masih menjadi bagian definisi foreign key. Kolom warisan ini
            // dibiarkan (nullable, tidak dipakai model) pada SQLite/test,
            // sementara MySQL tetap dibersihkan.
            if (DB::getDriverName() === 'sqlite') {
                Schema::dropIfExists('catalog_groups');

                return;
            }

            if (DB::getDriverName() === 'mysql') {
                $foreigns = DB::select(
                    'SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
                     WHERE TABLE_SCHEMA = DATABASE()
                       AND TABLE_NAME = "categories"
                       AND COLUMN_NAME = "catalog_group_id"
                       AND REFERENCED_TABLE_NAME = "catalog_groups"'
                );

                foreach ($foreigns as $foreign) {
                    DB::statement('ALTER TABLE categories DROP FOREIGN KEY '.$foreign->CONSTRAINT_NAME);
                }

                if (DB::getDriverName() === 'mysql') {
                $indexes = DB::select(
                    'SELECT INDEX_NAME FROM information_schema.STATISTICS
                     WHERE TABLE_SCHEMA = DATABASE()
                       AND TABLE_NAME = "categories"
                       AND INDEX_NAME IN ("categories_parent_name_unique", "categories_catalog_group_id_parent_id_sort_order_index")'
                );

                foreach (array_column($indexes, 'INDEX_NAME') as $indexName) {
                    DB::statement('ALTER TABLE categories DROP INDEX '.$indexName);
                }
            }
            }

            Schema::table('categories', function (Blueprint $table): void {
                $table->dropColumn('catalog_group_id');
            });
        }

        if (DB::getDriverName() === 'mysql') {
            $uniqueExists = DB::selectOne(
                'SELECT COUNT(*) AS total FROM information_schema.STATISTICS
                 WHERE TABLE_SCHEMA = DATABASE()
                   AND TABLE_NAME = "categories"
                   AND INDEX_NAME = "categories_parent_name_unique"'
            );

            if ((int) ($uniqueExists->total ?? 0) === 0) {
                DB::statement('ALTER TABLE categories ADD CONSTRAINT categories_parent_name_unique UNIQUE (parent_scope_id, name)');
            }

            $indexExists = DB::selectOne(
                'SELECT COUNT(*) AS total FROM information_schema.STATISTICS
                 WHERE TABLE_SCHEMA = DATABASE()
                   AND TABLE_NAME = "categories"
                   AND INDEX_NAME = "categories_parent_id_sort_order_index"'
            );

            if ((int) ($indexExists->total ?? 0) === 0) {
                DB::statement('ALTER TABLE categories ADD INDEX categories_parent_id_sort_order_index (parent_id, sort_order)');
            }
        }

        Schema::dropIfExists('catalog_groups');
    }

    public function down(): void
    {
        if (Schema::hasTable('catalog_groups')) {
            return;
        }

        Schema::create('catalog_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['is_active', 'deleted_at'], 'catalog_groups_status_index');
        });

        if (! Schema::hasTable('categories')) {
            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE categories DROP INDEX categories_parent_name_unique');
        }

        if (! Schema::hasColumn('categories', 'catalog_group_id')) {
            Schema::table('categories', function (Blueprint $table): void {
                $table->foreignId('catalog_group_id')->nullable()->constrained('catalog_groups')->cascadeOnDelete();
            });
        }
    }
};