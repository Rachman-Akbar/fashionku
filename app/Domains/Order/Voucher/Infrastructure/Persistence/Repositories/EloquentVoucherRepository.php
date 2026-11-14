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
        $limit = max(1, min(100, (int) ($filters['limit'] ?? 100)));

        return Voucher::query()
            ->when(! $includeInactive && ! array_key_exists('is_active', $filters), fn (Builder $query) => $query->active())
            ->when(array_key_exists('is_active', $filters), fn (Builder $query) => $query->where('is_active', (bool) $filters['is_active']))
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
            ->when(! $includeInactive, fn (Builder $query) => $query->active())
            ->find($id);
    }

    public function findByCode(string $code, bool $includeInactive = false): ?Voucher
    {
        return Voucher::query()
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

        return $voucher->refresh();
    }

    public function delete(Voucher $voucher): bool
    {
        return (bool) $voucher->delete();
    }
}
