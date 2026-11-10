<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'product_slug' => $this->product?->slug,
            'product_thumbnail' => $this->product?->thumbnail,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'order_item_id' => $this->order_item_id,
            'user_id' => $this->user_id,
            'user_name' => $this->user?->name,
            'user_avatar' => $this->user?->avatar,
            'rating' => $this->rating,
            'review' => $this->review,
            'media' => $this->media,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
