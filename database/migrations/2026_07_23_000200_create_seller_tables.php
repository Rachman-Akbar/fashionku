<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('short_description')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 120)->nullable()->index();
            $table->string('city', 80)->nullable()->index();
            $table->string('province', 80)->nullable()->index();
            $table->text('address')->nullable();
            $table->enum('status', ['pending', 'approved', 'suspended'])->default('pending')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->string('logo')->nullable();
            $table->string('banner_url')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['status', 'is_active', 'deleted_at'], 'stores_public_index');
        });

        Schema::create('store_details', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->unique()->constrained('stores')->cascadeOnDelete();
            $table->string('owner_name', 120)->nullable();
            $table->string('owner_phone', 30)->nullable();
            $table->text('description')->nullable();
            $table->text('shipping_policy')->nullable();
            $table->text('return_policy')->nullable();
            $table->string('open_days', 120)->nullable();
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->string('whatsapp_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->string('website_url')->nullable();
            $table->timestamps();
        });

        Schema::create('addresses', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->unique()->constrained('stores')->cascadeOnDelete();
            $table->string('country', 100);
            $table->string('province', 100);
            $table->string('city_or_regency', 100);
            $table->string('district', 100);
            $table->string('subdistrict', 100);
            $table->string('postal_code', 20);
            $table->text('full_address');
            $table->string('notes')->nullable();
            $table->string('label', 100);
            $table->string('recipient_name');
            $table->string('phone_number', 20);
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('komerce_destination_id', 50)->nullable()->index();
            $table->boolean('is_primary')->default(false)->index();
            $table->timestamps();
            $table->index(['user_id', 'is_primary']);
        });

        Schema::create('shipping_settings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->unique()->constrained('stores')->cascadeOnDelete();
            $table->decimal('store_latitude', 10, 8);
            $table->decimal('store_longitude', 11, 8);
            $table->decimal('free_shipping_max_distance', 8, 2)->default(0);
            $table->decimal('default_flat_rate', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_settings');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('store_details');
        Schema::dropIfExists('stores');
    }
};
