<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class UserExport extends BaseExport
{
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'avatar';
    protected int $imageWidth = 80;
    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $users = null) {}

    public function collection(): Collection
    {
        return $this->users ?? User::query()
            ->leftJoin('addresses as primary_address', function ($join): void {
                $join->on('primary_address.user_id', '=', 'users.id')
                    ->where('primary_address.is_primary', true);
            })
            ->select('users.*', 'primary_address.phone_number as phone_number')
            ->with('roles')
            ->get();
    }

    public function headings(): array
    {
        return [
            'avatar',
            'nama',
            'email',
            'telepon',
            'username',
            'role',
            'status_aktif',
            'email_verified',
            'catatan',
        ];
    }

    public function map($user): array
    {
        return [
            $user->avatar ?? '',
            $user->name ?? '',
            $user->email ?? '',
            $user->phone_number ?? '',
            $user->name ?? '', // username = name in this system
            $user->roles->pluck('name')->implode(', '),
            $user->is_active ? 'ya' : 'tidak',
            $user->is_email_verified ? 'ya' : 'tidak',
            '',
        ];
    }
}
