<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Controllers;

use App\Domains\Identity\Auth\Application\Services\EmailVerificationEngine;
use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Application\DTOs\UpdateUserDTO;
use App\Domains\Identity\User\Application\Queries\GetUserByEmailQuery;
use App\Domains\Identity\User\Application\Queries\GetUserQuery;
use App\Domains\Identity\User\Application\Queries\ListUsersQuery;
use App\Domains\Identity\User\Application\UseCases\CreateUserUseCase;
use App\Domains\Identity\User\Application\UseCases\DeleteUserUseCase;
use App\Domains\Identity\User\Application\UseCases\UpdateUserUseCase;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Exceptions\UserNotFoundException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Identity\User\Presentation\Http\Requests\StoreUserRequest;
use App\Domains\Identity\User\Presentation\Http\Requests\UpdateUserRequest;
use App\Domains\Identity\User\Presentation\Http\Resources\UserCollection;
use App\Domains\Identity\User\Presentation\Http\Resources\UserResource;
use App\Domains\Shared\Moderation\Application\Services\ModerationChatService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class UserController extends Controller
{
    public function __construct(
        private readonly ListUsersQuery $listUsersUseCase,
        private readonly GetUserQuery $getUserUseCase,
        private readonly GetUserByEmailQuery $getUserByEmailUseCase,
        private readonly CreateUserUseCase $createUserUseCase,
        private readonly UpdateUserUseCase $updateUserUseCase,
        private readonly DeleteUserUseCase $deleteUserUseCase,
        private readonly UserRepositoryInterface $userRepository,
        private readonly EmailVerificationEngine $verificationEngine,
        private readonly ModerationChatService $moderationChat
    ) {}

    public function index(Request $request): UserCollection
    {
        $perPage = min(100, max(1, (int) $request->query('per_page', 15)));

        return new UserCollection($this->listUsersUseCase->execute($perPage));
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $this->ensureAccess($request, $id);

        try {
            return (new UserResource($this->getUserUseCase->execute($id)))
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        } catch (UserNotFoundException $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    public function showByEmail(Request $request, string $email): JsonResponse
    {
        try {
            $user = $this->getUserByEmailUseCase->execute($email);
            $this->ensureAccess($request, (string) $user->id);

            return (new UserResource($user))
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        } catch (UserNotFoundException $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $user = $this->createUserUseCase->execute(
                CreateUserDTO::fromArray($request->validated())
            );

            return (new UserResource($user))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        } catch (EmailAlreadyExistsException $exception) {
            return response()->json(
                ['message' => $exception->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }

    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $activeRole = $this->ensureAccess($request, $id);
        $validated = $request->validated();

        if ($activeRole !== 'admin') {
            unset(
                $validated['firebase_uid'],
                $validated['is_email_verified'],
                $validated['role_ids'],
                $validated['is_active'],
                $validated['banned_at']
            );

            // Sensitive self-edits (biodata, email, avatar, password) must be
            // preceded by email verification. The verified code is consumed here
            // so a code can only be used once.
            $verificationCode = $validated['verification_code'] ?? null;
            unset($validated['verification_code']);

            if (! is_string($verificationCode) || trim($verificationCode) === '') {
                throw ValidationException::withMessages([
                    'verification_code' => ['Kode verifikasi email wajib diisi sebelum mengubah profil.'],
                ]);
            }

            $this->verificationEngine->verify((string) $request->user()->email, $verificationCode);
        }

        try {
            $previousUser = $this->getUserUseCase->execute($id);
            $user = $this->updateUserUseCase->execute($id, UpdateUserDTO::fromArray($validated));

            $banStateChanged = $previousUser->is_active !== $user->is_active
                || (string) $previousUser->banned_at !== (string) $user->banned_at;

            if ($activeRole === 'admin' && $banStateChanged) {
                $wasBanned = (bool) $previousUser->banned_at || ! $previousUser->is_active;
                $isBanned = (bool) $user->banned_at || ! $user->is_active;

                if ($wasBanned !== $isBanned) {
                    $this->moderationChat->notifyUserStatus(
                        $id,
                        $isBanned ? 'banned' : 'unbanned',
                        (string) $request->user()->id,
                        is_string($validated['message'] ?? null) ? $validated['message'] : null
                    );
                }
            }

            return (new UserResource($user))->response()->setStatusCode(Response::HTTP_OK);
        } catch (UserNotFoundException $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_NOT_FOUND);
        } catch (EmailAlreadyExistsException $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->deleteUserUseCase->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully.',
            ]);
        } catch (UserNotFoundException $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    private function ensureAccess(Request $request, string $targetUserId): string
    {
        $authenticatedUser = $request->user();
        $activeRole = $this->userRepository->getActiveRoleFromCurrentToken($authenticatedUser);

        if ($activeRole === 'admin' || (string) $authenticatedUser->id === $targetUserId) {
            return (string) ($activeRole ?: 'buyer');
        }

        throw new AccessDeniedHttpException('Anda tidak dapat mengakses data pengguna lain.');
    }
}
