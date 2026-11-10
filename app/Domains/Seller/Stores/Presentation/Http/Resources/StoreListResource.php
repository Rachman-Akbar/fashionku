<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class StoreListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $store = $this->resource;

        return [
            'id' => $store->id(),
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
            'created_at' => $store->createdAt(),
            'updated_at' => $store->updatedAt(),
            'owner_name' => $store->ownerName(),
            'owner_email' => $store->ownerEmail(),
        ];
    }
}
