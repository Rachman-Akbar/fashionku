<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_fee_configs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name', 120);
            $table->string('code', 80)->unique();
            $table->decimal('percentage', 5, 2)->default(0);
            $table->decimal('fixed_amount', 15, 2)->default(0);
            $table->decimal('min_fee', 15, 2)->default(0);
            $table->decimal('max_fee', 15, 2)->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->text('description')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['category_id', 'is_active'], 'admin_fee_configs_category_active_index');
        });

        Schema::create('seller_settlements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('sub_order_id')->nullable()->constrained('sub_orders')->nullOnDelete();
            $table->string('settlement_number', 100)->unique();
            $table->decimal('gross_amount', 15, 2);
            $table->decimal('admin_fee', 15, 2)->default(0);
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2);
            $table->string('status', 30)->default('pending')->index();
            $table->timestamp('settled_at')->nullable()->index();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['store_id', 'status', 'settled_at'], 'seller_settlements_store_status_index');
        });

        Schema::create('seller_withdrawals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('withdrawal_number', 100)->unique();
            $table->decimal('amount', 15, 2);
            $table->string('method', 50)->index();
            $table->json('bank_details')->nullable();
            $table->string('status', 30)->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('processed_at')->nullable()->index();
            $table->foreignUuid('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['store_id', 'status', 'created_at'], 'seller_withdrawals_store_status_index');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->decimal('admin_fee', 15, 2)->default(0)->after('shipping_discount_amount');
            $table->decimal('seller_net', 15, 2)->default(0)->after('admin_fee');
        });

        Schema::table('sub_orders', function (Blueprint $table): void {
            $table->decimal('admin_fee', 15, 2)->default(0)->after('shipping_cost');
            $table->decimal('seller_net', 15, 2)->default(0)->after('admin_fee');
        });
    }

    public function down(): void
    {
        Schema::table('sub_orders', function (Blueprint $table): void {
            $table->dropColumn(['admin_fee', 'seller_net']);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn(['admin_fee', 'seller_net']);
        });

        Schema::dropIfExists('seller_withdrawals');
        Schema::dropIfExists('seller_settlements');
        Schema::dropIfExists('admin_fee_configs');
    }
};
