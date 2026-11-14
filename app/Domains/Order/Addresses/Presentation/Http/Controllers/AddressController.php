<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Presentation\Http\Controllers;

use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Order\Addresses\Application\UseCases\ManageAddressUseCase;
use App\Domains\Order\Addresses\Application\UseCases\ResolveAddressDestinationUseCase;
use App\Domains\Order\Addresses\Infrastructure\Persistence\Mappers\AddressMapper;
use App\Domains\Order\Addresses\Presentation\Http\Requests\ResolveAddressDestinationRequest;
use App\Domains\Order\Addresses\Presentation\Http\Requests\StoreAddressRequest;
use App\Domains\Order\Addresses\Presentation\Http\Resources\AddressResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class AddressController extends Controller
{
    public function __construct(
        private ManageAddressUseCase $useCase,
        private ResolveAddressDestinationUseCase $resolveDestinationUseCase,
        private UserRepositoryInterface $userRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $this->resolveOwner($request);
        $addresses = $this->useCase->listAddresses($userId);

        return AddressResource::collection($addresses)
            ->additional(['success' => true])
            ->response();
    }

    public function resolveDestination(ResolveAddressDestinationRequest $request): JsonResponse
    {
        $destination = $this->resolveDestinationUseCase->execute($request->validated());

        return response()->json([
            'success' => true,
            'data' => [
                'komerce_destination_id' => $destination->id,
                'destination' => $destination->toArray(),
            ],
        ]);
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $userId = $this->resolveOwner($request);
        $dto = AddressMapper::fromRequestArray($request->validated(), $userId);
        $address = $this->useCase->createAddress($dto);

        return (new AddressResource($address))
            ->additional(['success' => true, 'message' => 'Alamat berhasil disimpan.'])
            ->response()
            ->setStatusCode(201);
    }

    public function update(StoreAddressRequest $request, int $id): JsonResponse
    {
        $userId = $this->resolveOwner($request);
        $dto = AddressMapper::fromRequestArray($request->validated(), $userId);
        $address = $this->useCase->updateAddress($id, $dto);

        return (new AddressResource($address))
            ->additional(['success' => true, 'message' => 'Alamat berhasil diperbarui.'])
            ->response();
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $userId = $this->resolveOwner($request);
        $this->useCase->deleteAddress($id, $userId);

        return response()->json(['success' => true, 'message' => 'Alamat berhasil dihapus.']);
    }

    private function resolveOwner(Request $request): string
    {
        $user = $request->user();
        if (! $user) {
            throw new AccessDeniedHttpException('User tidak terautentikasi.');
        }

        return (string) $user->id;
    }
}
