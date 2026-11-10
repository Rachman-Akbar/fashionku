<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final class ValidateFirebaseToken
{
    public function __construct(
        private readonly FirebaseTokenVerifier $verifier,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $bearerToken = $request->bearerToken();

        if (! is_string($bearerToken) || trim($bearerToken) === '') {
            return response()->json([
                'message' => 'Firebase ID token is required in Bearer authorization header.',
            ], 401);
        }

        try {
            $firebaseUser = $this->verifier->verify($bearerToken);
        } catch (RuntimeException $e) {
            if (str_contains($e->getMessage(), 'credentials')) {
                Log::error('Firebase Admin credentials misconfigured for Google login.', ['exception' => $e::class]);
                return response()->json([
                    'message' => 'Login Google belum dikonfigurasi di server (Firebase Admin credentials). Hubungi administrator.',
                ], 503);
            }

            Log::warning('Firebase token verification failed', ['message' => $e->getMessage(), 'exception' => $e::class]);
            return response()->json(['message' => 'Firebase ID token is invalid.'], 401);
        } catch (Throwable $e) {
            Log::warning('Firebase token verification failed', [
                'message' => $e->getMessage(),
                'exception' => $e::class,
            ]);

            return response()->json([
                'message' => 'Firebase ID token is invalid.',
            ], 401);
        }

        $request->attributes->set('firebase_user', $firebaseUser);

        return $next($request);
    }
}
