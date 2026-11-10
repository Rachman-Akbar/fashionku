<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Pastikan category didecode jika tersimpan sebagai JSON string di DB, atau langsung ambil objeknya
        $category = data_get($this->resource, 'category');
        if (is_string($category)) {
            $decoded = json_decode($category, true);
            $category = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        // Pastikan store didecode jika mentah, atau ambil data relasi store-nya langsung
        $store = data_get($this->resource, 'store');
        if (is_string($store)) {
            $decoded = json_decode($store, true);
            $store = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        $primaryCategoryId = data_get($this->resource, 'primary_category_id');

        return [
            'id' => data_get($this->resource, 'id'),
            'store_id' => data_get($this->resource, 'store_id'),
            'seller_id' => data_get($this->resource, 'seller_id'), // Menunjuk langsung ke ID User sang penjual

            // Backward-compatibility untuk frontend lama
            'category_id' => $primaryCategoryId,
            'primary_category_id' => $primaryCategoryId,

            'name' => data_get($this->resource, 'name'),
            'slug' => data_get($this->resource, 'slug'),
            'description' => data_get($this->resource, 'description'),
            'short_description' => data_get($this->resource, 'short_description'),
            'brand' => data_get($this->resource, 'brand'),

            // Casting tipe data yang ketat untuk kenyamanan Frontend
            'price' => (float) data_get($this->resource, 'price', 0),
            'stock' => (int) data_get($this->resource, 'stock', 0),
            'thumbnail' => data_get($this->resource, 'thumbnail'),
            'status' => data_get($this->resource, 'status'),
            'is_featured' => (bool) data_get($this->resource, 'is_featured', false),
            'is_active' => (bool) data_get($this->resource, 'is_active', true),

            // Objek relasi terikat
            'category' => $category,
            'store' => $store, // Menampilkan info toko tempat produk ini bernaung
            'images' => data_get($this->resource, 'images', []),

            'created_at' => data_get($this->resource, 'created_at'),
            'updated_at' => data_get($this->resource, 'updated_at'),
        ];
    }
}
