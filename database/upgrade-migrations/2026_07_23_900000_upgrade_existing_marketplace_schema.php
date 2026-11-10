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
        $this->upgradeUsers();
        $this->upgradeRolesAndPermissions();
        $this->upgradeActiveEntities();
        $this->upgradeCatalogSupportTables();
        $this->normalizeNames();
        $this->assertUniqueData();
        $this->addUniqueIndexes();
        $this->addOperationalIndexes();
        $this->repairForeignKeys();
    }

    public function down(): void {}

    private function upgradeUsers(): void
    {
        $missing = [
            'is_active' => ! Schema::hasColumn('users', 'is_active'),
            'banned_at' => ! Schema::hasColumn('users', 'banned_at'),
            'created_by' => ! Schema::hasColumn('users', 'created_by'),
            'updated_by' => ! Schema::hasColumn('users', 'updated_by'),
        ];

        Schema::table('users', function (Blueprint $table) use ($missing): void {
            if ($missing['is_active']) {
                $table->boolean('is_active')->default(true)->after('is_email_verified')->index();
            }

            if ($missing['banned_at']) {
                $table->timestamp('banned_at')->nullable()->after('is_active')->index();
            }

            if ($missing['created_by']) {
                $table->uuid('created_by')->nullable()->after('banned_at')->index();
            }

            if ($missing['updated_by']) {
                $table->uuid('updated_by')->nullable()->after('created_by')->index();
            }
        });
    }

    private function upgradeRolesAndPermissions(): void
    {
        $missing = [
            'description' => ! Schema::hasColumn('roles', 'description'),
            'is_active' => ! Schema::hasColumn('roles', 'is_active'),
            'created_by' => ! Schema::hasColumn('roles', 'created_by'),
            'updated_by' => ! Schema::hasColumn('roles', 'updated_by'),
            'updated_at' => ! Schema::hasColumn('roles', 'updated_at'),
            'deleted_at' => ! Schema::hasColumn('roles', 'deleted_at'),
        ];

        Schema::table('roles', function (Blueprint $table) use ($missing): void {
            if ($missing['description']) {
                $table->string('description')->nullable()->after('name');
            }

            if ($missing['is_active']) {
                $table->boolean('is_active')->default(true)->after('description')->index();
            }

            if ($missing['created_by']) {
                $table->uuid('created_by')->nullable()->after('is_active')->index();
            }

            if ($missing['updated_by']) {
                $table->uuid('updated_by')->nullable()->after('created_by')->index();
            }

            if ($missing['updated_at']) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            }

            if ($missing['deleted_at']) {
                $table->softDeletes()->index();
            }
        });

        if (! Schema::hasTable('permissions')) {
            Schema::create('permissions', function (Blueprint $table): void {
                $table->id();
                $table->string('name', 100)->unique();
                $table->string('description')->nullable();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('role_permissions')) {
            Schema::create('role_permissions', function (Blueprint $table): void {
                $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
                $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
                $table->timestamps();
                $table->primary(['role_id', 'permission_id']);
                $table->index(['permission_id', 'role_id']);
            });
        }
    }

    private function upgradeActiveEntities(): void
    {
        foreach (['catalog_groups', 'categories', 'products', 'banners', 'promotions', 'vouchers'] as $tableName) {
            $missing = [
                'is_active' => ! Schema::hasColumn($tableName, 'is_active'),
                'created_by' => ! Schema::hasColumn($tableName, 'created_by'),
                'updated_by' => ! Schema::hasColumn($tableName, 'updated_by'),
                'deleted_at' => ! Schema::hasColumn($tableName, 'deleted_at'),
            ];

            Schema::table($tableName, function (Blueprint $table) use ($missing): void {
                if ($missing['is_active']) {
                    $table->boolean('is_active')->default(true)->index();
                }

                if ($missing['created_by']) {
                    $table->uuid('created_by')->nullable()->index();
                }

                if ($missing['updated_by']) {
                    $table->uuid('updated_by')->nullable()->index();
                }

                if ($missing['deleted_at']) {
                    $table->softDeletes()->index();
                }
            });
        }

        if (! Schema::hasColumn('categories', 'parent_scope_id')) {
            Schema::table('categories', function (Blueprint $table): void {
                $table->unsignedBigInteger('parent_scope_id')->default(0)->after('parent_id');
            });
        }

        if (! Schema::hasColumn('banners', 'name')) {
            Schema::table('banners', function (Blueprint $table): void {
                $table->string('name', 150)->nullable()->after('store_id');
            });
        }

        if (! Schema::hasColumn('promotions', 'name')) {
            Schema::table('promotions', function (Blueprint $table): void {
                $table->string('name', 150)->nullable()->after('id');
            });
        }

        if (Schema::hasColumn('vouchers', 'store_id')) {
            DB::statement("UPDATE vouchers SET store_id = NULL WHERE store_id IS NOT NULL AND store_id NOT REGEXP '^[0-9]+$'");
            DB::statement('ALTER TABLE vouchers MODIFY store_id BIGINT UNSIGNED NULL');
        }

        DB::statement('UPDATE categories SET parent_scope_id = COALESCE(parent_id, 0)');
        DB::statement("UPDATE banners SET name = CONCAT('banner-', id) WHERE name IS NULL OR TRIM(name) = ''");
        DB::statement("UPDATE promotions SET name = CONCAT('promotion-', id) WHERE name IS NULL OR TRIM(name) = ''");
        DB::statement('ALTER TABLE banners MODIFY name VARCHAR(150) NOT NULL');
        DB::statement('ALTER TABLE promotions MODIFY name VARCHAR(150) NOT NULL');
    }

    private function upgradeCatalogSupportTables(): void
    {
        foreach (['product_attributes', 'product_attribute_values', 'product_categories', 'product_variant_values'] as $tableName) {
            $missingCreatedAt = ! Schema::hasColumn($tableName, 'created_at');
            $missingUpdatedAt = ! Schema::hasColumn($tableName, 'updated_at');

            Schema::table($tableName, function (Blueprint $table) use ($missingCreatedAt, $missingUpdatedAt): void {
                if ($missingCreatedAt) {
                    $table->timestamp('created_at')->nullable();
                }

                if ($missingUpdatedAt) {
                    $table->timestamp('updated_at')->nullable();
                }
            });
        }
    }

    private function normalizeNames(): void
    {
        foreach (['products', 'categories', 'catalog_groups', 'banners', 'promotions', 'roles'] as $table) {
            DB::statement("UPDATE {$table} SET name = LOWER(TRIM(name)) WHERE name IS NOT NULL");
        }

        DB::statement('UPDATE vouchers SET code = LOWER(TRIM(code)), name = LOWER(TRIM(name))');
        DB::statement('UPDATE users SET email = LOWER(TRIM(email))');
        DB::statement('UPDATE product_attributes SET name = LOWER(TRIM(name))');
        DB::statement('UPDATE product_variants SET name = LOWER(TRIM(name))');
    }

    private function assertUniqueData(): void
    {
        $this->assertNoDuplicates('users', ['email']);
        $this->assertNoDuplicates('roles', ['name']);
        $this->assertNoDuplicates('catalog_groups', ['name']);
        $this->assertNoDuplicates('categories', ['catalog_group_id', 'parent_scope_id', 'name']);
        $this->assertNoDuplicates('products', ['store_id', 'name']);
        $this->assertNoDuplicates('banners', ['store_id', 'name']);
        $this->assertNoDuplicates('promotions', ['name']);
        $this->assertNoDuplicates('vouchers', ['code']);
        $this->assertNoDuplicates('vouchers', ['name']);
        $this->assertNoDuplicates('product_attributes', ['name']);
        $this->assertNoDuplicates('product_variants', ['product_id', 'name']);
    }

    private function addUniqueIndexes(): void
    {
        $this->addUniqueIndex('roles', 'roles_name_unique', ['name']);
        $this->addUniqueIndex('catalog_groups', 'catalog_groups_name_unique', ['name']);
        $this->addUniqueIndex('categories', 'categories_parent_name_unique', ['catalog_group_id', 'parent_scope_id', 'name']);
        $this->addUniqueIndex('products', 'products_store_name_unique', ['store_id', 'name']);
        $this->addUniqueIndex('banners', 'banners_store_name_unique', ['store_id', 'name']);
        $this->addUniqueIndex('promotions', 'promotions_name_unique', ['name']);
        $this->addUniqueIndex('vouchers', 'vouchers_code_unique', ['code']);
        $this->addUniqueIndex('vouchers', 'vouchers_name_unique', ['name']);
        $this->addUniqueIndex('product_attributes', 'product_attributes_name_unique', ['name']);
        $this->addUniqueIndex('product_variants', 'product_variants_product_name_unique', ['product_id', 'name']);
    }

    private function addOperationalIndexes(): void
    {
        $this->addIndex('users', 'users_access_status_index', ['is_active', 'banned_at', 'deleted_at']);
        $this->addIndex('roles', 'roles_status_index', ['is_active', 'deleted_at']);
        $this->addIndex('catalog_groups', 'catalog_groups_status_index', ['is_active', 'deleted_at']);
        $this->addIndex('categories', 'categories_menu_status_index', ['is_active', 'is_visible_in_menu', 'deleted_at']);
        $this->addIndex('products', 'products_public_feed_index', ['store_id', 'status', 'is_active', 'deleted_at']);
        $this->addIndex('banners', 'banners_public_index', ['store_id', 'is_active', 'sort_order', 'deleted_at']);
        $this->addIndex('promotions', 'promotions_public_index', ['is_active', 'sort_order', 'deleted_at']);
        $this->addIndex('vouchers', 'vouchers_active_period_index', ['is_active', 'starts_at', 'ends_at', 'deleted_at']);
        $this->addIndex('vouchers', 'vouchers_store_status_index', ['store_id', 'is_active', 'deleted_at']);
    }

    private function repairForeignKeys(): void
    {
        $this->addForeignKeyIfMissing('users', 'created_by', 'users', 'id', 'users_created_by_foreign');
        $this->addForeignKeyIfMissing('users', 'updated_by', 'users', 'id', 'users_updated_by_foreign');
        $this->addForeignKeyIfMissing('roles', 'created_by', 'users', 'id', 'roles_created_by_foreign');
        $this->addForeignKeyIfMissing('roles', 'updated_by', 'users', 'id', 'roles_updated_by_foreign');

        foreach (['catalog_groups', 'categories', 'products', 'banners', 'promotions', 'vouchers'] as $table) {
            $this->addForeignKeyIfMissing($table, 'created_by', 'users', 'id', "{$table}_created_by_foreign");
            $this->addForeignKeyIfMissing($table, 'updated_by', 'users', 'id', "{$table}_updated_by_foreign");
        }

        DB::statement('ALTER TABLE carts MODIFY user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL');
        DB::statement('ALTER TABLE wishlists MODIFY user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL');

        $this->addForeignKeyIfMissing('user_roles', 'user_id', 'users', 'id', 'user_roles_user_id_foreign', 'CASCADE');
        $this->addForeignKeyIfMissing('banners', 'store_id', 'stores', 'id', 'banners_store_id_foreign', 'CASCADE');
        $this->addForeignKeyIfMissing('vouchers', 'store_id', 'stores', 'id', 'vouchers_store_id_foreign', 'SET NULL');
        $this->addForeignKeyIfMissing('carts', 'user_id', 'users', 'id', 'carts_user_id_foreign', 'CASCADE');
        $this->addForeignKeyIfMissing('cart_items', 'product_variant_id', 'product_variants', 'id', 'cart_items_product_variant_id_foreign', 'CASCADE');
        $this->addForeignKeyIfMissing('wishlists', 'user_id', 'users', 'id', 'wishlists_user_id_foreign', 'CASCADE');
        $this->addForeignKeyIfMissing('orders', 'voucher_id', 'vouchers', 'id', 'orders_voucher_id_foreign', 'SET NULL');
        $this->addForeignKeyIfMissing('order_items', 'variant_id', 'product_variants', 'id', 'order_items_variant_id_foreign', 'SET NULL');
    }

    private function assertNoDuplicates(string $table, array $columns): void
    {
        $columnList = implode(', ', array_map(fn (string $column): string => "`{$column}`", $columns));
        $result = DB::selectOne(
            "SELECT COUNT(*) AS aggregate FROM (SELECT 1 FROM `{$table}` GROUP BY {$columnList} HAVING COUNT(*) > 1 LIMIT 1) AS duplicate_rows"
        );

        if ((int) ($result->aggregate ?? 0) > 0) {
            throw new RuntimeException(
                "Duplikat ditemukan pada {$table} untuk kolom ".implode(', ', $columns).'.'
            );
        }
    }

    private function addUniqueIndex(string $table, string $index, array $columns): void
    {
        if ($this->uniqueColumnsExist($table, $columns)) {
            return;
        }

        $columnList = implode(', ', array_map(fn (string $column): string => "`{$column}`", $columns));
        DB::statement("CREATE UNIQUE INDEX `{$index}` ON `{$table}` ({$columnList})");
    }

    private function uniqueColumnsExist(string $table, array $columns): bool
    {
        $expected = implode(',', $columns);
        $indexes = DB::select(
            "SELECT index_name, GROUP_CONCAT(column_name ORDER BY seq_in_index SEPARATOR ',') AS columns_list
             FROM information_schema.statistics
             WHERE table_schema = ? AND table_name = ? AND non_unique = 0 AND index_name <> 'PRIMARY'
             GROUP BY index_name",
            [DB::getDatabaseName(), $table]
        );

        foreach ($indexes as $index) {
            if ((string) ($index->columns_list ?? '') === $expected) {
                return true;
            }
        }

        return false;
    }

    private function addIndex(string $table, string $index, array $columns): void
    {
        if ($this->indexColumnsExist($table, $columns)) {
            return;
        }

        $columnList = implode(', ', array_map(fn (string $column): string => "`{$column}`", $columns));
        DB::statement("CREATE INDEX `{$index}` ON `{$table}` ({$columnList})");
    }

    private function indexColumnsExist(string $table, array $columns): bool
    {
        $expected = implode(',', $columns);
        $indexes = DB::select(
            "SELECT index_name, GROUP_CONCAT(column_name ORDER BY seq_in_index SEPARATOR ',') AS columns_list
             FROM information_schema.statistics
             WHERE table_schema = ? AND table_name = ?
             GROUP BY index_name",
            [DB::getDatabaseName(), $table]
        );

        foreach ($indexes as $index) {
            if ((string) ($index->columns_list ?? '') === $expected) {
                return true;
            }
        }

        return false;
    }

    private function addForeignKeyIfMissing(
        string $table,
        string $column,
        string $referencedTable,
        string $referencedColumn,
        string $constraint,
        string $onDelete = 'SET NULL'
    ): void {
        if (! Schema::hasColumn($table, $column) || $this->foreignKeyExists($table, $column)) {
            return;
        }

        DB::statement(
            "ALTER TABLE `{$table}` ADD CONSTRAINT `{$constraint}` FOREIGN KEY (`{$column}`) REFERENCES `{$referencedTable}` (`{$referencedColumn}`) ON DELETE {$onDelete}"
        );
    }

    private function foreignKeyExists(string $table, string $column): bool
    {
        $result = DB::selectOne(
            'SELECT COUNT(*) AS aggregate FROM information_schema.key_column_usage WHERE table_schema = ? AND table_name = ? AND column_name = ? AND referenced_table_name IS NOT NULL',
            [DB::getDatabaseName(), $table, $column]
        );

        return (int) ($result->aggregate ?? 0) > 0;
    }
};
