<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // First add the column as nullable
        Schema::table('seller_customers', function (Blueprint $table): void {
            if (! Schema::hasColumn('seller_customers', 'code')) {
                $table->string('code', 100)->nullable()->after('user_id');
            }
        });

        // Populate code for existing records
        $customers = DB::table('seller_customers')
            ->whereNull('code')
            ->orWhere('code', '')
            ->get(['id', 'user_id']);

        foreach ($customers as $customer) {
            $user = DB::table('users')->where('id', $customer->user_id)->first(['name']);
            $baseCode = 'CUST';
            if ($user && $user->name) {
                $words = explode(' ', Str::upper(trim($user->name)));
                $baseCode = implode('', array_map(fn ($w) => $w[0], $words));
                $baseCode = preg_replace('/[^A-Z0-9]/', '', $baseCode) ?: 'CUST';
            }
            
            // Find a unique code
            $sequence = 1;
            while (true) {
                $code = $baseCode . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
                $exists = DB::table('seller_customers')->where('code', $code)->exists();
                if (! $exists) {
                    break;
                }
                $sequence++;
            }
            
            DB::table('seller_customers')->where('id', $customer->id)->update(['code' => $code]);
        }

        // Now make the column non-nullable and unique
        Schema::table('seller_customers', function (Blueprint $table): void {
            $table->string('code', 100)->unique()->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('seller_customers', function (Blueprint $table): void {
            if (Schema::hasColumn('seller_customers', 'code')) {
                $table->dropUnique(['code']);
                $table->dropColumn('code');
            }
        });
    }
};