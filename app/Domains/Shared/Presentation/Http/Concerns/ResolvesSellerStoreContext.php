<?php

declare(strict_types=1);

namespace App\Domains\Shared\Presentation\Http\Concerns;

use App\Domains\Seller\Stores\Domain\Services\FashionStoreResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

trait ResolvesSellerStoreContext
{
    protected function resolveSellerStoreId(Request $request, bool $required = true): ?int
    {
        $cached = (int) ($request->attributes->get('seller_store_id') ?? 0);

        if ($cached > 0) {
            return $cached;
        }

        $userId = (string) ($request->user()?->getAuthIdentifier() ?? '');
        $storeId = (int) ($request->user()?->store?->id ?? 0);

        if ($storeId <= 0) {
            $storeId = (int) (FashionStoreResolver::resolveId() ?? 0);
        }

        if ($storeId <= 0 && $userId !== '') {
            $storeId = (int) DB::table('stores')
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->orderByDesc('is_active')
                ->orderBy('id')
                ->value('id');
        }

        if ($storeId <= 0) {
            if ($required) {
                throw ValidationException::withMessages(['store_id' => 'Akun seller belum terhubung dengan toko.']);
            }

            return null;
        }

        $request->attributes->set('seller_store_id', $storeId);

        return $storeId;
    }
}
