<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class MyVoucherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'claimedAt' => $this->claimed_at?->toDateTimeString(),
            'usedAt' => $this->used_at?->toDateTimeString(),
            'sourceType' => $this->source_type,
            'sourceId' => $this->source_id !== null ? (int) $this->source_id : null,
            'voucher' => $this->voucher ? new VoucherResource($this->voucher) : null,
        ];
    }
}
