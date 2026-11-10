<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Presentation\Http\Controllers;

use App\Domains\Seller\Customers\Application\Services\CustomerService;
use App\Domains\Seller\Customers\Presentation\Http\Resources\CustomerResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

final class CustomerController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private CustomerService $service) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
        $rows = $this->service->paginate(
            $request->only(['search', 'min_orders']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $storeId
        );

        return CustomerResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(Request $request): JsonResponse
    {
        $storeId = $this->resolveSellerStoreId($request);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'note' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $customer = $this->service->create($validated, $storeId);

        return (new CustomerResource($customer))
            ->additional(['success' => true, 'message' => 'Pelanggan berhasil ditambahkan.'])
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, string $customer): JsonResponse
    {
        $storeId = $this->resolveSellerStoreId($request);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($customer)],
            'note' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $updated = $this->service->update($customer, $validated, $storeId);

        if ($updated === null) {
            throw ValidationException::withMessages(['customer' => 'Pelanggan tidak ditemukan pada toko ini.']);
        }

        return (new CustomerResource($updated))
            ->additional(['success' => true, 'message' => 'Pelanggan berhasil diperbarui.'])
            ->response();
    }

    public function destroy(Request $request, string $customer): JsonResponse
    {
        $storeId = $this->resolveSellerStoreId($request);
        $deleted = $this->service->delete($customer, $storeId);

        if (! $deleted) {
            throw ValidationException::withMessages(['customer' => 'Pelanggan tidak ditemukan pada toko ini.']);
        }

        return response()->json(['success' => true, 'message' => 'Pelanggan berhasil dihapus.']);
    }
}
