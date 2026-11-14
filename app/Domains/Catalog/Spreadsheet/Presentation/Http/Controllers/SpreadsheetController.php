<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Spreadsheet\Presentation\Http\Controllers;

use App\Domains\Catalog\Spreadsheet\Application\Services\SpreadsheetModuleRegistry;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

final class SpreadsheetController extends Controller
{
    public function __construct(
        private SpreadsheetModuleRegistry $registry
    ) {}

    public function template(Request $request, string $module): BinaryFileResponse
    {
        $config = $this->registry->get($module);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');

        $columns = $config['columns'];
        $columnLetters = [];
        $colIndex = 0;

        foreach ($columns as $column) {
            $letter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(++$colIndex);
            $columnLetters[$column] = $letter;
            $sheet->setCellValue("{$letter}1", $column);
        }

        // Baris contoh
        $exampleRow = 2;
        foreach ($columns as $column) {
            $letter = $columnLetters[$column];
            $sheet->setCellValue("{$letter}{$exampleRow}", $this->exampleValue($column));
        }

        // Stil header
        $sheet->getStyle("A1:" . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns)) . "1")
            ->getFont()->setBold(true);
        $sheet->getStyle("A1:" . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns)) . "{$exampleRow}")
            ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        foreach (range('A', \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns))) as $letter) {
            $sheet->getColumnDimension($letter)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'tpl_') . '.xlsx';
        $writer->save($tempFile);

        $filename = "{$module}-template.xlsx";

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename*=UTF-8''{$filename}",
        ])->deleteFileAfterSend(true);
    }

    public function export(Request $request, string $module): BinaryFileResponse
    {
        $config = $this->registry->get($module);

        $ids = $request->validated()['ids'] ?? [];
        $columns = $config['columns'];

        $query = DB::table($config['entity']);
        if (! empty($ids)) {
            $query->whereIn('id', $ids);
        }

        $rows = $query->get()->map(fn ($row) => $row->toArray())->all();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Export');

        $colIndex = 0;
        $columnLetters = [];
        foreach ($columns as $column) {
            $letter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(++$colIndex);
            $columnLetters[$column] = $letter;
            $sheet->setCellValue("{$letter}1", $column);
        }

        $rowIndex = 2;
        foreach ($rows as $row) {
            foreach ($columns as $column) {
                $letter = $columnLetters[$column];
                $sheet->setCellValue("{$letter}{$rowIndex}", $row[$column] ?? '');
            }
            $rowIndex++;
        }

        $sheet->getStyle("A1:" . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns)) . "1")
            ->getFont()->setBold(true);

        foreach (range('A', \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns))) as $letter) {
            $sheet->getColumnDimension($letter)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'exp_') . '.xlsx';
        $writer->save($tempFile);

        $filename = "{$module}-export.xlsx";

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename*=UTF-8''{$filename}",
        ])->deleteFileAfterSend(true);
    }

    public function preview(Request $request, string $module): JsonResponse
    {
        $config = $this->registry->get($module);

        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
            'import_mode' => ['nullable', 'string', 'in:create,update,upsert'],
        ]);

        $file = $request->file('file');
        $importMode = $request->input('import_mode', 'upsert');

        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, false, true, true);

        if (empty($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'File kosong atau tidak dapat dibaca.',
            ], 422);
        }

        $headers = array_shift($rows);
        $headers = array_map(fn ($h) => trim((string) $h), $headers);

        $keyColumn = $config['fileKeyColumn'];
        $requiredColumns = $config['required'];
        $entity = $config['entity'];
        $keyDbColumn = $config['keyColumn'];

        $missingHeaders = array_diff($requiredColumns, $headers);
        if (! empty($missingHeaders)) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: ' . implode(', ', $missingHeaders),
            ], 422);
        }

        $totalRows = count($rows);
        $validRows = 0;
        $invalidRows = 0;
        $missingRelations = [];
        $blockingRelations = [];
        $previewRows = [];
        $seenKeys = [];

        $existingKeys = $this->getExistingKeys($entity, $keyDbColumn);

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = [];
            $errors = [];

            foreach ($headers as $colIndex => $header) {
                $data[$header] = $row[$colIndex + 1] ?? null;
            }

            $keyValue = trim((string) ($data[$keyColumn] ?? ''));
            if ($keyValue === '') {
                $errors[] = 'Kode wajib diisi';
                $invalidRows++;
            } elseif (! isset($seenKeys[$keyValue])) {
                $seenKeys[$keyValue] = true;

                if ($importMode === 'create' && isset($existingKeys[$keyValue])) {
                    $errors[] = 'Kode sudah terdaftar';
                    $invalidRows++;
                } elseif (($importMode === 'update' || $importMode === 'upsert') && ! isset($existingKeys[$keyValue])) {
                    if ($importMode === 'update') {
                        $errors[] = 'Kode tidak ditemukan';
                        $invalidRows++;
                    }
                }
            } else {
                $errors[] = "Kode duplikat dalam file: {$keyValue}";
                $invalidRows++;
            }

            foreach ($requiredColumns as $required) {
                if (! isset($data[$required]) || trim((string) $data[$required]) === '') {
                    $errors[] = "Kolom {$required} wajib diisi";
                }
            }

            if (empty($errors)) {
                $validRows++;
            } else {
                $invalidRows++;
            }

            $previewRows[] = [
                'row' => $rowNumber,
                'data' => $data,
                'errors' => $errors,
                'valid' => empty($errors),
            ];
        }

        $canContinue = $invalidRows === 0;
        $requiresConfirmation = $invalidRows > 0 && $validRows > 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_rows' => $totalRows,
                'valid_rows' => $validRows,
                'invalid_rows' => $invalidRows,
                'requires_confirmation' => $requiresConfirmation,
                'can_continue' => $canContinue,
                'missing_relations' => $missingRelations,
                'blocking_relations' => $blockingRelations,
                'preview' => $previewRows,
            ],
        ]);
    }

    public function import(Request $request, string $module): JsonResponse|BinaryFileResponse
    {
        $config = $this->registry->get($module);

        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
            'import_mode' => ['nullable', 'string', 'in:create,update,upsert'],
            'create_missing_relations' => ['nullable', 'boolean'],
        ]);

        $file = $request->file('file');
        $importMode = $request->input('import_mode', 'upsert');
        $createMissingRelations = (bool) $request->input('create_missing_relations', false);

        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, false, true, true);

        if (empty($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'File kosong atau tidak dapat dibaca.',
            ], 422);
        }

        $headers = array_shift($rows);
        $headers = array_map(fn ($h) => trim((string) $h), $headers);

        $keyColumn = $config['fileKeyColumn'];
        $keyDbColumn = $config['keyColumn'];
        $entity = $config['entity'];
        $requiredColumns = $config['required'];

        $missingHeaders = array_diff($requiredColumns, $headers);
        if (! empty($missingHeaders)) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: ' . implode(', ', $missingHeaders),
            ], 422);
        }

        $existingKeys = $this->getExistingKeys($entity, $keyDbColumn);
        $seenKeys = [];

        $successCount = 0;
        $errorCount = 0;
        $errorRows = [];

        DB::transaction(function () use (&$successCount, &$errorCount, &$errorRows, $rows, $headers, $config, $importMode, $existingKeys, $seenKeys, $keyColumn, $keyDbColumn, $entity, $requiredColumns, $createMissingRelations) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;
                $data = [];

                foreach ($headers as $colIndex => $header) {
                    $data[$header] = $row[$colIndex + 1] ?? null;
                }

                $keyValue = trim((string) ($data[$keyColumn] ?? ''));
                $errors = [];

                if ($keyValue === '') {
                    $errors[] = 'Kode wajib diisi';
                    $errorCount++;
                    $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => implode('; ', $errors)]);
                    continue;
                }

                if (isset($seenKeys[$keyValue])) {
                    $errors[] = "Kode duplikat dalam file: {$keyValue}";
                    $errorCount++;
                    $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => implode('; ', $errors)]);
                    continue;
                }
                $seenKeys[$keyValue] = true;

                $keyExists = isset($existingKeys[$keyValue]);

                if ($importMode === 'create' && $keyExists) {
                    $errors[] = 'Kode sudah terdaftar';
                    $errorCount++;
                    $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => implode('; ', $errors)]);
                    continue;
                }

                if (($importMode === 'update' || $importMode === 'upsert') && ! $keyExists) {
                    if ($importMode === 'update') {
                        $errors[] = 'Kode tidak ditemukan';
                        $errorCount++;
                        $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => implode('; ', $errors)]);
                        continue;
                    }
                    // upsert: create new
                }

                foreach ($requiredColumns as $required) {
                    if (! isset($data[$required]) || trim((string) $data[$required]) === '') {
                        $errors[] = "Kolom {$required} wajib diisi";
                    }
                }

                if (! empty($errors)) {
                    $errorCount++;
                    $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => implode('; ', $errors)]);
                    continue;
                }

                try {
                    $payload = $this->buildPayload($config, $data);

                    if ($keyExists) {
                        DB::table($entity)->where($keyDbColumn, $keyValue)->update($payload);
                    } else {
                        $payload['created_at'] = now();
                        $payload['updated_at'] = now();
                        DB::table($entity)->insert($payload);
                    }

                    $successCount++;
                } catch (\Throwable $e) {
                    Log::error("Spreadsheet import error for {$module}/{$keyValue}: " . $e->getMessage());
                    $errorCount++;
                    $errorRows[] = array_merge($data, ['_row' => $rowNumber, '_errors' => $e->getMessage()]);
                }
            }
        });

        if ($errorCount > 0) {
            return $this->sendErrorFile($module, $errorRows, $successCount, $errorCount);
        }

        return response()->json([
            'success' => true,
            'message' => 'Import selesai.',
            'data' => [
                'success_count' => $successCount,
                'error_count' => $errorCount,
            ],
        ]);
    }

    public function bulkDelete(Request $request, string $module): JsonResponse
    {
        $config = $this->registry->get($module);

        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer'],
        ]);

        $ids = $request->input('ids');

        $deleted = DB::table($config['entity'])
            ->whereIn('id', $ids)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus.',
            'data' => [
                'deleted_count' => $deleted,
            ],
        ]);
    }

    private function getExistingKeys(string $entity, string $keyColumn): array
    {
        $rows = DB::table($entity)->pluck($keyColumn, $keyColumn);

        return $rows->all();
    }

    private function buildPayload(array $config, array $data): array
    {
        $columns = $config['columns'];
        $payload = [];

        foreach ($columns as $column) {
            if (isset($data[$column]) && $data[$column] !== '') {
                $payload[$column] = $this->castValue($column, $data[$column]);
            }
        }

        $payload['updated_at'] = now();

        return $payload;
    }

    private function castValue(string $column, mixed $value): mixed
    {
        $numericColumns = ['stok_awal', 'biaya_satuan', 'stok_minimum', 'harga', 'berat', 'stok_tersedia', 'stok_reserved', 'stok_booked', 'stok_preorder', 'jumlah'];
        $booleanColumns = ['aktif'];

        if (in_array($column, $numericColumns, true)) {
            return $value === '' ? null : (float) $value;
        }

        if (in_array($column, $booleanColumns, true)) {
            return in_array(strtolower((string) $value), ['1', 'true', 'yes', 'ya', 'aktif'], true);
        }

        return $value;
    }

    private function sendErrorFile(string $module, array $errorRows, int $successCount, int $errorCount): BinaryFileResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Import Error');

        if (empty($errorRows)) {
            $sheet->setCellValue('A1', 'Tidak ada baris error.');
        } else {
            $firstRow = $errorRows[0];
            $headers = array_keys($firstRow);
            $colIndex = 0;
            $columnLetters = [];

            foreach ($headers as $header) {
                $letter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(++$colIndex);
                $columnLetters[$header] = $letter;
                $sheet->setCellValue("{$letter}1", $header);
            }

            $rowIndex = 2;
            foreach ($errorRows as $errorRow) {
                foreach ($headers as $header) {
                    $letter = $columnLetters[$header];
                    $sheet->setCellValue("{$letter}{$rowIndex}", $errorRow[$header] ?? '');
                }
                $rowIndex++;
            }

            $sheet->getStyle("A1:" . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($headers)) . "1")
                ->getFont()->setBold(true);

            foreach (range('A', \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($headers))) as $letter) {
                $sheet->getColumnDimension($letter)->setAutoSize(true);
            }
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'err_') . '.xlsx';
        $writer->save($tempFile);

        $filename = "{$module}-import-error.xlsx";

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename*=UTF-8''{$filename}",
            'x-import-success-count' => (string) $successCount,
            'x-import-error-count' => (string) $errorCount,
        ])->deleteFileAfterSend(true);
    }
}
