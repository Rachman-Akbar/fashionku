<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\UseCases;

use App\Domains\Order\Voucher\Domain\Entities\UserVoucher;
use App\Domains\Order\Voucher\Domain\Repositories\UserVoucherRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;

final class UserVoucherUseCase
{
    public function __construct(private UserVoucherRepositoryInterface $repository) {}

    public function listForUser(string $userId): Collection
    {
        return $this->repository->forUser($userId);
    }

    public function paginateForUser(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginateForUser($userId, $perPage);
    }

    public function claim(string $userId, int $userVoucherId): UserVoucher
    {
        $voucher = $this->repository->markClaimed($userId, $userVoucherId);

        if (! $voucher) {
            throw new ModelNotFoundException('Voucher tidak ditemukan.');
        }

        return $voucher;
    }
}
