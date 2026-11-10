<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class FinancialTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'store_name' => $this->store?->name,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'user_id' => $this->user_id,
            'counterparty_name' => $this->counterparty?->name,
            'counterparty_email' => $this->counterparty?->email,
            'reference_number' => $this->reference_number,
            'type' => $this->type,
            'category' => $this->category ?? 'lainnya',
            'title' => $this->title,
            'description' => $this->description,
            'amount' => (float) $this->amount,
            'paid_amount' => (float) $this->paid_amount,
            'outstanding_amount' => max(0, (float) $this->amount - (float) $this->paid_amount),
            'status' => $this->status,
            'due_date' => $this->due_date?->toDateString(),
            'occurred_at' => $this->occurred_at?->toIso8601String(),
            'settled_at' => $this->settled_at?->toIso8601String(),
            'is_active' => (bool) $this->is_active,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
