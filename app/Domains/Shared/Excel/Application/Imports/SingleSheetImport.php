<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Application\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

/**
 * Membungkus satu BaseImport agar hanya sheet pertama yang diproses.
 *
 * Tanpa ini Laravel Excel memproses SEMUA sheet pada file, termasuk
 * "contoh import" dan "penjelasan kolom" dari template, sehingga import
 * yang seharusnya sukses melaporkan puluhan error validasi palsu.
 *
 * Validasi & onFailure diteruskan ke import aslinya supaya hitungan
 * sukses/gagal tetap satu sumber.
 */
final class SingleSheetImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsEmptyRows
{
    public function __construct(private BaseImport $import) {}

    public function collection(Collection $rows): void
    {
        $this->import->collection($rows);
    }

    public function headingRow(): int
    {
        return $this->import->headingRow();
    }

    public function rules(): array
    {
        return $this->import->rules();
    }

    public function customValidationMessages(): array
    {
        return $this->import->customValidationMessages();
    }

    public function customValidationAttributes(): array
    {
        return $this->import->customValidationAttributes();
    }

    public function onFailure(Failure ...$failures): void
    {
        $this->import->onFailure(...$failures);
    }
}
