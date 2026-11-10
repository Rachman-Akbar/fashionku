<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Order\Voucher\Domain\Repositories\VoucherRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class EloquentVoucherRepository implements VoucherRepositoryInterface
{
    public function getAll(array $filters = []): Collection
    {
        $includeInactive = (bool) ($filters['include_inactive'] ?? false);
        $storeIds = array_values(array_unique(array_map('intval', (array) ($filters['store_ids'] ?? []))));
        $limit = max(1, min(100, (int) ($filters['limit'] ?? 100)));

        return Voucher::query()
            ->with('store:id,name,status,is_active')
            ->when(! $includeInactive, function (Builder $query): void {
                $query->where(function (Builder $visibilityQuery): void {
                    $visibilityQuery->where(function (Builder $platformQuery): void {
                        $platformQuery->where('voucher_scope', 'platform')->whereNull('store_id');
                    })->orWhere(function (Builder $storeVoucherQuery): void {
                        $storeVoucherQuery->where('voucher_scope', 'store')
                            ->whereNotNull('store_id')
                            ->whereHas('store', fn (Builder $storeQuery) => $storeQuery->publiclyAvailable());
                    });
                });
            })
            ->when(! $includeInactive && ! array_key_exists('is_active', $filters), fn (Builder $query) => $query->active())
            ->when(array_key_exists('is_active', $filters), fn (Builder $query) => $query->where('is_active', (bool) $filters['is_active']))
            ->when(isset($filters['voucher_scope']) && $filters['voucher_scope'] !== '', fn (Builder $query) => $query->where('voucher_scope', $filters['voucher_scope']))
            ->when(isset($filters['store_id']), fn (Builder $query) => $query->where('store_id', (int) $filters['store_id']))
            ->when($storeIds !== [], function (Builder $query) use ($storeIds): void {
                $query->where(function (Builder $scopeQuery) use ($storeIds): void {
                    $scopeQuery->where('voucher_scope', 'platform')
                        ->orWhere(function (Builder $storeQuery) use ($storeIds): void {
                            $storeQuery->where('voucher_scope', 'store')->whereIn('store_id', $storeIds);
                        });
                });
            })
            ->when((bool) ($filters['active_now'] ?? false), function (Builder $query): void {
                $query->active()
                    ->where('starts_at', '<=', now())
                    ->where('ends_at', '>=', now())
                    ->where(function (Builder $usageQuery): void {
                        $usageQuery->where('usage_limit', 0)->orWhereColumn('used_count', '<', 'usage_limit');
                    });
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function findById(int $id, bool $includeInactive = true): ?Voucher
    {
        return Voucher::query()
            ->with('store:id,name,status,is_active')
            ->when(! $includeInactive, fn (Builder $query) => $query->active())
            ->find($id);
    }

    public function findByCode(string $code, bool $includeInactive = false): ?Voucher
    {
        return Voucher::query()
            ->with('store:id,name,status,is_active')
            ->when(! $includeInactive, fn (Builder $query) => $query->active())
            ->where('code', Str::lower(trim($code)))
            ->first();
    }

    public function codeExists(string $code, ?int $ignoreId = null): bool
    {
        return Voucher::withTrashed()
            ->where('code', Str::lower(trim($code)))
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        return Voucher::withTrashed()
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function save(Voucher $voucher): Voucher
    {
        $voucher->save();

        return $voucher->refresh()->load('store:id,name,status,is_active');
    }

    public function delete(Voucher $voucher): bool
    {
        return (bool) $voucher->delete();
    }
}
