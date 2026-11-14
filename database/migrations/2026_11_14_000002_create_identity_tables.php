<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('firebase_uid')->nullable()->unique();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->boolean('has_set_password')->default(false);
            $table->string('name')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('is_email_verified')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('banned_at')->nullable()->index();
            $table->rememberToken();
            $table->uuid('created_by')->nullable()->index();
            $table->uuid('updated_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['is_active', 'banned_at', 'deleted_at'], 'users_access_status_index');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('roles', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['is_active', 'deleted_at'], 'roles_status_index');
        });

        Schema::create('permissions', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table): void {
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['user_id', 'role_id']);
            $table->index(['role_id', 'user_id']);
        });

        Schema::create('role_permissions', function (Blueprint $table): void {
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['role_id', 'permission_id']);
            $table->index(['permission_id', 'role_id']);
        });

        Schema::create('otp_challenges', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('email')->index();
            $table->string('phone')->nullable()->index();
            $table->string('purpose', 50)->index();
            $table->string('code_hash', 255);
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->unsignedSmallInteger('max_attempts')->default(5);
            $table->timestamp('expires_at')->index();
            $table->timestamp('consumed_at')->nullable();
            $table->string('challenge_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['email', 'purpose', 'consumed_at'], 'otp_challenges_email_purpose_consumed_index');
            $table->index(['user_id', 'purpose', 'consumed_at'], 'otp_challenges_user_purpose_consumed_index');
            $table->index(['challenge_id', 'purpose'], 'otp_challenges_challenge_purpose_index');
        });

        Schema::create('registration_challenges', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('email')->unique()->index();
            $table->string('name');
            $table->string('password_hash', 255);
            $table->string('phone')->nullable();
            $table->string('firebase_uid')->nullable()->index();
            $table->string('avatar')->nullable();
            $table->string('otp_challenge_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('expires_at')->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['email', 'expires_at'], 'registration_challenges_email_expires_index');
        });

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

        Schema::create('security_events', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('event_type', 100)->index();
            $table->string('purpose', 50)->nullable()->index();
            $table->enum('severity', ['info', 'warning', 'critical'])->default('info')->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('success')->default(true);
            $table->text('failure_reason')->nullable();
            $table->timestamp('occurred_at')->useCurrent()->index();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['user_id', 'event_type', 'occurred_at'], 'security_events_user_event_time_index');
            $table->index(['email', 'event_type', 'occurred_at'], 'security_events_email_event_time_index');
            $table->index(['purpose', 'occurred_at'], 'security_events_purpose_time_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_events');
        Schema::dropIfExists('user_devices');
        Schema::dropIfExists('registration_challenges');
        Schema::dropIfExists('otp_challenges');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::table('users', function (Blueprint $table): void {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });
        Schema::dropIfExists('users');
    }
};
