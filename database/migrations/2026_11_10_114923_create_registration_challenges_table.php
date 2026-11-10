<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_challenges');
    }
};