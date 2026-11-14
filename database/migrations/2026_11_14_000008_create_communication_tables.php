<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Chat, tiket bantuan, dan notifikasi admin. `store_id` dihapus karena seluruh
 * percakapan/notifikasi berada pada satu toko.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 30)->default('direct')->index();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('subject', 180)->nullable();
            $table->string('target_role', 30)->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['order_id', 'type'], 'conversations_context_index');
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

        Schema::create('support_tickets', function (Blueprint $table): void {
            $table->id();
            $table->string('ticket_number', 100)->unique();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
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

        Schema::create('admin_notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('module', 80)->index();
            $table->string('type', 100)->index();
            $table->string('title', 180);
            $table->text('message')->nullable();
            $table->string('reference_type', 100)->nullable();
            $table->string('reference_id', 100)->nullable();
            $table->string('url')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('read_at')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['user_id', 'read_at', 'created_at'], 'admin_notifications_user_unread_index');
            $table->index(['user_id', 'module', 'read_at'], 'admin_notifications_module_unread_index');
            $table->index(['reference_type', 'reference_id'], 'admin_notifications_reference_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
        Schema::dropIfExists('support_ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('chat_message_reads');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
    }
};
