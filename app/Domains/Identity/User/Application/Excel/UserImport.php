<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Excel;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UserImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = User::class;
    protected string $uniqueKey = 'email';
    protected bool $extractImages = true;
    protected int $imageColumnIndex = 0;
    protected string $imagePathColumn = 'avatar';
    protected string $imageStoragePath = 'users/imports';

    protected array $relationMappings = [
        'role' => [
            'model' => Role::class,
            'search_column' => 'name',
            'target_column' => 'role_id', // This is handled separately via pivot
            'target_key' => 'id',
            'create_missing' => true,
        ],
    ];

    public function model(): string
    {
        return User::class;
    }

    public function uniqueKey(): string
    {
        return 'email';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'email';
    }

    public function rules(): array
    {
        return [
            'avatar' => 'nullable',
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'telepon' => 'nullable|string|max:20',
            'username' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'status_aktif' => 'nullable|in:ya,tidak,true,false,1,0',
            'email_verified' => 'nullable|in:ya,tidak,true,false,1,0',
            'catatan' => 'nullable|string',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['nama'])) {
            $errors['nama'] = 'Nama wajib diisi';
        }

        if (empty($row['email'])) {
            $errors['email'] = 'Email wajib diisi';
        } elseif (! filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Format email tidak valid';
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = [
            'name' => $data['nama'] ?? '',
            'email' => strtolower(trim($data['email'] ?? '')),
            'phone' => $data['telepon'] ?? '',
            'is_active' => $this->parseBoolean($data['status_aktif'] ?? true),
            'is_email_verified' => $this->parseBoolean($data['email_verified'] ?? false),
            'has_set_password' => false,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ];

        if ($existing) {
            unset($payload['has_set_password']);
        }

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
                    $data = $row->toArray();
                    $data = $this->normalizeData($data);

                    $uniqueValue = $this->getUniqueValue($data);
                    if (! $uniqueValue) {
                        throw new \InvalidArgumentException("Email wajib diisi");
                    }

                    $existing = $this->findExisting($uniqueValue);

                    $payload = $this->preparePayload($data, $existing);

                    if ($this->extractImages) {
                        $this->extractAndSaveImage($rowNumber, $payload);
                    }

                    $roleName = $data['role'] ?? null;

                    if ($existing) {
                        $existing->update($payload);
                        $userId = $existing->id;
                    } else {
                        $user = User::create($payload);
                        $userId = $user->id;
                    }

                    // Handle role assignment
                    $roleName = strtolower(trim((string) ($roleName ?: 'buyer')));
                    $roleName = $roleName === 'seller' ? 'admin' : $roleName;

                    if (! in_array($roleName, ['admin', 'buyer'], true)) {
                        throw new \InvalidArgumentException("Role {$roleName} tidak didukung; gunakan admin atau buyer.");
                    }

                    $role = Role::whereRaw('LOWER(TRIM(name)) = ?', [$roleName])->first();

                    if (! $role && config('excel.import.create_missing_roles', true)) {
                        $role = Role::create([
                            'name' => $roleName,
                            'guard_name' => 'web',
                            'is_active' => true,
                            'created_by' => auth()->id(),
                            'updated_by' => auth()->id(),
                        ]);
                    }

                    if ($role) {
                        DB::table('user_roles')->updateOrInsert(
                            ['user_id' => $userId, 'role_id' => $role->id],
                            ['created_at' => now(), 'updated_at' => now()]
                        );
                    }

                    $this->importedCount++;
                } catch (\Throwable $e) {
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    \Illuminate\Support\Facades\Log::error("User import error at row {$rowNumber}: " . $e->getMessage());
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
            $filename = 'user_import_' . $rowNumber . '_' . time() . '.' . $extension;
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
