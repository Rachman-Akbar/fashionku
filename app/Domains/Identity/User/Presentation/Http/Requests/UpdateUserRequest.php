<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('email')) {
            $data['email'] = Str::lower(trim((string) $this->input('email')));
        }

        if ($this->has('name')) {
            $data['name'] = trim((string) $this->input('name'));
        }

        foreach (['is_email_verified', 'is_active'] as $field) {
            if ($this->has($field)) {
                $data[$field] = $this->boolean($field);
            }
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        $userId = (string) $this->route('id');

        return [
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:8'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'firebase_uid' => ['nullable', 'string', 'max:255', Rule::unique('users', 'firebase_uid')->ignore($userId)],
            'avatar' => ['nullable', 'string', 'max:255'],
            'is_email_verified' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'banned_at' => ['sometimes', 'nullable', 'date'],
            'message' => ['nullable', 'string', 'max:1000'],
            'verification_code' => ['sometimes', 'string', 'digits:6'],
            'role_ids' => ['nullable', 'array'],
            'role_ids.*' => [
                'integer',
                Rule::exists('roles', 'id')->where(fn ($query) => $query
                    ->where('is_active', true)
                    ->whereNull('deleted_at')),
            ],
        ];
    }
}
