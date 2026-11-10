<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', Rule::in(['direct', 'order', 'store'])],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'order_id' => ['nullable', 'integer', 'exists:orders,id'],
            'subject' => ['nullable', 'string', 'max:180'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['uuid', 'distinct', 'exists:users,id'],
        ];
    }
}
