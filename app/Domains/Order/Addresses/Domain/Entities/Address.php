<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Domain\Entities;

use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class Address extends Model
{
    protected $table = 'addresses';

    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone_number',
        'country',
        'province',
        'city_or_regency',
        'district',
        'subdistrict',
        'full_address',
        'postal_code',
        'komerce_destination_id',
        'notes',
        'latitude',
        'longitude',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected static function booted(): void
    {
        static::saving(function (Address $address): void {
            if ($address->user_id === null || $address->user_id === '') {
                throw new InvalidArgumentException('Alamat harus dimiliki oleh seorang user.');
            }
        });
    }

    public function markAsPrimary(): void
    {
        static::query()
            ->where('user_id', $this->user_id)
            ->whereKeyNot($this->getKey())
            ->update(['is_primary' => false]);

        $this->forceFill(['is_primary' => true])->saveQuietly();
    }
}
