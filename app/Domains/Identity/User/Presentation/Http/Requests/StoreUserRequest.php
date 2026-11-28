<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Requests;

use App\Domains\Identity\User\Presentation\Http\Requests\Concerns\ResolvesRoleInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class StoreUserRequest extends FormRequest
{
    use ResolvesRoleInput;

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

        // User baru selalu ber-role (default buyer): user tanpa role tidak bisa
        // masuk dan tidak bisa menjadi data pelanggan.
        $data = [...$data, ...$this->resolveRoleInput(true)];

        $this->merge($data);
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'name' => ['required', 'string', 'max:255'],
            'firebase_uid' => ['nullable', 'string', 'max:255', 'unique:users,firebase_uid'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'is_email_verified' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'role' => ['sometimes', 'string', Rule::in(self::ROLE_NAMES)],
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
