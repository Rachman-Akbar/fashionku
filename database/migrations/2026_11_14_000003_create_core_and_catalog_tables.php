<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Fashionku adalah single-store: profil toko disimpan sebagai key-value di
 * `app_settings`, bukan tabel `stores` terpisah.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('group', 50)->default('general')->index();
            $table->string('key', 120)->unique();
            $table->text('value')->nullable();
            $table->string('type', 20)->default('string');
            $table->timestamps();
        });

        Schema::create('addresses', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete();
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
            $table->string('origin_destination_id', 50)->nullable();
            $table->decimal('store_latitude', 10, 8);
            $table->decimal('store_longitude', 11, 8);
            $table->decimal('free_shipping_max_distance', 8, 2)->default(0);
            $table->decimal('default_flat_rate', 15, 2)->default(0);
            $table->decimal('rate_per_km', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('seller_customers', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('note')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->unsignedBigInteger('parent_scope_id')->default(0);
            $table->unsignedTinyInteger('level')->default(1);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_visible_in_menu')->default(true)->index();
            $table->string('name');
            $table->string('slug');
            $table->string('full_slug')->unique();
            $table->string('image_url')->nullable();
            $table->string('icon_url')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['parent_scope_id', 'name'], 'categories_parent_name_unique');
            $table->index(['parent_id', 'sort_order'], 'categories_parent_id_sort_order_index');
            $table->index(['is_active', 'is_visible_in_menu', 'deleted_at'], 'categories_menu_status_index');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE categories ADD CONSTRAINT categories_level_media_check CHECK ((level = 3) OR (image_url IS NULL AND icon_url IS NULL))');
        }

        Schema::create('product_attributes', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('type', 50)->default('select');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('primary_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('brand', 100)->nullable()->index();
            $table->string('thumbnail')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('allows_preorder')->default(true);
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['status', 'is_active', 'deleted_at'], 'products_public_feed_index');
            $table->index(['primary_category_id', 'status', 'is_active'], 'products_category_status_index');
            $table->index(['status', 'is_active', 'created_at', 'id'], 'products_public_feed_idx');
            $table->index(['primary_category_id', 'status', 'is_active', 'created_at', 'id'], 'products_category_feed_idx');
            $table->index(['name', 'id'], 'products_admin_name_sort_idx');
        });

        Schema::create('product_categories', function (Blueprint $table): void {
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false)->index();
            $table->timestamps();
            $table->primary(['product_id', 'category_id']);
            $table->index(['category_id', 'product_id']);
        });

        Schema::create('product_attribute_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('attribute_id')->constrained('product_attributes')->cascadeOnDelete();
            $table->text('value');
            $table->timestamps();
            $table->unique(['product_id', 'attribute_id']);
        });

        Schema::create('product_variants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('sku', 100)->unique();
            $table->string('name');
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('price_original', 15, 2)->nullable();
            $table->decimal('price_sale', 15, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('po_stock')->default(0);
            $table->unsignedInteger('stock_reserved')->default(0);
            $table->unsignedInteger('stock_booked')->default(0);
            $table->unsignedInteger('stock_preorder')->default(0);
            $table->unsignedInteger('max_order_qty')->default(999999);
            $table->unsignedInteger('min_stock')->default(0);
            $table->boolean('is_default')->default(false)->index();
            $table->timestamps();
            $table->unique(['product_id', 'name'], 'product_variants_product_name_unique');
            $table->index(['product_id', 'is_default']);
            $table->index(['product_id', 'is_default', 'id'], 'product_variants_summary_idx');
            $table->index(['sku'], 'product_variants_sku_search_idx');
            $table->index(['product_id', 'is_default', 'price', 'id'], 'product_variants_price_filter_idx');
            $table->index(['product_id', 'is_default', 'stock', 'id'], 'product_variants_stock_filter_idx');
            $table->index(['product_id', 'stock'], 'product_variants_stock_index');
            $table->index(['price_sale', 'is_default'], 'product_variants_sale_default_idx');
        });

        Schema::create('product_variant_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('attribute_id')->constrained('product_attributes')->cascadeOnDelete();
            $table->string('value');
            $table->timestamps();
            $table->unique(['variant_id', 'attribute_id']);
        });

        Schema::create('product_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('url');
            $table->string('alt_text')->nullable();
            $table->boolean('is_primary')->default(false)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['product_id', 'is_primary', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variant_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('seller_customers');
        Schema::dropIfExists('shipping_settings');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('app_settings');
    }
};
