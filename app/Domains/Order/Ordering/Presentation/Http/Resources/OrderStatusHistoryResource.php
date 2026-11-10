<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class OrderStatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $history = $this->resource;

        return [
            'id' => $this->read($history, 'id'),
            'from_status' => $this->readValue($this->read($history, 'fromStatus') ?? $this->read($history, 'from_status')),
            'to_status' => $this->readValue($this->read($history, 'toStatus') ?? $this->read($history, 'to_status')),
            'note' => $this->read($history, 'note'),
            'changed_by' => $this->read($history, 'changedBy') ?? $this->read($history, 'changed_by'),
            'created_at' => $this->readDate($this->read($history, 'createdAt') ?? $this->read($history, 'created_at')),
        ];
    }

    private function read(object|array|null $source, string $key): mixed
    {
        if ($source === null) {
            return null;
        }

        if (is_array($source)) {
            return $source[$key] ?? null;
        }

        if (method_exists($source, $key)) {
            return $source->{$key}();
        }

        return $source->{$key} ?? null;
    }

    private function readValue(mixed $value): mixed
    {
        if ($value === null) {
            return null;
        }

        if (is_object($value) && method_exists($value, 'value')) {
            return $value->value();
        }

        return $value;
    }

    private function readDate(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_object($value) && method_exists($value, 'format')) {
            return $value->format(DATE_ATOM);
        }

        return (string) $value;
    }
}
