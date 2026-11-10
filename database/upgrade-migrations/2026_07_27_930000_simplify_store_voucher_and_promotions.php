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
        $this->upgradeStores();
        $this->upgradePromotions();
        $this->upgradeVouchers();
        $this->upgradeCategories();
    }

    public function down(): void {}

    private function upgradeStores(): void
    {
        if (! Schema::hasTable('stores')) {
            return;
        }

        Schema::table('stores', function (Blueprint $table): void {
            if (! Schema::hasColumn('stores', 'status')) {
                $table->string('status', 30)->nullable()->after('address')->index();
            }
            if (! Schema::hasColumn('stores', 'created_by')) {
                $table->foreignUuid('created_by')->nullable()->after('banner_url')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('stores', 'updated_by')) {
                $table->foreignUuid('updated_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('stores', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        DB::statement('ALTER TABLE stores MODIFY status VARCHAR(30) NULL');
        DB::table('stores')->whereNull('status')->update(['status' => 'approved']);
        DB::table('stores')->whereIn('status', ['active', 'inactive', 'review'])->update(['status' => 'approved']);
        DB::table('stores')->whereIn('status', ['banned', 'blocked'])->update(['status' => 'suspended', 'is_active' => false]);
        DB::table('stores')->whereNotIn('status', ['pending', 'approved', 'suspended'])->update(['status' => 'pending']);
        DB::statement("ALTER TABLE stores MODIFY status ENUM('pending','approved','suspended') NOT NULL DEFAULT 'pending'");

        $columns = ['banned_at', 'ban_reason', 'banned_by', 'unbanned_at', 'suspended_at', 'suspension_reason'];
        $this->dropForeignKeysForColumns('stores', $columns);
        $drop = array_values(array_filter($columns, fn (string $column): bool => Schema::hasColumn('stores', $column)));

        if ($drop !== []) {
            Schema::table('stores', fn (Blueprint $table) => $table->dropColumn($drop));
        }
    }

    private function upgradePromotions(): void
    {
        if (! Schema::hasTable('promotions')) {
            return;
        }

        Schema::table('promotions', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotions', 'store_id')) {
                $table->foreignId('store_id')->nullable()->after('id')->constrained('stores')->cascadeOnDelete();
            }
            if (! Schema::hasColumn('promotions', 'name')) {
                $table->string('name', 150)->default('promotion')->after('store_id');
            }
            if (! Schema::hasColumn('promotions', 'mobile_image_url')) {
                $table->string('mobile_image_url')->nullable()->after('image_url');
            }
            if (! Schema::hasColumn('promotions', 'approval_status')) {
                $table->string('approval_status', 20)->nullable()->after('is_active')->index();
            }
            if (! Schema::hasColumn('promotions', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable();
            }
            if (! Schema::hasColumn('promotions', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->index();
            }
            if (! Schema::hasColumn('promotions', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->index();
            }
            if (! Schema::hasColumn('promotions', 'approved_by')) {
                $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('promotions', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        DB::statement('ALTER TABLE promotions MODIFY approval_status VARCHAR(20) NULL');
        DB::table('promotions')->whereNull('approval_status')->update(['approval_status' => 'approved']);
        DB::table('promotions')->whereNotIn('approval_status', ['pending', 'approved', 'rejected'])->update(['approval_status' => 'approved']);
        DB::table('promotions')->whereNull('submitted_at')->update(['submitted_at' => now()]);
        DB::statement("ALTER TABLE promotions MODIFY approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");

        DB::table('promotions')
            ->whereNotNull('store_id')
            ->whereNotExists(function ($query): void {
                $query->selectRaw('1')->from('stores')->whereColumn('stores.id', 'promotions.store_id');
            })
            ->delete();

        $this->replaceStoreForeignKey('promotions', 'store_id', 'cascade');
    }

    private function upgradeVouchers(): void
    {
        if (! Schema::hasTable('vouchers')) {
            return;
        }

        if (Schema::hasColumn('vouchers', 'store_id')) {
            $this->dropForeignKeysForColumns('vouchers', ['store_id']);
            DB::statement("DELETE FROM vouchers WHERE store_id IS NOT NULL AND CAST(store_id AS CHAR) NOT REGEXP '^[0-9]+$'");
            DB::statement('ALTER TABLE vouchers MODIFY store_id BIGINT UNSIGNED NULL');
        }

        Schema::table('vouchers', function (Blueprint $table): void {
            if (! Schema::hasColumn('vouchers', 'voucher_scope')) {
                $table->string('voucher_scope', 20)->nullable()->after('store_id')->index();
            }
            if (! Schema::hasColumn('vouchers', 'discount_target')) {
                $table->string('discount_target', 20)->nullable()->after('image')->index();
            }
        });

        DB::statement('ALTER TABLE vouchers MODIFY discount_type VARCHAR(30) NULL');
        DB::table('vouchers')->whereNull('discount_type')->update(['discount_type' => 'fixed']);
        DB::table('vouchers')->whereNull('store_id')->update(['voucher_scope' => 'platform']);
        DB::table('vouchers')->whereNotNull('store_id')->update(['voucher_scope' => 'store']);
        DB::table('vouchers')->whereIn('discount_type', ['free_shipping', 'shipping_percentage', 'shipping_fixed'])->update(['discount_target' => 'shipping']);
        DB::table('vouchers')->whereNull('discount_target')->update(['discount_target' => 'product']);
        DB::table('vouchers')->where('discount_type', 'free_shipping')->update(['discount_type' => 'percentage', 'discount_value' => 100]);
        DB::table('vouchers')->where('discount_type', 'shipping_percentage')->update(['discount_type' => 'percentage']);
        DB::table('vouchers')->where('discount_type', 'shipping_fixed')->update(['discount_type' => 'fixed']);
        DB::table('vouchers')->whereNotIn('discount_target', ['product', 'shipping'])->update(['discount_target' => 'product']);
        DB::table('vouchers')->whereNotIn('voucher_scope', ['platform', 'store'])->update(['voucher_scope' => 'platform', 'store_id' => null]);

        DB::table('vouchers')
            ->where('voucher_scope', 'store')
            ->where(function ($query): void {
                $query->whereNull('store_id')->orWhereNotExists(function ($subQuery): void {
                    $subQuery->selectRaw('1')->from('stores')->whereColumn('stores.id', 'vouchers.store_id');
                });
            })
            ->delete();

        DB::table('vouchers')->where('voucher_scope', 'platform')->update(['store_id' => null]);
        DB::statement("ALTER TABLE vouchers MODIFY voucher_scope ENUM('platform','store') NOT NULL DEFAULT 'platform'");
        DB::statement("ALTER TABLE vouchers MODIFY discount_target ENUM('product','shipping') NOT NULL DEFAULT 'product'");
        DB::statement("ALTER TABLE vouchers MODIFY discount_type ENUM('fixed','percentage') NOT NULL");

        $this->replaceStoreForeignKey('vouchers', 'store_id', 'cascade');
        $this->addVoucherScopeCheck();
    }

    private function upgradeCategories(): void
    {
        if (! Schema::hasTable('categories')) {
            return;
        }

        DB::table('categories')
            ->where('level', '!=', 3)
            ->update(['image_url' => null, 'icon_url' => null]);

        $exists = DB::table('information_schema.TABLE_CONSTRAINTS')
            ->whereRaw('CONSTRAINT_SCHEMA = DATABASE()')
            ->where('TABLE_NAME', 'categories')
            ->where('CONSTRAINT_NAME', 'categories_level_media_check')
            ->exists();

        if (! $exists) {
            try {
                DB::statement('ALTER TABLE categories ADD CONSTRAINT categories_level_media_check CHECK ((level = 3) OR (image_url IS NULL AND icon_url IS NULL))');
            } catch (Throwable) {
            }
        }
    }

    private function replaceStoreForeignKey(string $table, string $column, string $onDelete): void
    {
        if (! Schema::hasColumn($table, $column)) {
            return;
        }

        $this->dropForeignKeysForColumns($table, [$column]);
        $constraint = "{$table}_{$column}_foreign";
        DB::statement("ALTER TABLE `{$table}` ADD CONSTRAINT `{$constraint}` FOREIGN KEY (`{$column}`) REFERENCES `stores` (`id`) ON DELETE ".strtoupper($onDelete));
    }

    private function dropForeignKeysForColumns(string $table, array $columns): void
    {
        if ($columns === []) {
            return;
        }

        $bindings = implode(',', array_fill(0, count($columns), '?'));
        $keys = DB::select(
            "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME IN ({$bindings}) AND REFERENCED_TABLE_NAME IS NOT NULL",
            array_merge([$table], $columns)
        );

        foreach ($keys as $key) {
            DB::statement("ALTER TABLE `{$table}` DROP FOREIGN KEY `{$key->CONSTRAINT_NAME}`");
        }
    }

    private function addVoucherScopeCheck(): void
    {
        $exists = DB::table('information_schema.TABLE_CONSTRAINTS')
            ->whereRaw('CONSTRAINT_SCHEMA = DATABASE()')
            ->where('TABLE_NAME', 'vouchers')
            ->where('CONSTRAINT_NAME', 'vouchers_scope_store_check')
            ->exists();

        if ($exists) {
            return;
        }

        try {
            DB::statement("ALTER TABLE vouchers ADD CONSTRAINT vouchers_scope_store_check CHECK ((voucher_scope = 'platform' AND store_id IS NULL) OR (voucher_scope = 'store' AND store_id IS NOT NULL))");
        } catch (Throwable) {
        }
    }
};
