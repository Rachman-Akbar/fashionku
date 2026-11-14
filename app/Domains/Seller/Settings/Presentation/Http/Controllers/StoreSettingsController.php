<?php

declare(strict_types=1);

namespace App\Domains\Seller\Settings\Presentation\Http\Controllers;

use App\Domains\Shared\Settings\Application\Services\AppSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * Pengaturan profil toko tunggal. Data disimpan di `app_settings`, bukan tabel
 * `stores`.
 */
final class StoreSettingsController extends Controller
{
    public function __construct(
        private AppSettingService $settings,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json(['data' => $this->settings->storeProfile()]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_name' => ['sometimes', 'string', 'max:255'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'city' => ['nullable', 'string', 'max:80'],
            'province' => ['nullable', 'string', 'max:80'],
            'address' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'detail' => ['nullable', 'array'],
            'detail.owner_name' => ['nullable', 'string', 'max:120'],
            'detail.owner_phone' => ['nullable', 'string', 'max:30'],
            'detail.description' => ['nullable', 'string'],
            'detail.shipping_policy' => ['nullable', 'string'],
            'detail.return_policy' => ['nullable', 'string'],
            'detail.open_days' => ['nullable', 'string', 'max:120'],
            'detail.open_time' => ['nullable', 'string', 'max:8'],
            'detail.close_time' => ['nullable', 'string', 'max:8'],
            'detail.whatsapp_url' => ['nullable', 'url', 'max:255'],
            'detail.instagram_url' => ['nullable', 'url', 'max:255'],
            'detail.tiktok_url' => ['nullable', 'url', 'max:255'],
            'detail.website_url' => ['nullable', 'url', 'max:255'],
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('stores/logos', 'public');
        }

        if ($request->hasFile('banner')) {
            $validated['banner_url'] = $request->file('banner')->store('stores/banners', 'public');
        }

        unset($validated['banner']);

        $profile = $this->settings->updateStoreProfile($validated);

        return response()->json([
            'data' => $profile,
            'message' => 'Pengaturan toko berhasil diperbarui.',
        ]);
    }
}
