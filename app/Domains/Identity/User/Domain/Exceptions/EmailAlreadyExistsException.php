<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Exceptions;

use Exception;
use Symfony\Component\HttpFoundation\Response;

final class EmailAlreadyExistsException extends Exception
{
    // Kamu bisa menentukan default message dan status code di sini
    protected $message = 'Email ini sudah terdaftar di sistem kami.';

    public function getStatusCode(): int
    {
        return Response::HTTP_UNPROCESSABLE_ENTITY; // 422
    }
}
