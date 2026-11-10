<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class VoucherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = null;

        if ($this->image) {
            $imageUrl = str_starts_with((string) $this->image, 'http')
                ? $this->image
                : Storage::disk('public')->url((string) $this->image);
        }

        $ownership = (array) $request->attributes->get('voucher_ownership', []);
        $missionRewardIds = (array) ($ownership['mission_reward_ids'] ?? []);
        $ownedIds = (array) ($ownership['owned_ids'] ?? []);

        $isMissionReward = isset($missionRewardIds[(int) $this->id]);
        $isOwned = ! $isMissionReward || isset($ownedIds[(int) $this->id]);

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'image' => $this->image,
            'imageUrl' => $imageUrl,
            'voucherScope' => $this->voucher_scope,
            'discountTarget' => $this->discount_target,
            'discountType' => $this->discount_type,
            'discountValue' => $this->discount_value !== null ? (int) round((float) $this->discount_value) : null,
            'minSpend' => $this->min_spend !== null ? (int) round((float) $this->min_spend) : null,
            'minItems' => $this->min_items,
            'minDistinctProducts' => $this->min_distinct_products,
            'terms' => $this->terms,
            'maxDiscount' => $this->max_discount !== null ? (int) round((float) $this->max_discount) : null,
            'startsAt' => $this->starts_at?->toDateTimeString(),
            'endsAt' => $this->ends_at?->toDateTimeString(),
            'usageLimit' => $this->usage_limit,
            'usedCount' => $this->used_count,
            'storeId' => $this->store_id,
            'storeName' => $this->relationLoaded('store') ? $this->store?->name : null,
            'isActive' => $this->is_active,
            'isMissionReward' => $isMissionReward,
            'isOwned' => $isOwned,
            'isLocked' => $isMissionReward && ! $isOwned,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
