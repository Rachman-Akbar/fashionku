<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Entities;

final class ProductAttribute
{
    public function __construct(
        private readonly ?int $id,
        private readonly string $name,
        private readonly string $slug,
        private readonly string $type
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function slug(): string
    {
        return $this->slug;
    }

    public function type(): string
    {
        return $this->type;
    }
}
