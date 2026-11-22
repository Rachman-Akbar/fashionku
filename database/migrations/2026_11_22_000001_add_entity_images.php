<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Dukungan foto/gambar untuk entitas master:
 * - bahan baku mendapat kolom `image` sendiri;
 * - batasan CHECK yang memaksa `categories.image_url`/`icon_url` selalu NULL
 *   kecuali level 3 dihapus, supaya semua level kategori boleh punya gambar.
 *
 * `users.avatar` sudah tersedia sejak awal sehingga tidak perlu perubahan skema
 * untuk pengguna maupun pelanggan.
 */
return new class extends Migration
{
    private const CATEGORY_MEDIA_CHECK = 'categories_level_media_check';

    public function up(): void
    {
        Schema::table('raw_materials', function (Blueprint $table): void {
            if (! Schema::hasColumn('raw_materials', 'image')) {
                $table->string('image', 255)->nullable()->after('name');
            }
        });

        $this->dropCategoryMediaCheck();
    }

    public function down(): void
    {
        $this->restoreCategoryMediaCheck();

        Schema::table('raw_materials', function (Blueprint $table): void {
            if (Schema::hasColumn('raw_materials', 'image')) {
                $table->dropColumn('image');
            }
        });
    }

    private function dropCategoryMediaCheck(): void
    {
        if (DB::getDriverName() !== 'mysql' || ! $this->categoryMediaCheckExists()) {
            return;
        }

        foreach (['DROP CONSTRAINT', 'DROP CHECK'] as $syntax) {
            try {
                DB::statement("ALTER TABLE categories {$syntax} ".self::CATEGORY_MEDIA_CHECK);

                return;
            } catch (\Throwable) {
                // MySQL dan MariaDB memakai sintaks berbeda; coba sintaks lainnya.
            }
        }
    }

    private function restoreCategoryMediaCheck(): void
    {
        if (DB::getDriverName() !== 'mysql' || $this->categoryMediaCheckExists()) {
            return;
        }

        DB::statement(
            'ALTER TABLE categories ADD CONSTRAINT '.self::CATEGORY_MEDIA_CHECK
            .' CHECK ((level = 3) OR (image_url IS NULL AND icon_url IS NULL))'
        );
    }

    private function categoryMediaCheckExists(): bool
    {
        $row = DB::selectOne(
            'SELECT COUNT(*) AS total FROM information_schema.TABLE_CONSTRAINTS
             WHERE CONSTRAINT_SCHEMA = DATABASE()
               AND TABLE_NAME = ?
               AND CONSTRAINT_NAME = ?',
            ['categories', self::CATEGORY_MEDIA_CHECK]
        );

        return (int) ($row->total ?? 0) > 0;
    }
};
