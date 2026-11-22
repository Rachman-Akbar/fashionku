<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerExport extends BaseExport
{
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'avatar';
    protected int $imageWidth = 80;
    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $customers = null) {}

    public function collection(): Collection
    {
        if ($this->customers) {
            return $this->customers;
        }

        return DB::table('users')
            ->join('seller_customers', 'seller_customers.user_id', '=', 'users.id')
            ->leftJoin('addresses as primary_address', function ($join): void {
                $join->on('primary_address.user_id', '=', 'users.id')
                    ->where('primary_address.is_primary', true);
            })
            ->select(
                'users.id',
                'users.name',
                'users.email',
                // Telepon & alamat tinggal di tabel addresses, bukan di users.
                'primary_address.phone_number as phone',
                'users.avatar',
                'primary_address.full_address as address',
                'seller_customers.code as customer_code',
                'seller_customers.note as notes'
            )
            ->where('users.is_active', true)
            ->get();
    }

    public function headings(): array
    {
        return [
            'kode_pelanggan',
            'avatar',
            'nama',
            'email',
            'telepon',
            'alamat',
            'catatan',
            'aktif',
        ];
    }

    public function map($customer): array
    {
        return [
            $customer->customer_code ?? '',
            $customer->avatar ?? '',
            $customer->name ?? '',
            $customer->email ?? '',
            $customer->phone ?? '',
            $customer->address ?? '',
            $customer->notes ?? '',
            'ya',
        ];
    }
}
