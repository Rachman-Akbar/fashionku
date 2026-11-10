<?php

declare(strict_types=1);

namespace App\Infrastructure\Logging;

use Monolog\Formatter\JsonFormatter;

/**
 * Formats log records as single-line JSON so they can be ingested by log
 * aggregation tools (CloudWatch, Datadog, Logstash, etc.).
 *
 * Registered as a `tap` on the `json` log channel (config/logging.php).
 */
final class StructuredLogFormatter
{
    public function __invoke($logger): void
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new JsonFormatter);
        }
    }
}
