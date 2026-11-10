<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->index(['is_active', 'deleted_at'], 'catalog_groups_status_index');
        });

        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('catalog_group_id')->constrained('catalog_groups')->cascadeOnDelete();
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
            $table->unique(['catalog_group_id', 'parent_scope_id', 'name'], 'categories_parent_name_unique');
            $table->index(['catalog_group_id', 'parent_id', 'sort_order']);
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
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('primary_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('brand', 100)->nullable()->index();
            $table->string('thumbnail')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes()->index();
            $table->unique(['store_id', 'name'], 'products_store_name_unique');
            $table->index(['store_id', 'status', 'is_active', 'deleted_at'], 'products_public_feed_index');
            $table->index(['primary_category_id', 'status', 'is_active'], 'products_category_status_index');
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
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('sku', 100);
            $table->string('name');
            $table->decimal('price', 15, 2)->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_default')->default(false)->index();
            $table->timestamps();
            $table->unique(['store_id', 'sku'], 'product_variants_store_sku_unique');
            $table->unique(['product_id', 'name'], 'product_variants_product_name_unique');
            $table->index(['product_id', 'is_default']);
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
        Schema::dropIfExists('catalog_groups');
    }
};
