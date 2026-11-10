<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class UserNotFoundException extends Exception
{
    /**
     * Menentukan default pesan error jika tidak diisi saat memanggil class.
     */
    protected $message = 'User tidak ditemukan.';

    /**
     * Render the exception into an HTTP response otomatis oleh Laravel.
     * Fitur ini membuat Controller kamu tetap bersih tanpa perlu try-catch berulang kali.
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], Response::HTTP_NOT_FOUND); // Mengembalikan HTTP Status 404
    }
}
