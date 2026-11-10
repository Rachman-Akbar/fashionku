<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateManualOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'order_number' => ['nullable', 'string', 'max:60', 'regex:/^[A-Za-z0-9._\-\/]+$/', Rule::unique('orders', 'order_number')],
            'customer_name' => ['nullable', 'string', 'max:150'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:1000'],
            'courier' => ['required', 'string', 'max:50'],
            'service' => ['nullable', 'string', 'max:100'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'in:tunai_toko,transfer_manual,cod,manual'],
            'payment_status' => ['nullable', 'string', 'in:paid,unpaid,pending'],
            'status' => ['nullable', 'string', 'in:pending,processing,shipped,received,completed'],
            'order_type' => ['nullable', 'string', 'in:normal,preorder,booking'],
            'preorder_release_at' => ['nullable', 'date', 'after:now'],
            'scheduled_at' => ['nullable', 'required_if:order_type,booking', 'date', 'after:now'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ];
    }
}
