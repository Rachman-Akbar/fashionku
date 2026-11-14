<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('payment_number', 100)->unique();
            $table->string('package_name', 120);
            $table->decimal('amount', 15, 2);
            $table->string('payment_method', 100)->nullable();
            $table->string('proof_url')->nullable();
            $table->string('status', 30)->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('paid_at')->nullable()->index();
            $table->timestamp('reviewed_at')->nullable()->index();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['status', 'deleted_at'], 'promotion_payments_status_deleted_index');
        });

        Schema::create('promotions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('promotion_payment_id')->nullable()->constrained('promotion_payments')->nullOnDelete();
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
            $table->index(['promotion_payment_id', 'approval_status'], 'promotions_payment_approval_index');
        });

        Schema::create('vouchers', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 100)->unique();
            $table->string('image')->nullable();
            $table->enum('discount_target', ['product', 'shipping'])->default('product')->index();
            $table->enum('discount_type', ['fixed', 'percentage']);
            $table->decimal('discount_value', 15, 2);
            $table->decimal('min_spend', 15, 2)->default(0);
            $table->unsignedInteger('min_items')->nullable();
            $table->unsignedInteger('min_distinct_products')->nullable();
            $table->text('terms')->nullable();
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
            $table->index(['is_active', 'starts_at', 'ends_at', 'deleted_at'], 'vouchers_period_index');
        });

        Schema::create('user_vouchers', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('voucher_id')->constrained('vouchers')->cascadeOnDelete();
            $table->string('source_type', 80)->nullable()->index();
            $table->string('source_id', 100)->nullable();
            $table->string('status', 30)->default('available')->index();
            $table->timestamp('claimed_at')->useCurrent();
            $table->timestamp('used_at')->nullable()->index();
            $table->timestamps();
            $table->unique(['user_id', 'voucher_id', 'source_type', 'source_id'], 'user_vouchers_source_unique');
            $table->index(['user_id', 'status'], 'user_vouchers_user_status_index');
        });

        Schema::create('schedules', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('type', 50)->index();
            $table->string('status', 20)->default('todo')->index();
            $table->unsignedInteger('position')->default(0);
            $table->string('assignee', 120)->nullable();
            $table->string('label', 80)->nullable();
            $table->string('priority', 20)->default('normal')->index();
            $table->string('color', 20)->default('#10B981');
            $table->date('date')->index();
            $table->unsignedInteger('capacity')->default(1);
            $table->string('recurrence', 20)->default('none')->index();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_all_day')->default(false);
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->json('completion_proof')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['user_id', 'date', 'is_active'], 'schedules_user_date_index');
            $table->index(['user_id', 'is_completed', 'date'], 'schedules_user_completed_date_index');
            $table->index(['date', 'capacity'], 'schedules_date_capacity_index');
        });

        Schema::create('code_patterns', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 40);
            $table->string('pattern', 120);
            $table->timestamps();
            $table->index(['type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_patterns');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('user_vouchers');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('promotion_payments');
    }
};
