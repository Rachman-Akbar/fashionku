<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Kolom `status` publikasi produk dihapus: satu-satunya penentu tampil di
 * marketplace adalah `is_active` (aktif = tayang, nonaktif = disembunyikan).
 */
return new class extends Migration
{
    private const NEW_INDEXES = [
        'products_public_feed_index',
        'products_category_active_index',
        'products_public_feed_idx',
        'products_category_feed_idx',
    ];

    public function up(): void
    {
        if (! Schema::hasColumn('products', 'status')) {
            return;
        }

        // MySQL mewajibkan kolom FK (primary_category_id) punya index. Index
        // pengganti dipasang dulu supaya index lama yang memuat `status` bisa
        // dilepas tanpa melanggar foreign key.
        if (! $this->hasIndex('products_category_active_index')) {
            Schema::table('products', function (Blueprint $table): void {
                $table->index(['primary_category_id', 'is_active'], 'products_category_active_index');
            });
        }

        // Index yang memakai kolom status harus dilepas lebih dulu
        // (SQLite menolak drop column selama kolom masih dipakai index).
        foreach (Schema::getIndexes('products') as $index) {
            if (($index['primary'] ?? false) || empty($index['columns'])) {
                continue;
            }

            if (! in_array('status', $index['columns'], true)) {
                continue;
            }

            Schema::table('products', function (Blueprint $table) use ($index): void {
                $table->dropIndex($index['name']);
            });
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('status');
        });

        Schema::table('products', function (Blueprint $table): void {
            if (! $this->hasIndex('products_public_feed_index')) {
                $table->index(['is_active', 'deleted_at'], 'products_public_feed_index');
            }

            if (! $this->hasIndex('products_public_feed_idx')) {
                $table->index(['is_active', 'created_at', 'id'], 'products_public_feed_idx');
            }

            if (! $this->hasIndex('products_category_feed_idx')) {
                $table->index(['primary_category_id', 'is_active', 'created_at', 'id'], 'products_category_feed_idx');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('products', 'status')) {
            Schema::table('products', function (Blueprint $table): void {
                $table->enum('status', ['draft', 'published', 'archived'])->default('published')->index()->after('thumbnail');
            });
        }

        // Index pengganti yang memuat status dipasang lebih dulu agar foreign
        // key primary_category_id tidak kehilangan index pendukung.
        Schema::table('products', function (Blueprint $table): void {
            $table->index(['primary_category_id', 'status', 'is_active'], 'products_category_status_index');
            $table->index(['status', 'is_active', 'deleted_at'], 'products_public_feed_index_legacy');
            $table->index(['status', 'is_active', 'created_at', 'id'], 'products_public_feed_idx_legacy');
            $table->index(['primary_category_id', 'status', 'is_active', 'created_at', 'id'], 'products_category_feed_idx_legacy');
        });

        foreach (self::NEW_INDEXES as $indexName) {
            if (! $this->hasIndex($indexName)) {
                continue;
            }

            Schema::table('products', function (Blueprint $table) use ($indexName): void {
                $table->dropIndex($indexName);
            });
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->renameIndex('products_public_feed_index_legacy', 'products_public_feed_index');
            $table->renameIndex('products_public_feed_idx_legacy', 'products_public_feed_idx');
            $table->renameIndex('products_category_feed_idx_legacy', 'products_category_feed_idx');
        });
    }

    private function hasIndex(string $name): bool
    {
        foreach (Schema::getIndexes('products') as $index) {
            if (($index['name'] ?? '') === $name) {
                return true;
            }
        }

        return false;
    }
};
