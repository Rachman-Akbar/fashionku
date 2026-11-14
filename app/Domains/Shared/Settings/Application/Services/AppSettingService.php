<?php

declare(strict_types=1);

namespace App\Domains\Shared\Settings\Application\Services;

use App\Domains\Shared\Settings\Infrastructure\Persistence\Models\AppSettingModel;

/**
 * Penyimpanan konfigurasi aplikasi single-store (key-value).
 *
 * Profil toko (nama, logo, deskripsi, alamat, kebijakan, dsb.) disimpan di
 * sini karena Fashionku tidak lagi memiliki tabel `stores`.
 */
final class AppSettingService
{
    /** @var array<string, mixed>|null */
    private static ?array $cache = null;

    public function get(string $key, mixed $default = null): mixed
    {
        $settings = $this->all();

        return array_key_exists($key, $settings) ? $settings[$key] : $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $rows = AppSettingModel::query()->get(['key', 'value', 'type']);

        $settings = [];
        foreach ($rows as $row) {
            $settings[(string) $row->key] = $this->cast($row->value, (string) $row->type);
        }

        return self::$cache = $settings;
    }

    public function put(string $key, mixed $value, string $group = 'general', string $type = 'string'): void
    {
        AppSettingModel::query()->updateOrCreate(
            ['key' => $key],
            [
                'group' => $group,
                'value' => $this->serialize($value, $type),
                'type' => $type,
            ]
        );

        self::$cache = null;
    }

    /**
     * @param  array<string, mixed>  $settings
     */
    public function putMany(array $settings, string $group = 'general'): void
    {
        foreach ($settings as $key => $value) {
            $type = match (true) {
                is_bool($value) => 'boolean',
                is_int($value) => 'integer',
                is_float($value) => 'float',
                is_array($value) => 'json',
                default => 'string',
            };

            $this->put((string) $key, $value, $group, $type);
        }
    }

    /**
     * Profil toko tunggal dalam bentuk yang kompatibel dengan resource lama.
     *
     * @return array<string, mixed>
     */
    public function storeProfile(): array
    {
        return [
            'id' => 1,
            'user_id' => null,
            'name' => (string) $this->get('store.name', config('app.name', 'Fashionku')),
            'slug' => (string) $this->get('store.slug', 'fashionku'),
            'description' => $this->get('store.description'),
            'short_description' => $this->get('store.short_description'),
            'phone' => $this->get('store.phone'),
            'email' => $this->get('store.email'),
            'city' => $this->get('store.city'),
            'province' => $this->get('store.province'),
            'address' => $this->get('store.address'),
            'logo' => $this->get('store.logo'),
            'banner_url' => $this->get('store.banner_url'),
            'status' => 'approved',
            'is_active' => (bool) $this->get('store.is_active', true),
            'created_at' => $this->get('store.created_at'),
            'updated_at' => $this->get('store.updated_at'),
            'detail' => [
                'owner_name' => $this->get('store.owner_name'),
                'owner_phone' => $this->get('store.owner_phone'),
                'description' => $this->get('store.detail_description'),
                'shipping_policy' => $this->get('store.shipping_policy'),
                'return_policy' => $this->get('store.return_policy'),
                'open_days' => $this->get('store.open_days'),
                'open_time' => $this->get('store.open_time'),
                'close_time' => $this->get('store.close_time'),
                'whatsapp_url' => $this->get('store.whatsapp_url'),
                'instagram_url' => $this->get('store.instagram_url'),
                'tiktok_url' => $this->get('store.tiktok_url'),
                'website_url' => $this->get('store.website_url'),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateStoreProfile(array $data): array
    {
        $map = [
            'name' => 'store.name',
            'store_name' => 'store.name',
            'slug' => 'store.slug',
            'description' => 'store.description',
            'short_description' => 'store.short_description',
            'phone' => 'store.phone',
            'email' => 'store.email',
            'city' => 'store.city',
            'province' => 'store.province',
            'address' => 'store.address',
            'logo' => 'store.logo',
            'banner_url' => 'store.banner_url',
            'is_active' => 'store.is_active',
            'detail.owner_name' => 'store.owner_name',
            'detail.owner_phone' => 'store.owner_phone',
            'detail.description' => 'store.detail_description',
            'detail.shipping_policy' => 'store.shipping_policy',
            'detail.return_policy' => 'store.return_policy',
            'detail.open_days' => 'store.open_days',
            'detail.open_time' => 'store.open_time',
            'detail.close_time' => 'store.close_time',
            'detail.whatsapp_url' => 'store.whatsapp_url',
            'detail.instagram_url' => 'store.instagram_url',
            'detail.tiktok_url' => 'store.tiktok_url',
            'detail.website_url' => 'store.website_url',
        ];

        foreach ($map as $input => $key) {
            if (! array_key_exists($input, $data)) {
                continue;
            }

            $value = $data[$input];

            if ($value === null) {
                continue;
            }

            $this->put($key, $value, 'store');
        }

        $this->put('store.updated_at', now()->toDateTimeString(), 'store');

        return $this->storeProfile();
    }

    private function cast(?string $value, string $type): mixed
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    private function serialize(mixed $value, string $type): ?string
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'boolean' => $value ? '1' : '0',
            'integer', 'float' => (string) $value,
            'json' => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            default => (string) $value,
        };
    }
}
