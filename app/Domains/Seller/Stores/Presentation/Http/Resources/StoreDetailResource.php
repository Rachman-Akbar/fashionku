<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class StoreDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detail = $this->resource;

        if (! $detail) {
            return [];
        }

        return [
            'id' => $detail->id,
            'store_id' => $detail->storeId,
            'owner_name' => $detail->ownerName,
            'owner_phone' => $detail->ownerPhone,
            'description' => $detail->description,
            'shipping_policy' => $detail->shippingPolicy,
            'return_policy' => $detail->returnPolicy,
            'open_days' => $detail->openDays,
            'open_time' => $detail->openTime,
            'close_time' => $detail->closeTime,
            'whatsapp_url' => $detail->whatsappUrl,
            'instagram_url' => $detail->instagramUrl,
            'tiktok_url' => $detail->tiktokUrl,
            'website_url' => $detail->websiteUrl,
            'created_at' => $detail->createdAt,
            'updated_at' => $detail->updatedAt,
        ];
    }
}
