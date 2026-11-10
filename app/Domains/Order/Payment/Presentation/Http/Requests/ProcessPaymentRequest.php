<?php

namespace App\Domains\Order\Payment\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_number' => 'required|string|exists:orders,order_number',
            'payment_method' => 'required|string|in:midtrans,transfer_manual,cod,tunai_toko',
        ];
    }

    public function messages(): array
    {
        return [
            'order_number.exists' => 'Nomor pesanan tidak valid atau tidak terdaftar.',
            'payment_method.in' => 'Metode pembayaran yang dipilih tidak didukung.',
        ];
    }
}
