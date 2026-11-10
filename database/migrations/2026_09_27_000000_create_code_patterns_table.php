<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_patterns', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->string('type', 40);
            $table->string('pattern', 120);
            $table->timestamps();

            $table->index(['type', 'store_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_patterns');
    }
};
