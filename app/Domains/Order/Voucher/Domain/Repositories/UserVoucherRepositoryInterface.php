<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Domain\Repositories;

use App\Domains\Order\Voucher\Domain\Entities\UserVoucher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserVoucherRepositoryInterface
{
    public function forUser(string $userId): Collection;

    public function paginateForUser(string $userId, int $perPage): LengthAwarePaginator;

    public function markClaimed(string $userId, int $id): ?UserVoucher;
}
