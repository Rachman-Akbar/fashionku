<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PromotionPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'store' => $this->whenLoaded('store', fn () => ['id' => $this->store?->id, 'name' => $this->store?->name]),
            'user' => $this->whenLoaded('user', fn () => ['id' => $this->user?->id, 'name' => $this->user?->name, 'email' => $this->user?->email]),
            'payment_number' => $this->payment_number,
            'package_name' => $this->package_name,
            'amount' => (float) $this->amount,
            'payment_method' => $this->payment_method,
            'proof_url' => $this->proof_url,
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'paid_at' => $this->paid_at?->toISOString(),
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer ? ['id' => $this->reviewer->id, 'name' => $this->reviewer->name] : null),
            'promotion' => $this->whenLoaded('promotion', fn () => $this->promotion ? ['id' => $this->promotion->id, 'name' => $this->promotion->name] : null),
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
