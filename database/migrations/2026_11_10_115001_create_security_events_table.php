<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
            $table->softDeletes()->index();

            $table->index(['user_id', 'event_type', 'occurred_at'], 'security_events_user_event_time_index');
            $table->index(['email', 'event_type', 'occurred_at'], 'security_events_email_event_time_index');
            $table->index(['purpose', 'occurred_at'], 'security_events_purpose_time_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_events');
    }
};