<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Presentation\Http\Controllers;

use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Seller\Stores\Application\UseCases\CreateStoreUseCase;
use App\Domains\Seller\Stores\Application\UseCases\UpdateStoreUseCase;
use App\Domains\Seller\Stores\Domain\Services\FashionStoreResolver;
use App\Domains\Seller\Stores\Presentation\Http\Resources\StoreResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;

/**
 * Single-store app: no public store directory/detail. Seller manages the primary store.
 */
final class StoreController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function manageShow(Request $request): StoreResource
    {
        $store = FashionStoreResolver::resolve();
        abort_if(! $store, 404, 'Toko Fashionku belum tersedia.');

        $user = $request->user();
        $user->loadMissing('roles:id,name');
        $isAdmin = $user->hasRole('admin');
        abort_unless($isAdmin || $user->hasRole('seller'), 403, 'Anda tidak memiliki akses ke toko ini.');
        if (! $isAdmin) {
            abort_unless($this->userRepository->hasSellerAccess($user), 403, 'Akses penjual tidak tersedia.');
        }

        return new StoreResource(\App\Domains\Seller\Stores\Application\DTOs\StoreData::fromEntity($store));
    }

    public function registerStore(Request $request, CreateStoreUseCase $useCase): JsonResponse
    {
        $validated = $request->validate($this->rules(true));
        $validated = $this->storeUploads($request, $validated);
        $validated['detail'] = $this->detailData($validated);

        $store = $useCase->execute((string) $request->user()->id, $validated, $request->header('X-Device-Name'));

        return (new StoreResource($store))
            ->additional(['message' => 'Akses penjual aktif. Anda dapat mengelola toko.'])
            ->response()
            ->setStatusCode(201);
    }

    public function updateStore(Request $request, UpdateStoreUseCase $useCase): JsonResponse
    {
        $store = FashionStoreResolver::resolve();
        abort_if(! $store, 404, 'Toko Fashionku belum tersedia.');

        $validated = $request->validate($this->rules(false));
        unset($validated['status']);
        $validated = $this->storeUploads($request, $validated);
        $detail = $this->detailData($validated);
        if ($detail !== []) {
            $validated['detail'] = $detail;
        }

        $role = (string) ($this->userRepository->getActiveRoleFromCurrentToken($request->user()) ?: 'buyer');
        $result = $useCase->execute((int) $store->id, (string) $request->user()->id, $role, $validated);

        return (new StoreResource($result))
            ->additional(['message' => 'Toko berhasil diperbarui.'])
            ->response();
    }

    private function rules(bool $creating): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return [
            'store_name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'phone' => [$creating ? 'required' : 'nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'city' => [$creating ? 'required' : 'nullable', 'string', 'max:80'],
            'province' => [$creating ? 'required' : 'nullable', 'string', 'max:80'],
            'address' => [$creating ? 'required' : 'nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active' => ['nullable', 'boolean'],
            'detail' => ['nullable', 'array'],
            'detail.owner_name' => ['nullable', 'string', 'max:120'],
            'detail.owner_phone' => ['nullable', 'string', 'max:30'],
            'detail.description' => ['nullable', 'string'],
            'detail.shipping_policy' => [$creating ? 'required' : 'nullable', 'string', 'min:10'],
            'detail.return_policy' => [$creating ? 'required' : 'nullable', 'string', 'min:10'],
            'detail.open_days' => [$creating ? 'required' : 'nullable', 'string', 'max:120'],
            'detail.open_time' => [$creating ? 'required' : 'nullable', $this->timeRule()],
            'detail.close_time' => [$creating ? 'required' : 'nullable', $this->timeRule(), 'after:detail.open_time'],
            'detail.whatsapp_url' => ['nullable', 'url', 'max:255'],
            'detail.instagram_url' => ['nullable', 'url', 'max:255'],
            'detail.tiktok_url' => ['nullable', 'url', 'max:255'],
            'detail.website_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    private function storeUploads(Request $request, array $validated): array
    {
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('stores/logos', 'public');
        }
        if ($request->hasFile('banner')) {
            $validated['banner_url'] = $request->file('banner')->store('stores/banners', 'public');
        }
        unset($validated['banner']);

        return $validated;
    }

    private function timeRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            $time = is_string($value) ? trim($value) : '';
            if ($time === '') {
                return;
            }
            if (! preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $time) || ! $this->isValidTime($time)) {
                $fail('The :attribute field must match the format H:i.');
            }
        };
    }

    private function isValidTime(string $value): bool
    {
        $parts = array_map('intval', explode(':', $value));
        if ($parts[0] < 0 || $parts[0] > 23 || $parts[1] < 0 || $parts[1] > 59) {
            return false;
        }
        if (isset($parts[2]) && ($parts[2] < 0 || $parts[2] > 59)) {
            return false;
        }

        return true;
    }

    private function detailData(array $validated): array
    {
        $detail = $validated['detail'] ?? [];
        foreach (['open_time', 'close_time'] as $key) {
            if (isset($detail[$key]) && is_string($detail[$key]) && str_contains($detail[$key], ':')) {
                $detail[$key] = trim(implode(':', array_slice(explode(':', $detail[$key]), 0, 2)));
            }
        }

        return Arr::where($detail, fn (mixed $value): bool => $value !== null && $value !== '');
    }
}
