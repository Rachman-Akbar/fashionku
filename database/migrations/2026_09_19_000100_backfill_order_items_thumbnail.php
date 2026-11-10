<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('
            UPDATE order_items
            SET thumbnail = (
                SELECT products.thumbnail
                FROM products
                WHERE products.id = order_items.product_id
            )
            WHERE thumbnail IS NULL
              AND EXISTS (
                SELECT 1
                FROM products
                WHERE products.id = order_items.product_id
                  AND products.thumbnail IS NOT NULL
            )
        ');
    }

    public function down(): void
    {
        // Data backfill cannot be reversed safely.
    }
};
