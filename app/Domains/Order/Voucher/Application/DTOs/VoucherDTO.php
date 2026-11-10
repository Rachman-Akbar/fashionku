<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\DTOs;

use Illuminate\Support\Str;

final class VoucherDTO
{
    public function __construct(
        public string $code,
        public string $name,
        public string $voucher_scope,
        public string $discount_target,
        public string $discount_type,
        public float $discount_value,
        public float $min_spend,
        public ?float $max_discount,
        public string $starts_at,
        public string $ends_at,
        public ?int $min_items = null,
        public ?int $min_distinct_products = null,
        public ?string $terms = null,
        public int $usage_limit = 0,
        public ?int $store_id = null,
        public bool $is_active = true,
        public ?string $image = null,
    ) {
        $this->code = Str::lower(trim($this->code));
        $this->name = trim((string) preg_replace('/\s+/u', ' ', $this->name));
    }
}
