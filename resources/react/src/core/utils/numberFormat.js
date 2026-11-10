export function formatCompactNumber(value) {
  const number = Number(value || 0);

  if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)}M`;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}jt`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}rb`;

  return String(number);
}

export function formatPercent(value) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${number.toFixed(1)}%`;
}

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
