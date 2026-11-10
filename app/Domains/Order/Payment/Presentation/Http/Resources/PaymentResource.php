<?php

namespace App\Domains\Order\Payment\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->orderNumber,
            'transaction_id' => $this->transactionId,
            'payment_method' => $this->paymentMethod,
            'amount' => $this->amount,
            'status' => $this->status,
            'created_at' => $this->payload['created_at'] ?? null,
        ];
    }
}
