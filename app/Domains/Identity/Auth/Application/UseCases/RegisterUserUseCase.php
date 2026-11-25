<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\UseCases;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

final readonly class RegisterUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private BuildAuthPayloadUseCase $payload,
        private IssueApiTokenUseCase $issueToken,
        private AdminNotificationService $adminNotifications,
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

            $this->notifyNewUser($user);

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

    private function notifyNewUser(User $user): void
    {
        try {
            $this->adminNotifications->notifyAdmins([
                'module' => 'users',
                'type' => 'user.registered',
                'title' => 'Pengguna baru',
                'message' => ($user->name !== '' && $user->name !== null ? $user->name : 'Tanpa nama').' · '.$user->email,
                'reference_type' => 'user',
                'reference_id' => (string) $user->id,
                'url' => '/admin/users?user='.$user->id,
                'meta' => ['email' => $user->email],
            ]);
        } catch (Throwable) {
            // Notifikasi bersifat best-effort; registrasi tidak boleh gagal.
        }
    }
}
