<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Middleware;

use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use RuntimeException;

final class FirebaseTokenVerifier
{
    public function __construct(
        private readonly FirebaseAuth $auth,
    ) {}

    public function verify(string $idToken): array
    {
        $this->assertCredentialsConfigured();

        $verifiedToken = $this->auth->verifyIdToken($idToken);

        $claims = $verifiedToken->claims();

        return [
            'uid' => $claims->get('sub'),
            'email' => $claims->get('email'),
            'email_verified' => (bool) $claims->get('email_verified', false),
            'name' => $claims->get('name'),
            'picture' => $claims->get('picture'),
            'claims' => $claims->all(),
        ];
    }

    private function assertCredentialsConfigured(): void
    {
        $credentials = config('firebase.projects.app.credentials');
        if (is_string($credentials) && trim($credentials) !== '') {
            $path = trim($credentials);
            $resolved = $this->resolvePath($path);
            if ($resolved === null) {
                throw new RuntimeException('Firebase Admin credentials file not found. Set FIREBASE_CREDENTIALS in .env to the service account JSON path.');
            }

            return;
        }

        $env = getenv('GOOGLE_APPLICATION_CREDENTIALS') ?: ($_SERVER['GOOGLE_APPLICATION_CREDENTIALS'] ?? $_ENV['GOOGLE_APPLICATION_CREDENTIALS'] ?? null);
        if (is_string($env) && trim($env) !== '' && $this->resolvePath(trim($env)) !== null) {
            return;
        }

        throw new RuntimeException('Firebase Admin credentials are not configured. Set FIREBASE_CREDENTIALS (service account JSON path) in .env.');
    }

    private function resolvePath(string $path): ?string
    {
        $candidates = [$path];
        if (! str_starts_with($path, DIRECTORY_SEPARATOR) && ! preg_match('/^[A-Za-z]:[\\\\\\/]/', $path)) {
            $candidates[] = base_path($path);
            $candidates[] = storage_path($path);
        }

        foreach ($candidates as $candidate) {
            if (is_file($candidate) && is_readable($candidate)) {
                return $candidate;
            }
        }

        return null;
    }
}
