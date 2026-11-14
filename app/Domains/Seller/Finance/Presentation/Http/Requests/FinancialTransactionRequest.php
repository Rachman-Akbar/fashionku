<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class FinancialTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'integer', 'exists:orders,id'],
            'user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'reference_number' => ['nullable', 'string', 'max:60', Rule::unique('financial_transactions', 'reference_number')->ignore($this->route('id'))],
            'type' => ['required', Rule::in(['income', 'expense', 'payable', 'receivable'])],
            'category' => ['nullable', Rule::in(['penjualan', 'bahan_baku', 'produksi', 'operasional', 'marketing', 'gaji', 'transportasi', 'sewa', 'utilitas', 'lainnya'])],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:5000'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', Rule::in(['draft', 'posted', 'open', 'partial', 'paid', 'cancelled'])],
            'due_date' => ['nullable', 'date'],
            'occurred_at' => ['required', 'date'],
            'is_active' => ['nullable', 'boolean'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
