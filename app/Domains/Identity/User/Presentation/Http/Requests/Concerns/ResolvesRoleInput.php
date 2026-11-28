<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Requests\Concerns;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Frontend mengirim role sebagai nama (`role: "buyer"`), sedangkan DTO
 * (`CreateUserDTO` / `UpdateUserDTO`) hanya memahami `role_ids`.
 *
 * Trait ini menerjemahkan nama role → id role supaya kebijakan role benar-benar
 * tersimpan (sebelumnya field `role` diabaikan sehingga user yang dibuat admin
 * tidak mempunyai role sama sekali dan tidak bisa menjadi data pelanggan).
 */
trait ResolvesRoleInput
{
    /** @var array<int, string> */
    public const ROLE_NAMES = ['buyer', 'seller', 'admin'];

    /**
     * @param  bool  $defaultToBuyer  isi role buyer bila request tidak menyebut role sama sekali
     * @return array<string, mixed>
     */
    protected function resolveRoleInput(bool $defaultToBuyer): array
    {
        if ($this->request->has('role_ids')) {
            // Sudah eksplisit dalam bentuk id; serahkan pada aturan validasi.
            return [];
        }

        $role = Str::lower(trim((string) $this->input('role')));

        if ($role === '') {
            if (! $defaultToBuyer) {
                return [];
            }

            $role = 'buyer';
        }

        if (! in_array($role, self::ROLE_NAMES, true)) {
            // Tidak dikenal: biarkan aturan validasi `role` yang menolak.
            return [];
        }

        return ['role_ids' => [$this->resolveRoleId($role)]];
    }

    private function resolveRoleId(string $role): int
    {
        $activeId = DB::table('roles')
            ->where('name', $role)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if ($activeId !== null) {
            return (int) $activeId;
        }

        // Baris dengan nama sama mungkin pernah dinonaktifkan/dihapus lembut;
        // unique index pada `roles.name` membuat insert baru mustahil, jadi
        // baris lama dipakai ulang.
        $existingId = DB::table('roles')->where('name', $role)->value('id');

        if ($existingId !== null) {
            DB::table('roles')->where('id', $existingId)->update([
                'is_active' => true,
                'deleted_at' => null,
                'updated_at' => now(),
            ]);

            return (int) $existingId;
        }

        return (int) DB::table('roles')->insertGetId([
            'name' => $role,
            'description' => 'Role '.$role,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
