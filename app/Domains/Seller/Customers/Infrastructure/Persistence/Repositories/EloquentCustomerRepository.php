<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Customers\Domain\Repositories\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class EloquentCustomerRepository implements CustomerRepositoryInterface
{
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        $candidateIds = DB::table('orders')
            ->select('orders.user_id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->whereNotNull('orders.user_id')
            ->union(
                DB::table('seller_customers')->select('user_id')
            );

        $summary = DB::table('orders')
            ->join('sub_orders', 'sub_orders.order_id', '=', 'orders.id')
            ->selectRaw('orders.user_id, COUNT(DISTINCT orders.id) as orders_count, SUM(sub_orders.total_items_price + sub_orders.shipping_cost) as total_spent, MAX(orders.created_at) as last_order_at')
            ->joinSub($candidateIds, 'store_customer_ids', fn ($join) => $join->on('store_customer_ids.user_id', '=', 'orders.user_id'))
            ->whereNotIn('orders.status', ['cancelled'])
            ->groupBy('orders.user_id');

        $manualExists = 'EXISTS (SELECT 1 FROM seller_customers sc WHERE sc.user_id = users.id)';

        $primaryAddress = DB::table('addresses as address_pick')
            ->select('address_pick.user_id', 'address_pick.id as address_id')
            ->whereNotNull('address_pick.user_id')
            ->whereRaw('address_pick.id = (SELECT address_fallback.id FROM addresses address_fallback WHERE address_fallback.user_id = address_pick.user_id ORDER BY address_fallback.is_primary DESC, address_fallback.id ASC LIMIT 1)');

        $addressColumns = [
            'buyer_address.full_address',
            'buyer_address.subdistrict',
            'buyer_address.district',
            'buyer_address.city_or_regency',
            'buyer_address.province',
            'buyer_address.postal_code',
        ];

        $buyerAddress = DB::table('addresses as buyer_address')
            ->joinSub($primaryAddress, 'chosen_address', fn ($join) => $join->on('chosen_address.address_id', '=', 'buyer_address.id'))
            ->select(
                'buyer_address.user_id as buyer_user_id',
                'buyer_address.recipient_name as buyer_recipient',
                'buyer_address.phone_number as buyer_phone',
                DB::raw($this->addressTextExpression($addressColumns).' as buyer_address_text'),
            );

        return User::query()
            ->joinSub($candidateIds, 'store_customer_ids', fn ($join) => $join->on('store_customer_ids.user_id', '=', 'users.id'))
            ->leftJoinSub($summary, 'customer_summary', fn ($join) => $join->on('customer_summary.user_id', '=', 'users.id'))
            ->leftJoinSub($buyerAddress, 'buyer_address_sub', fn ($join) => $join->on('buyer_address_sub.buyer_user_id', '=', 'users.id'))
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.avatar',
                'users.is_active',
                'users.created_at',
                'customer_summary.orders_count',
                'customer_summary.total_spent',
                'customer_summary.last_order_at',
                'buyer_address_sub.buyer_recipient as primary_recipient',
                'buyer_address_sub.buyer_phone as primary_phone',
                'buyer_address_sub.buyer_address_text as primary_address',
                DB::raw("(CASE WHEN {$manualExists} THEN 1 ELSE 0 END) as is_manual"),
            ])
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(fn (Builder $query) => $query->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
            })
            ->when(! empty($filters['min_orders']), fn (Builder $query) => $query->where('customer_summary.orders_count', '>=', (int) $filters['min_orders']))
            ->orderByDesc('customer_summary.last_order_at')
            ->orderByDesc('users.created_at')
            ->paginate($perPage);
    }

    /**
     * Ekspresi SQL portabel untuk menggabungkan komponen alamat dengan
     * pemisah ", ". MySQL memakai CONCAT_WS (melewati NULL), SQLite tidak
     * memiliki fungsi tersebut sehingga dibangun manual.
     *
     * @param  array<int, string>  $columns
     */
    private function addressTextExpression(array $columns): string
    {
        if (DB::getDriverName() === 'sqlite') {
            $parts = array_map(
                fn (string $column): string => "CASE WHEN NULLIF(TRIM(COALESCE({$column}, '')), '') IS NOT NULL THEN ', ' || {$column} ELSE '' END",
                $columns,
            );

            return "LTRIM(".implode(' || ', $parts).", ', ')";
        }

        return "CONCAT_WS(', ', ".implode(', ', $columns).')';
    }

    public function find(string $userId): ?User
    {
        $hasBuyerHistory = DB::table('orders')
            ->where('user_id', $userId)
            ->exists();

        $isManual = DB::table('seller_customers')
            ->where('user_id', $userId)
            ->exists();

        if (! $hasBuyerHistory && ! $isManual) {
            return null;
        }

        return User::query()->find($userId);
    }

    public function createManual(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            $userId = (string) Str::uuid();
            $actorId = auth()->id();

            $user = new User;
            $user->id = $userId;
            $user->forceFill([
                'email' => Str::lower(trim((string) $data['email'])),
                'password' => null,
                'has_set_password' => false,
                'name' => trim((string) ($data['name'] ?? '')),
                'avatar' => $data['avatar'] ?? null,
                'is_email_verified' => false,
                'is_active' => (bool) ($data['is_active'] ?? true),
                'banned_at' => null,
            ])->save();

            $roleId = DB::table('roles')
                ->where('name', 'buyer')
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->value('id');

            if ($roleId !== null) {
                DB::table('user_roles')->updateOrInsert(
                    ['user_id' => $userId, 'role_id' => $roleId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }

            DB::table('seller_customers')->insert([
                'user_id' => $userId,
                'note' => $data['note'] ?? null,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $user->refresh();
        });
    }

    public function updateProfile(string $userId, array $data): ?User
    {
        $user = $this->find($userId);

        if (! $user) {
            return null;
        }

        $user->forceFill([
            'name' => trim((string) $data['name']),
            'email' => Str::lower(trim((string) $data['email'])),
            'avatar' => $data['avatar'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
        ])->save();

        if (array_key_exists('note', $data)) {
            DB::table('seller_customers')
                ->where('user_id', $user->id)
                ->update(['note' => $data['note'], 'updated_by' => auth()->id(), 'updated_at' => now()]);
        }

        return $user->refresh();
    }

    public function deleteCustomer(string $userId): bool
    {
        $user = $this->find($userId);

        if (! $user) {
            return false;
        }

        return DB::transaction(function () use ($user): bool {
            $user->tokens()->delete();

            DB::table('seller_customers')
                ->where('user_id', $user->id)
                ->delete();

            return (bool) $user->delete();
        });
    }
}
