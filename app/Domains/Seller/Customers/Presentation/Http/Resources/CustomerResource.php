<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $createdBy = $this->customer_created_by ?? null;
        $updatedBy = $this->customer_updated_by ?? null;

        return [
            'id' => $this->id,
            'code' => $this->code ?? null,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'is_active' => (bool) $this->is_active,
            'is_email_verified' => (bool) ($this->is_email_verified ?? false),
            'note' => $this->note ?? null,
            'is_manual' => (bool) ($this->is_manual ?? false),
            'orders_count' => (int) ($this->orders_count ?? 0),
            'total_spent' => (float) ($this->total_spent ?? 0),
            'last_order_at' => $this->last_order_at,
            'registered_at' => $this->created_at?->toIso8601String(),
            'phone' => $this->primary_phone ?? null,
            'address' => $this->primary_address ?? null,
            'recipient_name' => $this->primary_recipient ?? null,
            'created_by_user' => is_string($createdBy) && $createdBy !== ''
                ? ['id' => $createdBy, 'name' => $this->creatorName($createdBy)]
                : null,
            'updated_by_user' => is_string($updatedBy) && $updatedBy !== ''
                ? ['id' => $updatedBy, 'name' => $this->creatorName($updatedBy)]
                : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Nama pembuat/pengubah diambil dari peta yang disiapkan repository
     * (satu query untuk seluruh halaman, bukan N+1).
     */
    private function creatorName(string $userId): ?string
    {
        $map = $this->audit_user_names ?? [];

        return is_array($map) ? ($map[$userId] ?? null) : null;
    }
}
