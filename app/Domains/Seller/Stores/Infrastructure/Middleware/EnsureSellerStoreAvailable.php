<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\Middleware;

use App\Domains\Seller\Stores\Domain\Services\FashionStoreResolver;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureSellerStoreAvailable
{
    public function handle(Request $request, Closure $next): Response
    {
        $store = FashionStoreResolver::resolve();

        if (! $store) {
            return new JsonResponse(['message' => 'Toko Fashionku belum tersedia.'], 403);
        }

        if ($store->status === 'suspended') {
            return new JsonResponse(['message' => 'Toko sedang ditangguhkan.'], 403);
        }

        $request->attributes->set('seller_store_id', (int) $store->id);
        $request->attributes->set('seller_store_status', (string) $store->status);

        return $next($request);
    }
}
