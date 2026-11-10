<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_devices', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('device_name', 255)->nullable();
            $table->string('device_type', 50)->nullable()->index();
            $table->string('browser', 100)->nullable();
            $table->string('browser_version', 50)->nullable();
            $table->string('os', 100)->nullable();
            $table->string('os_version', 50)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('sanctum_token_id')->nullable()->unique()->index();
            $table->string('sanctum_token_name')->nullable();
            $table->timestamp('last_active_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->enum('status', ['active', 'inactive', 'revoked', 'expired'])->default('active')->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();

            $table->index(['user_id', 'status'], 'user_devices_user_status_index');
            $table->index(['user_id', 'last_active_at'], 'user_devices_user_last_active_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_devices');
    }
};