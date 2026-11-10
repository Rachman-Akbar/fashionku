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
        'store_id',
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
            $hasUser = $address->user_id !== null && $address->user_id !== '';
            $hasStore = $address->store_id !== null && $address->store_id !== '';

            if ($hasUser === $hasStore) {
                throw new InvalidArgumentException('Alamat harus dimiliki tepat oleh satu user atau satu toko.');
            }

            if ($hasStore) {
                $duplicate = static::query()
                    ->where('store_id', $address->store_id)
                    ->when($address->exists, fn ($query) => $query->where($address->getKeyName(), '<>', $address->getKey()))
                    ->exists();

                if ($duplicate) {
                    throw new InvalidArgumentException('Satu toko hanya boleh memiliki satu alamat.');
                }

                $address->is_primary = true;
            }
        });
    }

    public function markAsPrimary(): void
    {
        $query = static::query()->whereKeyNot($this->getKey());

        if ($this->user_id) {
            $query->where('user_id', $this->user_id);
        } else {
            $query->where('store_id', $this->store_id);
        }

        $query->update(['is_primary' => false]);
        $this->forceFill(['is_primary' => true])->saveQuietly();
    }
}
