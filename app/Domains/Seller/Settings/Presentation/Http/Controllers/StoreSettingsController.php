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
        return response()->json([
            'success' => true,
            'data' => array_merge($this->settings->storeProfile(), [
                'payment' => $this->settings->paymentProfile(),
            ]),
        ]);
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
            // QRIS: gambar diunggah admin, disimpan di `payment.qris.*`.
            'qris_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_qris_image' => ['nullable', 'boolean'],
            'qris_enabled' => ['nullable', 'boolean'],
            'qris_merchant_name' => ['nullable', 'string', 'max:120'],
            'qris_notes' => ['nullable', 'string', 'max:500'],
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

        $this->applyQrisSettings($request, $validated);
        $profile = $this->settings->storeProfile();

        return response()->json([
            'success' => true,
            'data' => array_merge($profile, ['payment' => $this->settings->paymentProfile()]),
            'message' => 'Pengaturan toko berhasil diperbarui.',
        ]);
    }

    /**
     * Simpan / hapus gambar QRIS beserta meta pembayarannya di `app_settings`.
     *
     * @param  array<string, mixed>  $validated
     */
    private function applyQrisSettings(Request $request, array $validated): void
    {
        if (array_key_exists('qris_merchant_name', $validated)) {
            $this->settings->put('payment.qris.merchant_name', (string) $validated['qris_merchant_name'], 'payment');
        }

        if (array_key_exists('qris_notes', $validated)) {
            $this->settings->put('payment.qris.notes', (string) $validated['qris_notes'], 'payment');
        }

        if (array_key_exists('qris_enabled', $validated)) {
            $this->settings->put('payment.qris.enabled', (bool) $validated['qris_enabled'], 'payment', 'boolean');
        }

        if ($request->boolean('remove_qris_image')) {
            $current = (string) $this->settings->get('payment.qris.image', '');
            if ($current !== '' && ! str_starts_with($current, 'http')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($current);
            }

            $this->settings->put('payment.qris.image', null, 'payment');
            $this->settings->put('payment.qris.enabled', false, 'payment', 'boolean');

            return;
        }

        if ($request->hasFile('qris_image')) {
            $current = (string) $this->settings->get('payment.qris.image', '');
            $path = $request->file('qris_image')->store('payment/qris', 'public');

            if ($current !== '' && ! str_starts_with($current, 'http')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($current);
            }

            $this->settings->put('payment.qris.image', $path, 'payment');
            $this->settings->put('payment.qris.enabled', true, 'payment', 'boolean');
        }
    }
}
