<?php

namespace App\Domains\Order\Ordering\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
            'cart_item_ids' => ['nullable', 'array', 'min:1', 'required_without:items'],
            'cart_item_ids.*' => ['required', 'integer', 'distinct'],
            'items' => ['nullable', 'array', 'min:1', 'required_without:cart_item_ids'],
            'items.*.product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'courier' => ['required', 'string', 'max:50', 'not_in:ambil_sendiri,pickup'],
            'service' => ['nullable', 'string', 'max:100'],
            'payment_method' => ['required', 'string', 'in:midtrans,transfer_manual,cod'],
            'voucher_code' => ['nullable', 'string', 'max:100'],
            'order_type' => ['nullable', 'string', 'in:normal,preorder,booking'],
            'preorder_release_at' => ['nullable', 'date', 'after:now'],
            'scheduled_at' => ['nullable', 'required_if:order_type,booking', 'date', 'after:now'],
        ];
    }
}
