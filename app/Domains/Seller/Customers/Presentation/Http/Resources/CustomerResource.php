<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'is_active' => (bool) $this->is_active,
            'is_manual' => (bool) ($this->is_manual ?? false),
            'orders_count' => (int) ($this->orders_count ?? 0),
            'total_spent' => (float) ($this->total_spent ?? 0),
            'last_order_at' => $this->last_order_at,
            'registered_at' => $this->created_at?->toIso8601String(),
            'phone' => $this->primary_phone ?? null,
            'address' => $this->primary_address ?? null,
        ];
    }
}
