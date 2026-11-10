<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Entities;

final class ProductAttributeValue
{
    public function __construct(
        private readonly ?int $id,
        private readonly int $productId,
        private readonly int $attributeId,
        private readonly string $value,
        private readonly ?string $attributeName = null,
        private readonly ?string $attributeSlug = null,
        private readonly ?string $attributeType = null
    ) {}

    public function id(): ?int
    {
        return $this->id;
    }

    public function productId(): int
    {
        return $this->productId;
    }

    public function attributeId(): int
    {
        return $this->attributeId;
    }

    public function value(): string
    {
        return $this->value;
    }

    public function attributeName(): ?string
    {
        return $this->attributeName;
    }

    public function attributeSlug(): ?string
    {
        return $this->attributeSlug;
    }

    public function attributeType(): ?string
    {
        return $this->attributeType;
    }
}
