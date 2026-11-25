<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Promosi tidak lagi berbayar: tabel promotion_payments dan relasinya dihapus.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('promotions', 'promotion_payment_id')) {
            foreach (Schema::getForeignKeys('promotions') as $foreignKey) {
                if (in_array('promotion_payment_id', $foreignKey['columns'], true)) {
                    Schema::table('promotions', function (Blueprint $table): void {
                        $table->dropForeign(['promotion_payment_id']);
                    });

                    break;
                }
            }

            foreach (Schema::getIndexes('promotions') as $index) {
                if (($index['primary'] ?? false) || empty(array_intersect($index['columns'], ['promotion_payment_id']))) {
                    continue;
                }

                Schema::table('promotions', function (Blueprint $table) use ($index): void {
                    $table->dropIndex($index['name']);
                });
            }

            Schema::table('promotions', function (Blueprint $table): void {
                $table->dropColumn('promotion_payment_id');
            });
        }

        Schema::dropIfExists('promotion_payments');
    }

    public function down(): void
    {
        if (! Schema::hasTable('promotion_payments')) {
            Schema::create('promotion_payments', function (Blueprint $table): void {
                $table->id();
                $table->string('payment_number', 50)->unique();
                $table->string('package_name', 100)->nullable();
                $table->decimal('amount', 15, 2)->default(0);
                $table->string('status', 20)->default('pending');
                $table->text('rejection_reason')->nullable();
                $table->uuid('created_by')->nullable();
                $table->uuid('updated_by')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasColumn('promotions', 'promotion_payment_id')) {
            Schema::table('promotions', function (Blueprint $table): void {
                $table->foreignId('promotion_payment_id')->nullable()->after('id');
            });
        }
    }
};
