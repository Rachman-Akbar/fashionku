<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_challenges');
    }
};