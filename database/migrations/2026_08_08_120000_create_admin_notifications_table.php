<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('stores')->nullOnDelete();
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
    }
};
