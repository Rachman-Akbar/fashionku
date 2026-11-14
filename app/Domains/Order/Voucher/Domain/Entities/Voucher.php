<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Domain\Entities;

use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class Voucher extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'vouchers';

    protected $fillable = [
        'code',
        'name',
        'image',
        'discount_target',
        'discount_type',
        'discount_value',
        'min_spend',
        'min_items',
        'min_distinct_products',
        'terms',
        'max_discount',
        'starts_at',
        'ends_at',
        'is_active',
        'usage_limit',
        'used_count',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'discount_value' => 'float',
        'min_spend' => 'float',
        'min_items' => 'integer',
        'min_distinct_products' => 'integer',
        'terms' => 'string',
        'max_discount' => 'float',
        'is_active' => 'boolean',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        self::saving(function (Voucher $voucher): void {
            if (! in_array($voucher->discount_target, ['product', 'shipping'], true)) {
                throw new InvalidArgumentException('Target diskon voucher tidak valid.');
            }

            if (! in_array($voucher->discount_type, ['fixed', 'percentage'], true)) {
                throw new InvalidArgumentException('Tipe diskon voucher tidak valid.');
            }

            if ($voucher->discount_value <= 0) {
                throw new InvalidArgumentException('Nilai diskon harus lebih besar dari 0.');
            }

            if ($voucher->discount_type === 'percentage' && $voucher->discount_value > 100) {
                throw new InvalidArgumentException('Diskon persentase tidak boleh melebihi 100%.');
            }

            if ($voucher->ends_at->isBefore($voucher->starts_at)) {
                throw new InvalidArgumentException('Tanggal berakhir harus setelah tanggal mulai.');
            }
        });
    }

    protected function code(): Attribute
    {
        return Attribute::make(set: fn (mixed $value): string => Str::lower(trim((string) $value)));
    }

    protected function name(): Attribute
    {
        return Attribute::make(set: fn (mixed $value): string => trim((string) preg_replace('/\s+/u', ' ', (string) $value)));
    }
}
