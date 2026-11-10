<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Application\Services;

use App\Domains\Shared\Codes\Infrastructure\Persistence\Models\CodePatternModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class CodePatternService
{
    /**
     * @return array<int, array{type: string, label: string, pattern: string, default: string, customized: bool, scope: string}>
     */
    public function list(?int $storeId): array
    {
        $rows = CodePatternModel::query()
            ->when($storeId !== null, fn ($query) => $query->where('store_id', $storeId))
            ->when($storeId === null, fn ($query) => $query->whereNull('store_id'))
            ->get()
            ->keyBy('type');

        $globalRows = $storeId === null
            ? $rows
            : CodePatternModel::query()->whereNull('store_id')->get()->keyBy('type');

        $patterns = [];

        foreach (CodePatternFormatter::LABELS as $type => $label) {
            $storePattern = $rows->get($type)?->pattern;
            $globalPattern = $storeId === null ? $storePattern : $globalRows->get($type)?->pattern;
            $default = CodePatternFormatter::DEFAULTS[$type];
            $pattern = $storePattern ?: $globalPattern ?: $default;

            $patterns[] = [
                'type' => $type,
                'label' => $label,
                'pattern' => $pattern,
                'default' => $default,
                'customized' => $pattern !== $default,
                'scope' => $storePattern ? ($storeId === null ? 'global' : 'store') : ($globalPattern ? 'global' : 'default'),
            ];
        }

        return $patterns;
    }

    /**
     * @param  array<string, string>  $patterns
     * @return array<int, array<string, mixed>>
     */
    public function save(array $patterns, ?int $storeId, ?int $targetStoreId = null): array
    {
        $targetStoreId = $targetStoreId !== null ? (int) $targetStoreId : $storeId;

        foreach ($patterns as $type => $pattern) {
            if (! array_key_exists($type, CodePatternFormatter::LABELS)) {
                throw new InvalidArgumentException("Tipe kode tidak dikenal: {$type}.");
            }

            $sanitized = CodePatternFormatter::sanitize((string) $pattern);
            if ($sanitized === '') {
                CodePatternModel::query()->where('type', $type)->where('store_id', $targetStoreId)->delete();

                continue;
            }

            CodePatternModel::query()->updateOrCreate(
                ['store_id' => $targetStoreId, 'type' => $type],
                ['pattern' => $sanitized],
            );
        }

        return $this->list($storeId);
    }

    public function patternFor(string $type, ?int $storeId): string
    {
        $storePattern = $storeId === null ? null : CodePatternModel::query()->where('store_id', $storeId)->where('type', $type)->value('pattern');
        $globalPattern = CodePatternModel::query()->whereNull('store_id')->where('type', $type)->value('pattern');

        return $storePattern ?: $globalPattern ?: (CodePatternFormatter::DEFAULTS[$type] ?? '{type}-{date}-{seq:4}');
    }

    public function render(string $type, ?int $storeId, array $context = []): string
    {
        return CodePatternFormatter::render($this->patternFor($type, $storeId), $context + ['type' => $type]);
    }

    /**
     * Membuat kode unik berdasarkan rumus, mengulang sampai tidak bentrok.
     *
     * @param  callable(string): bool  $isTaken
     */
    public function unique(string $type, ?int $storeId, array $context, callable $isTaken, int $maxAttempts = 50): string
    {
        $code = $this->render($type, $storeId, $context);

        if (! $isTaken($code)) {
            return $code;
        }

        $sequence = max(1, (int) ($context['seq'] ?? 1));

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $candidate = $this->render($type, $storeId, array_merge($context, ['seq' => $sequence + $attempt + 1]));
            if (! $isTaken($candidate)) {
                return $candidate;
            }
        }

        return $this->render($type, $storeId, array_merge($context, ['seq' => $sequence + $maxAttempts + 1]));
    }

    public function sequenceFor(string $table, string $dateColumn, ?int $storeId, string $storeColumn = 'store_id'): int
    {
        return (int) DB::table($table)
            ->when($storeId !== null, fn ($query) => $query->where($storeColumn, $storeId))
            ->whereDate($dateColumn, Carbon::now()->toDateString())
            ->count() + 1;
    }
}
