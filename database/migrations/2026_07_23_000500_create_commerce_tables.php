<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('cart_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
            $table->unique(['cart_id', 'product_variant_id']);
        });

        Schema::create('wishlists', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 100)->default('utama');
            $table->timestamps();
            $table->unique(['user_id', 'name']);
        });

        Schema::create('wishlist_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('wishlist_id')->constrained('wishlists')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->timestamp('added_at')->useCurrent();
            $table->unique(['wishlist_id', 'product_id']);
        });

        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number', 100)->unique();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('voucher_id')->nullable()->constrained('vouchers')->nullOnDelete();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('shipping_discount_amount', 15, 2)->default(0);
            $table->string('status', 50)->default('pending')->index();
            $table->string('payment_status', 50)->default('unpaid')->index();
            $table->string('payment_method', 100)->nullable();
            $table->string('midtrans_snap_token')->nullable();
            $table->text('shipping_address');
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });

        Schema::create('sub_orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->restrictOnDelete();
            $table->string('sub_order_number', 100)->unique();
            $table->decimal('total_items_price', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->string('courier', 50)->nullable();
            $table->string('service', 100)->nullable();
            $table->string('destination_id', 50);
            $table->string('status', 50)->default('pending')->index();
            $table->string('tracking_number')->nullable();
            $table->timestamps();
            $table->index(['store_id', 'status', 'created_at']);
        });

        Schema::create('order_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('sub_order_id')->constrained('sub_orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_name');
            $table->string('sku', 100);
            $table->decimal('price', 15, 2);
            $table->unsignedInteger('quantity');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number', 100);
            $table->string('transaction_id')->nullable()->unique();
            $table->string('payment_method', 100);
            $table->decimal('amount', 15, 2);
            $table->string('status', 50)->default('pending')->index();
            $table->longText('payload')->nullable();
            $table->timestamps();
            $table->foreign('order_number')->references('order_number')->on('orders')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('sub_orders');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('wishlist_items');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
    }
};
