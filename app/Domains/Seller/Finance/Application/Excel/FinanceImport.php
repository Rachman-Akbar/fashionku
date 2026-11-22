<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FinanceImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = \App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel::class;
    protected string $uniqueKey = 'kode_keuangan';

    protected array $relationMappings = [
        'kode_referensi' => [
            'model' => OrderModel::class,
            'search_column' => 'order_number',
            'target_column' => 'order_id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
        'pihak_ke' => [
            'model' => User::class,
            'search_column' => 'name',
            'target_column' => 'user_id',
            'target_key' => 'id',
            'create_missing' => true,
        ],
    ];

    public function model(): string
    {
        return \App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_keuangan';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'reference_number';
    }

    public function rules(): array
    {
        return [
            'kode_keuangan' => 'required|string|max:100',
            'tanggal' => 'nullable|date_format:Y-m-d',
            'kategori' => 'nullable|string|max:100',
            'tipe' => 'nullable|in:income,expense,receivable,payable',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric|min:0',
            'terbayar' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:pending,partial,paid,overdue,cancelled',
            'jatuh_tempo' => 'nullable|date_format:Y-m-d',
            'tanggal_terbayar' => 'nullable|date_format:Y-m-d',
            'kode_referensi' => 'nullable|string|max:50',
            'pihak_ke' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['kode_keuangan'])) {
            $errors['kode_keuangan'] = 'Kode keuangan wajib diisi';
        }

        if (empty($row['judul'])) {
            $errors['judul'] = 'Judul transaksi wajib diisi';
        }

        if (! isset($row['jumlah']) || $row['jumlah'] < 0) {
            $errors['jumlah'] = 'Jumlah tidak valid';
        }

        if (isset($row['terbayar']) && $row['terbayar'] > ($row['jumlah'] ?? 0)) {
            $errors['terbayar'] = 'Terbayar tidak boleh melebihi jumlah';
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = [
            'reference_number' => strtolower(trim($data['kode_keuangan'] ?? '')),
            'type' => $data['tipe'] ?? 'expense',
            'category' => strtolower(trim($data['kategori'] ?? '')),
            'title' => $data['judul'] ?? '',
            'description' => $data['deskripsi'] ?? '',
            'amount' => (float) ($data['jumlah'] ?? 0),
            'paid_amount' => (float) ($data['terbayar'] ?? 0),
            'status' => $data['status'] ?? 'pending',
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ];

        if (isset($data['tanggal']) && $data['tanggal']) {
            $payload['occurred_at'] = \Carbon\Carbon::parse($data['tanggal'])->startOfDay();
        }

        if (isset($data['jatuh_tempo']) && $data['jatuh_tempo']) {
            $payload['due_date'] = \Carbon\Carbon::parse($data['jatuh_tempo'])->startOfDay();
        }

        if (isset($data['tanggal_terbayar']) && $data['tanggal_terbayar']) {
            $payload['settled_at'] = \Carbon\Carbon::parse($data['tanggal_terbayar'])->startOfDay();
        }

        return $payload;
    }
}
