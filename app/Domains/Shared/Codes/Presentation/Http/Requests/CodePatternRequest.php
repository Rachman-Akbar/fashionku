<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Presentation\Http\Requests\CodePatternRequest;

use App\Domains\Shared\Codes\Application\Services\CodePatternFormatter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CodePatternRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'patterns' => ['required', 'array', 'min:1'],
            'patterns.*' => [
                'nullable',
                'string',
                'max:120',
                Rule::in(array_keys(CodePatternFormatter::LABELS)),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'patterns.*.in' => 'Tipe kode pada rumus tidak dikenal.',
        ];
    }
}
