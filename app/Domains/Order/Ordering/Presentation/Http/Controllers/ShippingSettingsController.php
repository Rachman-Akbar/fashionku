<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ShippingSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $row = $this->row();

        return response()->json(['success' => true, 'data' => $this->normalize($row)]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_latitude' => ['required', 'numeric', 'between:-90,90'],
            'store_longitude' => ['required', 'numeric', 'between:-180,180'],
            'free_shipping_max_distance' => ['nullable', 'numeric', 'min:0'],
            'default_flat_rate' => ['nullable', 'numeric', 'min:0'],
            'rate_per_km' => ['nullable', 'numeric', 'min:0'],
        ]);

        $payload = [
            'origin_destination_id' => null,
            'store_latitude' => (float) $validated['store_latitude'],
            'store_longitude' => (float) $validated['store_longitude'],
            'free_shipping_max_distance' => (float) ($validated['free_shipping_max_distance'] ?? 0),
            'default_flat_rate' => (float) ($validated['default_flat_rate'] ?? 0),
            'rate_per_km' => (float) ($validated['rate_per_km'] ?? 0),
            'updated_at' => now(),
        ];

        $existing = $this->row();
        if ($existing) {
            DB::table('shipping_settings')->where('id', $existing->id)->update($payload);
        } else {
            $payload['created_at'] = now();
            DB::table('shipping_settings')->insert($payload);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan ongkir berhasil disimpan.',
            'data' => $this->normalize($this->row()),
        ]);
    }

    private function row(): ?object
    {
        if (! Schema::hasTable('shipping_settings')) {
            return null;
        }

        return DB::table('shipping_settings')->orderBy('id')->first();
    }

    private function normalize(?object $row): array
    {
        return [
            'store_latitude' => $row?->store_latitude !== null ? (float) $row->store_latitude : null,
            'store_longitude' => $row?->store_longitude !== null ? (float) $row->store_longitude : null,
            'free_shipping_max_distance' => (float) ($row->free_shipping_max_distance ?? 0),
            'default_flat_rate' => (float) ($row->default_flat_rate ?? 0),
            'rate_per_km' => (float) ($row->rate_per_km ?? 0),
        ];
    }
}
