<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Presentation\Http\Controllers;

use App\Domains\Seller\Customers\Application\Services\CustomerService;
use App\Domains\Seller\Customers\Presentation\Http\Resources\CustomerResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CustomerController extends Controller
{
    public function __construct(private CustomerService $service) {}

    public function index(Request $request): JsonResponse
    {
        $rows = $this->service->paginate(
            $request->only(['search', 'min_orders']),
            min(100, max(1, (int) $request->query('per_page', 20)))
        );

        return CustomerResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', 'max:100', Rule::unique('seller_customers', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'avatar' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        // Generate code if not provided
        if (empty($validated['code'])) {
            $validated['code'] = $this->generateCustomerCode($validated['name']);
        }

        $customer = $this->service->create($validated);

        return (new CustomerResource($customer))
            ->additional(['success' => true, 'message' => 'Pelanggan berhasil ditambahkan.'])
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, string $customer): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', 'max:100', Rule::unique('seller_customers', 'code')->ignore($customer, 'user_id')],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($customer)],
            'avatar' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $updated = $this->service->update($customer, $validated);

        if ($updated === null) {
            throw ValidationException::withMessages(['customer' => 'Pelanggan tidak ditemukan.']);
        }

        return (new CustomerResource($updated))
            ->additional(['success' => true, 'message' => 'Pelanggan berhasil diperbarui.'])
            ->response();
    }

    public function destroy(Request $request, string $customer): JsonResponse
    {
        $deleted = $this->service->delete($customer);

        if (! $deleted) {
            throw ValidationException::withMessages(['customer' => 'Pelanggan tidak ditemukan.']);
        }

return response()->json(['success' => true, 'message' => 'Pelanggan berhasil dihapus.']);
    }

    private function generateCustomerCode(string $name): string
    {
        $words = explode(' ', Str::upper(trim($name)));
        $prefix = implode('', array_map(fn ($w) => $w[0], $words));
        $prefix = preg_replace('/[^A-Z0-9]/', '', $prefix) ?: 'CUST';

        $sequence = 1;
        while (true) {
            $code = $prefix . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
            $exists = DB::table('seller_customers')->where('code', $code)->exists();
            if (! $exists) {
                break;
            }
            $sequence++;
        }

        return $code;
    }
}
