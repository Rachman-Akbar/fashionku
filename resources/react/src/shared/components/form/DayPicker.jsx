import { useMemo } from "react";

const DAYS = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

const DAY_KEY_INDEX = Object.fromEntries(DAYS.map((day, index) => [day.key, index]));

function normalizeKey(token) {
  const normalized = String(token).toLowerCase().replace(/[^a-z]/g, "").trim();
  return DAY_KEY_INDEX[normalized] !== undefined ? normalized : null;
}

export function parseDays(value) {
  const text = String(value || "").toLowerCase().trim();

  if (!text) {
    return [];
  }

  const found = new Set();
  const addToken = (token) => {
    const key = normalizeKey(token);

    if (key) {
      found.add(key);
    }
  };

  for (const part of text.split(",")) {
    const trimmed = part.trim();

    if (!trimmed) {
      continue;
    }

    const range = trimmed.match(/^([a-z]+)\s*[-–—]\s*([a-z]+)$/);

    if (range) {
      const start = DAY_KEY_INDEX[normalizeKey(range[1])];
      const end = DAY_KEY_INDEX[normalizeKey(range[2])];

      if (start === undefined || end === undefined) {
        continue;
      }

      const [from, to] = start <= end ? [start, end] : [end, start];

      for (let index = from; index <= to; index += 1) {
        found.add(DAYS[index].key);
      }

      continue;
    }

    const before = found.size;
    trimmed.split(/[\s,/\-–—.]+/).forEach(addToken);

    if (found.size === before) {
      for (const day of DAYS) {
        if (trimmed.includes(day.key)) {
          found.add(day.key);
        }
      }
    }
  }

  return DAYS.filter((day) => found.has(day.key)).map((day) => day.key);
}

export function compactRange(days) {
  const sorted = [...days].sort((a, b) => DAY_KEY_INDEX[a] - DAY_KEY_INDEX[b]);

  if (sorted.length === 0) {
    return "";
  }

  const grouped = [];
  let start = 0;

  for (let index = 1; index <= sorted.length; index += 1) {
    const prev = DAY_KEY_INDEX[sorted[index - 1]];
    const next = index < sorted.length ? DAY_KEY_INDEX[sorted[index]] : null;

    if (next !== null && next === prev + 1) {
      continue;
    }

    grouped.push(sorted.slice(start, index));
    start = index;
  }

  return grouped
    .map((range) => {
      if (range.length === 1) {
        return DAYS[DAY_KEY_INDEX[range[0]]].label;
      }

      const first = DAYS[DAY_KEY_INDEX[range[0]]].label;
      const last = DAYS[DAY_KEY_INDEX[range[range.length - 1]]].label;

      return `${first} - ${last}`;
    })
    .join(", ");
}

export function DayPicker({ value, onChange, disabled }) {
  const selected = useMemo(() => new Set(parseDays(value)), [value]);

  const toggle = (key) => {
    if (disabled) {
      return;
    }

    const next = new Set(selected);

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    const sortedNext = DAYS.filter((day) => next.has(day.key)).map((day) => day.key);
    onChange(compactRange(sortedNext));
  };

  return (
    <div className="flex flex-wrap gap-[5px]">
      {DAYS.map((day) => {
        const isActive = selected.has(day.key);

        return (
          <button
            key={day.key}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => toggle(day.key)}
            className={`h-11 rounded-[10px] border px-4 text-sm font-bold transition ${
              isActive
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/40"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}