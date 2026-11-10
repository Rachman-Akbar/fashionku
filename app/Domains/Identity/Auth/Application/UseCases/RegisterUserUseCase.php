<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class RegisterUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private BuildAuthPayloadUseCase $payload,
        private IssueApiTokenUseCase $issueToken,
    ) {}

    public function execute(string $name, string $email, string $password, ?string $deviceName): array
    {
        $email = Str::lower(trim($email));

        if ($this->userRepository->findAnyByEmail($email)) {
            throw new EmailAlreadyExistsException("User with email {$email} already exists.");
        }

        $user = DB::transaction(function () use ($name, $email, $password) {
            $user = $this->userRepository->create(new CreateUserDTO(
                name: trim($name),
                email: $email,
                password: $password,
                roleIds: [],
                isEmailVerified: false,
                isActive: true,
            ));
            $this->userRepository->assignRoleByName($user, 'buyer');

            return $user->refresh()->load('roles:id,name,is_active');
        });
        $token = $this->issueToken->execute($user, $deviceName, 'buyer');

        return [
            ...$this->payload->execute($user),
            'token_type' => 'Bearer',
            'access_token' => $token,
            'api_token' => $token,
        ];
    }
}
