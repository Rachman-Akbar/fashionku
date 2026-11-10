<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureActiveRole
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function handle(Request $request, Closure $next, string $role): Response
    {
        $role = strtolower(trim($role));
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! (bool) $user->is_active || $user->banned_at !== null) {
            return response()->json(['message' => 'Akun tidak memiliki akses aktif.'], 403);
        }

        if (! $user->hasRole($role)) {
            return response()->json([
                'message' => "Forbidden. Anda tidak memiliki role {$role} aktif.",
            ], 403);
        }

        $token = $user->currentAccessToken();

        if ($token === null) {
            return response()->json(['message' => 'Missing access token.'], 401);
        }

        if (! in_array("active-role:{$role}", $token->abilities ?? [], true)) {
            return response()->json([
                'message' => "Active role must be {$role}.",
            ], 403);
        }

        if ($role === 'seller' && ! $this->users->hasSellerAccess($user)) {
            return response()->json(['message' => 'Seller access is not active.'], 403);
        }

        $request->attributes->set('active_role', $role);

        return $next($request);
    }
}
