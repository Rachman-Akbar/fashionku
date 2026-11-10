<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\ReadModels\Store;

use App\Domains\Seller\Stores\Application\ReadModels\StoreCatalogReaderInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class EloquentStoreCatalogReader implements StoreCatalogReaderInterface
{
    public function paginatedStores(array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->normalizePerPage($filters['per_page'] ?? 8);

        $query = DB::table('stores')
            ->select([
                'id',
                'user_id',
                'name',
                'slug',
                'description',
                'phone',
                'email',
                'city',
                'province',
                'address',
                'is_active',
                'logo',
                'banner_url',
                'created_at',
                'updated_at',
            ]);

        if (array_key_exists('is_active', $filters) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('city', 'like', '%'.$search.'%')
                    ->orWhere('province', 'like', '%'.$search.'%');
            });
        }

        return $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function storeProfileBySlug(string $slug): ?object
    {
        return DB::table('stores')
            ->select([
                'id',
                'user_id',
                'name',
                'slug',
                'description',
                'phone',
                'email',
                'city',
                'province',
                'address',
                'is_active',
                'logo',
                'banner_url',
                'created_at',
            ])
            ->where('slug', $slug)
            ->first();
    }

    private function normalizePerPage(mixed $perPage): int
    {
        $perPage = (int) $perPage;

        return ($perPage < 1) ? 8 : min($perPage, 24);
    }
}
