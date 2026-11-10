<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Domain\Services;

use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;

/**
 * Fashionku beroperasi sebagai single-store marketplace.
 * Seluruh kebutuhan "resolve toko seller" menggunakan satu toko utama.
 */
final class FashionStoreResolver
{
    public static function resolve(): ?StoreModel
    {
        return StoreModel::query()
            ->whereNull('deleted_at')
            ->orderByDesc('is_active')
            ->orderBy('id')
            ->first();
    }

    public static function resolveId(): ?int
    {
        $id = StoreModel::query()
            ->whereNull('deleted_at')
            ->orderByDesc('is_active')
            ->orderBy('id')
            ->value('id');

        return $id !== null ? (int) $id : null;
    }
}
