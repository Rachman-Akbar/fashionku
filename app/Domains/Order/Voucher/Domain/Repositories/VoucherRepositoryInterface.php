<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Domain\Repositories;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use Illuminate\Support\Collection;

interface VoucherRepositoryInterface
{
    public function getAll(array $filters = []): Collection;

    public function findById(int $id, bool $includeInactive = true): ?Voucher;

    public function findByCode(string $code, bool $includeInactive = false): ?Voucher;

    public function codeExists(string $code, ?int $ignoreId = null): bool;

    public function nameExists(string $name, ?int $ignoreId = null): bool;

    public function save(Voucher $voucher): Voucher;

    public function delete(Voucher $voucher): bool;
}
