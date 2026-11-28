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
        // Kode pelanggan adalah kunci unik; kolom dipilih eksplisit supaya
        // `id` yang terbaca adalah id user (bukan id baris seller_customers).
        return DB::table('seller_customers')
            ->join('users', 'users.id', '=', 'seller_customers.user_id')
            ->where('seller_customers.code', $uniqueValue)
            ->where('users.is_active', true)
            ->first(['users.id as id', 'users.email as email', 'seller_customers.code as code']);
    }

    /**
     * Fallback pencocokan: kode pelanggan tidak ada, tetapi email sudah
     * terdaftar. Dipakai supaya impor tidak membuat user/baris pelanggan
     * kedua untuk orang yang sama (1 user = 1 pelanggan).
     */
    protected function findExistingUserByEmail(mixed $email): ?object
    {
        $email = strtolower(trim((string) $email));

        if ($email === '') {
            return null;
        }

        $withCustomer = DB::table('users')
            ->join('seller_customers', 'seller_customers.user_id', '=', 'users.id')
            ->where('users.email', $email)
            ->first(['users.id as id', 'users.email as email', 'seller_customers.code as code']);

        if ($withCustomer !== null) {
            return $withCustomer;
        }

        return DB::table('users')->where('email', $email)->first(['users.id as id', 'users.email as email']);
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

    /**
     * Satu user hanya boleh punya satu baris pelanggan, jadi baris yang sudah
     * ada selalu diperbarui, bukan digandakan.
     */
    private function upsertCustomerRecord(string $userId, string $code, ?string $note): void
    {
        $now = now();

        if (DB::table('seller_customers')->where('user_id', $userId)->exists()) {
            DB::table('seller_customers')->where('user_id', $userId)->update([
                'code' => $code,
                'note' => $note,
                'updated_by' => auth()->id(),
                'updated_at' => $now,
            ]);

            return;
        }

        DB::table('seller_customers')->insert([
            'user_id' => $userId,
            'code' => $code,
            'note' => $note,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    /**
     * Baris pelanggan selalu menunjuk user ber-role buyer.
     */
    private function assignBuyerRole(string $userId): void
    {
        $roleId = DB::table('roles')
            ->where('name', 'buyer')
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if ($roleId === null) {
            return;
        }

        DB::table('user_roles')->updateOrInsert(
            ['user_id' => $userId, 'role_id' => $roleId],
            ['created_at' => now(), 'updated_at' => now()]
        );
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

                    $existing = $this->findExisting($uniqueValue)
                        ?? $this->findExistingUserByEmail($data['email'] ?? '');

                    $payload = $this->preparePayload($data, $existing);

                    if ($this->extractImages) {
                        $this->extractAndSaveImage($rowNumber, $payload);
                    }

                    $customerCode = $payload['_customer_code'];
                    $customerNotes = $payload['_customer_notes'];
                    unset($payload['_customer_code'], $payload['_customer_notes']);

                    if ($existing) {
                        // Kode lama bisa berbeda dengan kode di file; baris
                        // pelanggan user ini tetap satu-satunya (tidak digandakan).
                        $userId = (string) $existing->id;
                        // Query builder tidak menghormati $fillable, jadi kolom
                        // template yang memang tidak ada di users (telepon,
                        // alamat) dibuang dulu supaya baris impor tidak gagal.
                        $userPayload = array_intersect_key(
                            $payload,
                            array_flip($this->modelInstance()->getFillable())
                        );
                        User::where('id', $userId)->update($userPayload);
                        $this->upsertCustomerRecord($userId, $customerCode, $customerNotes);
                    } else {
                        // users.email unique + NOT NULL: baris tanpa email tetap
                        // butuh alamat unik agar impor banyak pelanggan tidak
                        // gagal di baris kedua karena duplikat email kosong.
                        if (trim((string) ($payload['email'] ?? '')) === '') {
                            $payload['email'] = strtolower($customerCode).'@pelanggan.local';
                        }

                        $user = User::create($payload);
                        $userId = (string) $user->id;

                        // Data pelanggan wajib mempunyai user dengan role buyer.
                        $this->assignBuyerRole($userId);
                        $this->upsertCustomerRecord($userId, $customerCode, $customerNotes);
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
