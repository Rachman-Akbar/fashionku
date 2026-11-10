<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\Persistence\Mappers;

use App\Domains\Seller\Stores\Domain\Entities\Store;
use App\Domains\Seller\Stores\Domain\Entities\StoreDetail;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;

final class StoreMapper
{
    public static function toEntity(StoreModel $model): Store
    {
        $detail = null;
        if ($model->relationLoaded('detail') && $model->detail) {
            $detail = new StoreDetail(
                id: (int) $model->detail->id,
                storeId: (int) $model->detail->store_id,
                ownerName: $model->detail->owner_name,
                ownerPhone: $model->detail->owner_phone,
                description: $model->detail->description,
                shippingPolicy: $model->detail->shipping_policy,
                returnPolicy: $model->detail->return_policy,
                openDays: $model->detail->open_days,
                openTime: $model->detail->open_time,
                closeTime: $model->detail->close_time,
                whatsappUrl: $model->detail->whatsapp_url,
                instagramUrl: $model->detail->instagram_url,
                tiktokUrl: $model->detail->tiktok_url,
                websiteUrl: $model->detail->website_url,
                createdAt: $model->detail->created_at?->toIso8601String(),
                updatedAt: $model->detail->updated_at?->toIso8601String()
            );
        }

        return new Store(
            id: (int) $model->id,
            userId: (string) $model->user_id,
            name: (string) $model->name,
            slug: (string) $model->slug,
            description: $model->description,
            shortDescription: $model->short_description,
            phone: $model->phone,
            email: $model->email,
            city: $model->city,
            province: $model->province,
            address: $model->address,
            status: (string) ($model->status ?? 'approved'),
            isActive: (bool) $model->is_active,
            storeType: (string) ($model->store_type ?? 'regular'),
            logo: $model->logo,
            bannerUrl: $model->banner_url,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
            detail: $detail,
            ownerName: $model->relationLoaded('owner') ? $model->owner?->name : null,
            ownerEmail: $model->relationLoaded('owner') ? $model->owner?->email : null
        );
    }

    public static function toModel(Store $store): array
    {
        return [
            'user_id' => $store->userId(),
            'name' => $store->name(),
            'slug' => $store->slug(),
            'description' => $store->description(),
            'short_description' => $store->shortDescription(),
            'phone' => $store->phone(),
            'email' => $store->email(),
            'city' => $store->city(),
            'province' => $store->province(),
            'address' => $store->address(),
            'status' => $store->status(),
            'is_active' => $store->isActive(),
            'store_type' => $store->storeType(),
            'logo' => $store->logo(),
            'banner_url' => $store->bannerUrl(),
        ];
    }
}
