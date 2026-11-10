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
        Schema::create('banners', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('image_url');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['store_id', 'name'], 'banners_store_name_unique');
            $table->index(['store_id', 'is_active', 'sort_order', 'deleted_at'], 'banners_public_index');
        });

        Schema::create('promotions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->string('name', 150)->unique();
            $table->string('image_url');
            $table->string('mobile_image_url')->nullable();
            $table->enum('click_action', ['none', 'product', 'category', 'url'])->default('none');
            $table->unsignedBigInteger('target_id')->nullable()->index();
            $table->string('target_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('submitted_at')->nullable()->index();
            $table->timestamp('approved_at')->nullable()->index();
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['approval_status', 'is_active', 'sort_order', 'deleted_at'], 'promotions_public_index');
            $table->index(['store_id', 'approval_status', 'deleted_at'], 'promotions_store_index');
        });

        Schema::create('vouchers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->enum('voucher_scope', ['platform', 'store'])->default('platform')->index();
            $table->string('code', 50)->unique();
            $table->string('name', 100)->unique();
            $table->string('image')->nullable();
            $table->enum('discount_target', ['product', 'shipping'])->default('product')->index();
            $table->enum('discount_type', ['fixed', 'percentage']);
            $table->decimal('discount_value', 15, 2);
            $table->decimal('min_spend', 15, 2)->default(0);
            $table->decimal('max_discount', 15, 2)->nullable();
            $table->timestamp('starts_at')->index();
            $table->timestamp('ends_at')->index();
            $table->unsignedInteger('usage_limit')->default(0);
            $table->unsignedInteger('used_count')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['voucher_scope', 'store_id', 'is_active', 'deleted_at'], 'vouchers_scope_index');
            $table->index(['is_active', 'starts_at', 'ends_at', 'deleted_at'], 'vouchers_period_index');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE vouchers ADD CONSTRAINT vouchers_scope_store_check CHECK ((voucher_scope = 'platform' AND store_id IS NULL) OR (voucher_scope = 'store' AND store_id IS NOT NULL))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('banners');
    }
};
