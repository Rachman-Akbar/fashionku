<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Application\Services;

use App\Domains\Shared\Codes\Infrastructure\Persistence\Models\CodePatternModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Rumus kode unik untuk toko tunggal. Tidak ada lagi scoping per toko.
 */
final class CodePatternService
{
    /**
     * @return array<int, array{type: string, label: string, pattern: string, default: string, customized: bool, scope: string}>
     */
    public function list(): array
    {
        $rows = CodePatternModel::query()->get()->keyBy('type');
        $patterns = [];

        foreach (CodePatternFormatter::LABELS as $type => $label) {
            $default = CodePatternFormatter::DEFAULTS[$type];
            $custom = $rows->get($type)?->pattern;
            $pattern = $custom ?: $default;

            $patterns[] = [
                'type' => $type,
                'label' => $label,
                'pattern' => $pattern,
                'default' => $default,
                'customized' => $pattern !== $default,
                'scope' => $custom ? 'global' : 'default',
            ];
        }

        return $patterns;
    }

    /**
     * @param  array<string, string>  $patterns
     * @return array<int, array<string, mixed>>
     */
    public function save(array $patterns): array
    {
        foreach ($patterns as $type => $pattern) {
            if (! array_key_exists($type, CodePatternFormatter::LABELS)) {
                throw new InvalidArgumentException("Tipe kode tidak dikenal: {$type}.");
            }

            $sanitized = CodePatternFormatter::sanitize((string) $pattern);
            if ($sanitized === '') {
                CodePatternModel::query()->where('type', $type)->delete();

                continue;
            }

            CodePatternModel::query()->updateOrCreate(
                ['type' => $type],
                ['pattern' => $sanitized],
            );
        }

        return $this->list();
    }

    public function patternFor(string $type): string
    {
        return CodePatternModel::query()->where('type', $type)->value('pattern')
            ?: (CodePatternFormatter::DEFAULTS[$type] ?? '{type}-{date}-{seq:4}');
    }

    public function render(string $type, array $context = []): string
    {
        return CodePatternFormatter::render($this->patternFor($type), $context + ['type' => $type]);
    }

    /**
     * Membuat kode unik berdasarkan rumus, mengulang sampai tidak bentrok.
     *
     * @param  callable(string): bool  $isTaken
     */
    public function unique(string $type, array $context, callable $isTaken, int $maxAttempts = 50): string
    {
        $code = $this->render($type, $context);

        if (! $isTaken($code)) {
            return $code;
        }

        $sequence = max(1, (int) ($context['seq'] ?? 1));

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $candidate = $this->render($type, array_merge($context, ['seq' => $sequence + $attempt + 1]));
            if (! $isTaken($candidate)) {
                return $candidate;
            }
        }

        return $this->render($type, array_merge($context, ['seq' => $sequence + $maxAttempts + 1]));
    }

    public function sequenceFor(string $table, string $dateColumn): int
    {
        return (int) DB::table($table)
            ->whereDate($dateColumn, Carbon::now()->toDateString())
            ->count() + 1;
    }
}
