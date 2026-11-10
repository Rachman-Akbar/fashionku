<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class TicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $activeRole = strtolower(trim((string) $this->attributes->get('active_role', '')));

        if ($activeRole === '') {
            $ability = collect($this->user()?->currentAccessToken()?->abilities ?? [])
                ->first(fn (mixed $value): bool => is_string($value) && str_starts_with($value, 'active-role:'));
            $activeRole = is_string($ability) ? strtolower(trim(substr($ability, 12))) : 'buyer';
        }

        return [
            'user_id' => $activeRole === 'admin'
                ? ['nullable', 'uuid', 'exists:users,id']
                : ['prohibited'],
            'seller_id' => ['prohibited'],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'order_id' => ['nullable', 'integer', 'exists:orders,id'],
            'category' => ['required', Rule::in(['order', 'payment', 'product', 'store', 'account', 'technical', 'other'])],
            'subject' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string', 'max:10000'],
            'priority' => ['nullable', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['string', 'max:2048'],
        ];
    }
}
