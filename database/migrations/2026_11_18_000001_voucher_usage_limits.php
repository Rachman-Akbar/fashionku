<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Batas pemakaian voucher per user, diatur lewat database.
 *
 * `usage_limit_per_user` = 0 berarti tanpa batas. Backend membaca kolom ini
 * (bersama `starts_at` / `ends_at` / `usage_limit`) setiap kali voucher dievaluasi
 * saat checkout, sehingga syarat voucher tidak pernah ditentukan oleh frontend.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('vouchers', 'usage_limit_per_user')) {
            Schema::table('vouchers', function (Blueprint $table): void {
                $table->unsignedInteger('usage_limit_per_user')->default(0)->after('usage_limit');
            });
        }
    }

    public function down(): void
    {
        Schema::table('vouchers', function (Blueprint $table): void {
            $table->dropColumn('usage_limit_per_user');
        });
    }
};
