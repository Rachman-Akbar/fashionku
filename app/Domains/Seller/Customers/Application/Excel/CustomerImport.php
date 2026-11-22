<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = User::class;
    protected string $uniqueKey = 'kode_pelanggan';
    protected bool $extractImages = true;
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'avatar';
    protected string $imageStoragePath = 'customers/imports';

    public function model(): string
    {
        return User::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_pelanggan';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'code'; // This is in seller_customers table
    }

    public function rules(): array
    {
        return [
            'kode_pelanggan' => 'required|string|max:100',
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'catatan' => 'nullable|string',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['kode_pelanggan'])) {
            $errors['kode_pelanggan'] = 'Kode pelanggan wajib diisi';
        }

        if (empty($row['nama'])) {
            $errors['nama'] = 'Nama pelanggan wajib diisi';
        }

        if (! empty($row['email']) && ! filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Format email tidak valid';
        }

        return $errors;
    }

    protected function findExisting(string $uniqueValue)
    {
        return DB::table('seller_customers')
            ->join('users', 'users.id', '=', 'seller_customers.user_id')
            ->where('seller_customers.code', $uniqueValue)
            ->where('users.is_active', true)
            ->first();
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        // Kode pelanggan disimpan apa adanya (biasanya huruf besar, mis.
        // CUST-0001); hanya email yang memang case-insensitive.
        $code = trim($data['kode_pelanggan'] ?? '');
        $name = $data['nama'] ?? '';
        $email = strtolower(trim($data['email'] ?? ''));
        $phone = $data['telepon'] ?? '';
        $address = $data['alamat'] ?? '';
        $notes = $data['catatan'] ?? '';
        $isActive = $this->parseBoolean($data['aktif'] ?? true);

        $payload = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'is_active' => $isActive,
            'has_set_password' => false,
            'is_email_verified' => false,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ];

        // Store customer-specific data for later use
        $payload['_customer_code'] = $code;
        $payload['_customer_notes'] = $notes;

        return $payload;
    }

    protected function parseBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        $value = strtolower(trim((string) $value));
        return in_array($value, ['ya', 'true', '1', 'yes'], true);
    }

    public function collection(Collection $rows): void
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                try {
                    // Savepoint per baris: kalau satu baris gagal di tengah
                    // (mis. insert user sukses tapi seller_customers gagal),
                    // baris itu di-rollback dan tidak meninggalkan data yatim.
                    // Di dalam DB::transaction() Laravel memakai SAVEPOINT.
                    DB::beginTransaction();
                    $data = $row->toArray();
                    $data = $this->normalizeData($data);

                    $uniqueValue = $this->getUniqueValue($data);
                    if (! $uniqueValue) {
                        throw new \InvalidArgumentException("Kode pelanggan wajib diisi");
                    }

                    $existing = $this->findExisting($uniqueValue);

                    $payload = $this->preparePayload($data, $existing);

                    if ($this->extractImages) {
                        $this->extractAndSaveImage($rowNumber, $payload);
                    }

                    $customerCode = $payload['_customer_code'];
                    $customerNotes = $payload['_customer_notes'];
                    unset($payload['_customer_code'], $payload['_customer_notes']);

                    $userId = null;

                    if ($existing) {
                        $userId = $existing->id;
                        // Update user
                        User::where('id', $userId)->update($payload);
                        // Update seller_customers
                        DB::table('seller_customers')
                            ->where('user_id', $userId)
                            ->update([
                                'code' => $customerCode,
                                'note' => $customerNotes,
                                'updated_by' => auth()->id(),
                            ]);
                    } else {
                        // Create user
                        $user = User::create($payload);
                        $userId = $user->id;

                        // Create seller_customers record
                        DB::table('seller_customers')->insert([
                            'user_id' => $userId,
                            'code' => $customerCode,
                            'note' => $customerNotes,
                            'created_by' => auth()->id(),
                            'updated_by' => auth()->id(),
                        ]);
                    }

                    $this->importedCount++;
                    DB::commit();
                } catch (\Throwable $e) {
                    DB::rollBack();
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    \Illuminate\Support\Facades\Log::error("Customer import error at row {$rowNumber}: " . $e->getMessage());
                }
            }
        });
    }

    protected function extractAndSaveImage(int $rowNumber, array &$payload): void
    {
        if (! isset($this->spreadsheet)) {
            return;
        }

        $sheet = $this->spreadsheet->getActiveSheet();
        $coordinate = $this->getColumnLetter($this->imageColumnIndex) . ($rowNumber + 1);
        $drawings = $sheet->getDrawingCollection();

        foreach ($drawings as $drawing) {
            if ($drawing->getCoordinates() === $coordinate) {
                $imagePath = $this->saveDrawing($drawing, $rowNumber);
                if ($imagePath) {
                    $payload['avatar'] = $imagePath;
                }
                break;
            }
        }
    }

    protected function saveDrawing($drawing, int $rowNumber): ?string
    {
        try {
            $extension = $this->getExtension($drawing);
            $filename = 'customer_import_' . $rowNumber . '_' . time() . '.' . $extension;
            $path = $this->imageStoragePath . '/' . $filename;

            if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
                $content = $drawing->getImageResource();
                if ($content) {
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, $content);
                    return $path;
                }
            } else {
                $sourcePath = $drawing->getPath();
                if ($sourcePath && file_exists($sourcePath)) {
                    $content = file_get_contents($sourcePath);
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, $content);
                    return $path;
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to save image for row {$rowNumber}: " . $e->getMessage());
        }

        return null;
    }

    protected function getExtension($drawing): string
    {
        if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
            return 'png';
        }

        $path = $drawing->getPath();
        if ($path) {
            return pathinfo($path, PATHINFO_EXTENSION) ?: 'png';
        }

        return 'png';
    }

    protected function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)) . $letter;
            $index = intdiv($index, 26) - 1;
        }
        return $letter;
    }
}
