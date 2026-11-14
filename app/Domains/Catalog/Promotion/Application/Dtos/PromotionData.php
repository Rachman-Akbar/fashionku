<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Dtos;

final class PromotionData
{
    public function __construct(
        public ?int $id,
        public ?int $promotionPaymentId,
        public string $name,
        public string $imageUrl,
        public ?string $mobileImageUrl,
        public string $clickAction,
        public ?int $targetId,
        public ?string $targetUrl,
        public int $sortOrder,
        public bool $isActive,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            promotionPaymentId: isset($data['promotion_payment_id']) && $data['promotion_payment_id'] !== null ? (int) $data['promotion_payment_id'] : null,
            name: trim((string) preg_replace('/\s+/u', ' ', (string) ($data['name'] ?? ''))),
            imageUrl: trim((string) ($data['image_url'] ?? '')),
            mobileImageUrl: self::nullableString($data['mobile_image_url'] ?? null),
            clickAction: (string) ($data['click_action'] ?? 'none'),
            targetId: isset($data['target_id']) && $data['target_id'] !== null ? (int) $data['target_id'] : null,
            targetUrl: self::nullableString($data['target_url'] ?? null),
            sortOrder: (int) ($data['sort_order'] ?? 0),
            isActive: (bool) ($data['is_active'] ?? true),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'promotion_payment_id' => $this->promotionPaymentId,
            'name' => $this->name,
            'image_url' => $this->imageUrl,
            'mobile_image_url' => $this->mobileImageUrl,
            'click_action' => $this->clickAction,
            'target_id' => $this->targetId,
            'target_url' => $this->targetUrl,
            'sort_order' => $this->sortOrder,
            'is_active' => $this->isActive,
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        $value = trim((string) ($value ?? ''));

        return $value === '' ? null : $value;
    }
}
