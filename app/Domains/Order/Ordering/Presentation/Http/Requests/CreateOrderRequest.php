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
        $courier = strtolower(trim((string) $this->input('courier')));
        $isPickup = in_array($courier, ['ambil_sendiri', 'pickup', 'ambil-sendiri'], true);

        return [
            // Alamat hanya wajib untuk pengiriman ("Diantar"). Pembeli yang memilih
            // "Diambil Pembeli" cukup mengisi jadwal pengambilan (survey).
            'address_id' => [
                $isPickup ? 'nullable' : 'required',
                'integer',
                'exists:addresses,id',
            ],
            'cart_item_ids' => ['nullable', 'array', 'min:1', 'required_without:items'],
            'cart_item_ids.*' => ['required', 'integer', 'distinct'],
            'items' => ['nullable', 'array', 'min:1', 'required_without:cart_item_ids'],
            'items.*.product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'courier' => ['required', 'string', 'max:50'],
            'service' => ['nullable', 'string', 'max:100'],
            'payment_method' => ['required', 'string', 'in:midtrans,transfer_manual,cod,qris,tunai_toko'],
            'voucher_code' => ['nullable', 'string', 'max:100'],
            'order_type' => ['nullable', 'string', 'in:reguler,terjadwal,normal,booking,preorder'],
            'preorder_release_at' => ['nullable', 'date', 'after:now'],
            'scheduled_at' => ['nullable', 'required_if:order_type,terjadwal', 'required_if:order_type,booking', 'date', 'after:now'],
            'pickup_at' => [$isPickup ? 'required' : 'nullable', 'date', 'after:now'],
            'pickup_note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
