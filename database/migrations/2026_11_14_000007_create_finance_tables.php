<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Keuangan internal toko tunggal. `store_id` dihapus; seluruh transaksi
 * dimiliki oleh toko (admin) yang sama.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reference_number', 100)->unique();
            $table->string('type', 30)->index();
            $table->string('category', 40)->nullable()->index();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->string('status', 30)->default('open')->index();
            $table->date('due_date')->nullable()->index();
            $table->timestamp('occurred_at')->index();
            $table->timestamp('settled_at')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->json('metadata')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['type', 'status', 'occurred_at'], 'financial_transactions_report_index');
            $table->index(['type', 'due_date', 'status'], 'financial_transactions_aging_index');
        });

        Schema::create('financial_payment_histories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('financial_transaction_id')->constrained('financial_transactions')->cascadeOnDelete();
            $table->foreignUuid('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('balance_before', 15, 2);
            $table->decimal('balance_after', 15, 2);
            $table->string('payment_method', 50)->default('manual');
            $table->string('reference_number', 100)->nullable()->index();
            $table->text('notes')->nullable();
            $table->timestamp('paid_at');
            $table->timestamps();
            $table->index(['financial_transaction_id', 'paid_at'], 'fph_txn_paid_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_payment_histories');
        Schema::dropIfExists('financial_transactions');
    }
};
