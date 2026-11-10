<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('order_type', 30)->default('normal')->after('order_number')->index();
            $table->timestamp('preorder_release_at')->nullable()->after('order_type')->index();
            $table->timestamp('booking_expires_at')->nullable()->after('preorder_release_at')->index();
            $table->timestamp('received_at')->nullable()->after('booking_expires_at')->index();
        });

        Schema::create('promotion_payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
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
            $table->index(['store_id', 'status', 'deleted_at'], 'promotion_payments_store_status_index');
        });

        Schema::table('promotions', function (Blueprint $table): void {
            $table->foreignId('promotion_payment_id')->nullable()->after('store_id')->constrained('promotion_payments')->nullOnDelete();
            $table->index(['promotion_payment_id', 'approval_status'], 'promotions_payment_approval_index');
        });

        Schema::create('financial_transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reference_number', 100)->unique();
            $table->string('type', 30)->index();
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
            $table->index(['store_id', 'type', 'status', 'occurred_at'], 'financial_transactions_scope_index');
        });

        Schema::create('stock_movements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->string('movement_key', 120)->nullable();
            $table->string('type', 30)->index();
            $table->integer('quantity_delta');
            $table->unsignedInteger('balance_after');
            $table->string('reference_type', 80)->nullable();
            $table->string('reference_id', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['order_item_id', 'movement_key'], 'stock_movements_order_item_key_unique');
            $table->index(['store_id', 'variant_id', 'occurred_at'], 'stock_movements_scope_index');
        });

        Schema::create('showcases', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name', 120);
            $table->string('slug', 160);
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['store_id', 'slug'], 'showcases_store_slug_unique');
            $table->index(['store_id', 'is_active', 'sort_order'], 'showcases_scope_index');
        });

        Schema::create('showcase_products', function (Blueprint $table): void {
            $table->foreignId('showcase_id')->constrained('showcases')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->primary(['showcase_id', 'product_id']);
            $table->index(['product_id', 'sort_order']);
        });

        Schema::create('support_tickets', function (Blueprint $table): void {
            $table->id();
            $table->string('ticket_number', 100)->unique();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('stores')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('category', 80)->index();
            $table->string('subject', 180);
            $table->text('description');
            $table->string('priority', 30)->default('normal')->index();
            $table->string('status', 30)->default('open')->index();
            $table->foreignUuid('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_replied_at')->nullable()->index();
            $table->timestamp('resolved_at')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['user_id', 'status', 'created_at'], 'support_tickets_user_status_index');
        });

        Schema::create('support_ticket_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_internal')->default(false)->index();
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['ticket_id', 'created_at'], 'support_ticket_messages_ticket_index');
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

        Schema::create('product_reviews', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('order_item_id')->unique()->constrained('order_items')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating')->index();
            $table->text('review')->nullable();
            $table->json('media')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['product_id', 'is_active', 'created_at'], 'product_reviews_product_index');
        });

        Schema::create('conversations', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 30)->default('direct')->index();
            $table->foreignId('store_id')->nullable()->constrained('stores')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('subject', 180)->nullable();
            $table->string('target_role', 30)->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['store_id', 'order_id', 'type'], 'conversations_context_index');
        });

        Schema::create('conversation_participants', function (Blueprint $table): void {
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('last_read_at')->nullable()->index();
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('left_at')->nullable()->index();
            $table->boolean('is_muted')->default(false)->index();
            $table->primary(['conversation_id', 'user_id']);
            $table->index(['user_id', 'left_at'], 'conversation_participants_user_index');
        });

        Schema::create('chat_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignUuid('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('message_type', 30)->default('text')->index();
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->timestamp('edited_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['conversation_id', 'created_at'], 'chat_messages_conversation_index');
        });

        Schema::create('chat_message_reads', function (Blueprint $table): void {
            $table->foreignId('message_id')->constrained('chat_messages')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('read_at')->useCurrent();
            $table->primary(['message_id', 'user_id']);
            $table->index(['user_id', 'read_at'], 'chat_message_reads_user_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_message_reads');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('product_reviews');
        Schema::dropIfExists('user_vouchers');
        Schema::dropIfExists('support_ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('showcase_products');
        Schema::dropIfExists('showcases');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('financial_transactions');

        Schema::table('promotions', function (Blueprint $table): void {
            $table->dropForeign(['promotion_payment_id']);
            $table->dropIndex('promotions_payment_approval_index');
            $table->dropColumn('promotion_payment_id');
        });

        Schema::dropIfExists('promotion_payments');

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['order_type']);
            $table->dropIndex(['preorder_release_at']);
            $table->dropIndex(['booking_expires_at']);
            $table->dropIndex(['received_at']);
            $table->dropColumn(['order_type', 'preorder_release_at', 'booking_expires_at', 'received_at']);
        });
    }
};
