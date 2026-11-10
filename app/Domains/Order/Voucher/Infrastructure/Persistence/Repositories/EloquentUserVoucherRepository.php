<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Voucher\Domain\Entities\UserVoucher;
use App\Domains\Order\Voucher\Domain\Repositories\UserVoucherRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class EloquentUserVoucherRepository implements UserVoucherRepositoryInterface
{
    private const VOUCHER_FIELDS = 'id,code,name,image,voucher_scope,discount_target,discount_type,discount_value,min_spend,min_items,min_distinct_products,terms,max_discount,starts_at,ends_at,usage_limit,used_count,is_active,created_at,store_id';

    private function baseQuery()
    {
        return UserVoucher::query()
            ->with('voucher:'.self::VOUCHER_FIELDS, 'voucher.store:id,name');
    }

    public function forUser(string $userId): Collection
    {
        return $this->baseQuery()
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->get();
    }

    public function paginateForUser(string $userId, int $perPage): LengthAwarePaginator
    {
        return $this->baseQuery()
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->paginate(max(1, $perPage));
    }

    public function markClaimed(string $userId, int $id): ?UserVoucher
    {
        $row = UserVoucher::query()
            ->where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (! $row) {
            return null;
        }

        if ($row->status !== 'used') {
            $row->forceFill([
                'status' => 'claimed',
                'claimed_at' => now(),
                'used_at' => null,
            ])->save();
        }

        return $row->refresh()->load('voucher:'.self::VOUCHER_FIELDS, 'voucher.store:id,name');
    }
}
