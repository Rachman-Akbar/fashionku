<?php

declare(strict_types=1);

namespace App\Infrastructure\Logging\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Emits a structured access log line per request: method, path, status,
 * duration, authenticated user, and a stable trace id.
 *
 * Registered as global middleware in bootstrap/app.php.
 */
final class RequestLogMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = hrtime(true);

        $response = $next($request);

        $durationMs = round((hrtime(true) - $start) / 1e6, 1);

        if (config('logging.request_log.enabled', false) && ! $this->shouldSkip($request)) {
            Log::info('http.request', [
                'method' => $request->method(),
                'path' => $request->path(),
                'status' => $response->getStatusCode(),
                'duration_ms' => $durationMs,
                'user_id' => $this->userId($request),
                'ip' => $request->ip(),
                'trace_id' => $request->header('X-Trace-Id'),
            ]);
        }

        return $response;
    }

    private function shouldSkip(Request $request): bool
    {
        $path = $request->path();

        return str_starts_with($path, 'api/v1/') === false
            || $path === 'api/v1/up'
            || $path === 'up';
    }

    private function userId(Request $request): ?string
    {
        $user = $request->user();

        return $user ? (string) $user->getAuthIdentifier() : null;
    }
}
