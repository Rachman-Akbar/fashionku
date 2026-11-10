<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class OtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'challenge_id' => ['required', 'string', 'uuid'],
            'code' => ['required', 'string', 'digits:6'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'challenge_id.required' => 'ID challenge wajib diisi.',
            'challenge_id.uuid' => 'Format challenge ID tidak valid.',
            'code.required' => 'Kode verifikasi wajib diisi.',
            'code.digits' => 'Kode verifikasi harus 6 digit.',
        ];
    }
}