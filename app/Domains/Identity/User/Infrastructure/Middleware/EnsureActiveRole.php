<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureActiveRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $role = strtolower(trim($role));
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! (bool) $user->is_active) {
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

        $abilities = $token->abilities ?? [];
        if (! in_array("active-role:{$role}", $abilities, true)) {
            return response()->json([
                'message' => "Active role must be {$role}.",
            ], 403);
        }

        $request->attributes->set('active_role', $role);

        return $next($request);
    }
}
