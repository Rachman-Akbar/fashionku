<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Presentation\Http\Controllers;

use App\Domains\Shared\Codes\Application\Services\CodePatternFormatter;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Shared\Codes\Presentation\Http\Requests\CodePatternRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CodePatternController
{
    public function __construct(private CodePatternService $service) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'patterns' => $this->service->list(),
                'tokens' => CodePatternFormatter::TOKENS,
                'defaults' => CodePatternFormatter::DEFAULTS,
            ],
        ]);
    }

    public function update(CodePatternRequest $request): JsonResponse
    {
        $patterns = $this->service->save(
            (array) $request->input('patterns', []),
        );

        return response()->json([
            'success' => true,
            'message' => 'Rumus kode unik berhasil disimpan.',
            'data' => ['patterns' => $patterns],
        ]);
    }

    public function preview(Request $request): JsonResponse
    {
        $type = (string) $request->input('type', 'sku');

        if (! array_key_exists($type, CodePatternFormatter::LABELS)) {
            return response()->json(['success' => false, 'message' => 'Tipe kode tidak dikenal.'], 422);
        }

        $pattern = (string) ($request->input('pattern') ?: $this->service->patternFor($type));

        return response()->json([
            'success' => true,
            'data' => [
                'sample' => CodePatternFormatter::render($pattern, $this->previewContext($type, $request)),
            ],
        ]);
    }

    private function previewContext(string $type, Request $request): array
    {
        $context = array_filter([
            'name' => $request->input('name'),
            'brand' => $request->input('brand'),
            'category' => $request->input('category'),
            'store' => $request->input('store'),
            'movement' => $request->input('movement'),
            'status' => $request->input('status'),
        ], fn ($value) => $value !== null && $value !== '');

        if ($type === 'sku' && ! isset($context['name'])) {
            $context['name'] = 'Kecap Manis 600 ml';
        }

        if (in_array($type, ['stock_reference', 'material_reference'], true) && ! isset($context['movement'])) {
            $context['movement'] = 'MASUK';
        }

        return $context;
    }
}
