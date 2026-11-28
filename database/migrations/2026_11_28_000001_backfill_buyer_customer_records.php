<?php

declare(strict_types=1);

use App\Domains\Seller\Customers\Application\Services\CustomerCodeGenerator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Menyelaraskan data pelanggan dengan user:
 *
 * - Setiap user ber-role Buyer mempunyai tepat satu baris `seller_customers`.
 * - Baris yang sudah ada tidak pernah disentuh (index unik `user_id`
 *   menjamin 1 user = 1 pelanggan).
 *
 * Backfill bersifat idempoten sehingga aman dijalankan ulang.
 */
return new class extends Migration
{
    public function up(): void
    {
        $buyerRoleIds = DB::table('roles')
            ->where('name', 'buyer')
            ->whereNull('deleted_at')
            ->pluck('id');

        if ($buyerRoleIds->isEmpty()) {
            return;
        }

        $missingBuyers = DB::table('users')
            ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
            ->leftJoin('seller_customers', 'seller_customers.user_id', '=', 'users.id')
            ->whereNull('users.deleted_at')
            ->whereIn('user_roles.role_id', $buyerRoleIds)
            ->whereNull('seller_customers.user_id')
            ->get(['users.id', 'users.name']);

        if ($missingBuyers->isEmpty()) {
            return;
        }

        $codes = new CustomerCodeGenerator;
        $now = now();

        foreach ($missingBuyers as $buyer) {
            DB::table('seller_customers')->insert([
                'user_id' => $buyer->id,
                'code' => $codes->generate((string) $buyer->name),
                'note' => null,
                'created_by' => null,
                'updated_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // Data hasil backfill tidak dihapus agar riwayat pelanggan tetap utuh.
    }
};
