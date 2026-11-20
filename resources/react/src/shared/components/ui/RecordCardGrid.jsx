import { memo } from "react";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { cn } from "@/shared/utils/utils";

const MEDIA_KEYS = ["image", "image_url", "imageUrl", "thumbnail", "photo", "avatar", "gambar"];
const SKIPPED_KEYS = ["actions", "expand", "selection", "special_actions"];

function valueOf(column, row) {
  if (!column) return undefined;
  if (typeof column.render === "function") return column.render(row);
  return formatTableValue(resolveTableValue(row, column.rawKey || column.key));
}

function mediaUrlOf(row, column, cardImage) {
  if (typeof cardImage === "function") return cardImage(row);
  if (column?.key) return resolveTableValue(row, column.key) || null;
  return null;
}

export const RecordCardGrid = memo(function RecordCardGrid({
  rows = [],
  columns = [],
  card = {},
  onRowClick,
  onRowClickLabel = "Klik untuk membuka detail",
  selectionEnabled = false,
  selectedIds = new Set(),
  isRowSelectable,
  onToggleRow,
  gridClassName = "grid grid-cols-1 gap-[5px] p-[2px] sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  rowKey,
  emptyText = "Data belum tersedia.",
}) {
  if (!rows.length) {
    return emptyText ? (
      <div className="border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">{emptyText}</div>
    ) : null;
  }

  const {
    title,
    subtitle,
    image,
    badges = [],
    fields,
    footer,
    hiddenKeys = [],
    idOf,
  } = card;

  const hidden = new Set([...SKIPPED_KEYS, ...hiddenKeys]);
  const dataColumns = columns.filter((column) => !hidden.has(column.key));
  const actionsColumn = columns.find((column) => column.key === "actions");
  const mediaColumn = dataColumns.find((column) => MEDIA_KEYS.includes(column.key));
  const contentColumns = dataColumns.filter((column) => column !== mediaColumn);

  const getId = (row, index) => {
    if (typeof idOf === "function") return idOf(row);
    if (typeof rowKey === "function") return rowKey(row);
    const raw = row?.id ?? row?.orderId ?? row?.order_id;
    return raw ?? index;
  };

  return (
    <div className={gridClassName}>
      {rows.map((row, index) => {
        const id = getId(row, index);
        const selected = selectedIds instanceof Set && selectedIds.has(String(id));
        const inactive = isInactiveRow(row);
        const hasExplicitTitle = typeof title !== "undefined";
        const titleNode = typeof title === "function" ? title(row) : title ?? valueOf(contentColumns[0], row);
        const subtitleNode = typeof subtitle === "function"
          ? subtitle(row)
          : subtitle ?? (hasExplicitTitle ? undefined : valueOf(contentColumns[1], row));
        const mediaUrl = renderMedia(row, mediaColumn, image);

        const resolvedFields = Array.isArray(fields)
          ? fields
          : contentColumns
              .slice(hasExplicitTitle ? 0 : subtitleNode ? 2 : 1)
              .slice(0, 8)
              .map((column) => ({ label: column.label, render: (item) => valueOf(column, item) }));

        return (
          <div
            key={String(id)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            title={onRowClick ? onRowClickLabel : undefined}
            className={cn(
              "group relative flex flex-col overflow-hidden bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md",
              onRowClick && "cursor-pointer",
              inactive && "opacity-60 saturate-50",
            )}
          >
            {selectionEnabled && (!isRowSelectable || isRowSelectable(row)) ? (
              <label
                className="absolute left-1.5 top-1.5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] bg-white/90 shadow-sm ring-1 ring-slate-200"
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggleRow?.(row?.id ?? id)}
                  className="h-3.5 w-3.5 accent-emerald-600"
                  aria-label="Pilih data"
                />
              </label>
            ) : null}

            {mediaUrl ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={resolveMediaUrl(mediaUrl)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5">
              <div className="flex items-start justify-between gap-1.5">
                <p className="min-w-0 truncate text-sm font-extrabold text-slate-900">{titleNode}</p>
                {badges.length ? (
                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                    {badges.map((renderBadge, badgeIndex) => (
                      <span key={badgeIndex} className="inline-flex">
                        {typeof renderBadge === "function" ? renderBadge(row) : renderBadge}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {subtitleNode ? <p className="truncate text-[11px] text-slate-500">{subtitleNode}</p> : null}

              {resolvedFields.length ? (
                <dl className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  {resolvedFields.map((field, fieldIndex) => {
                    const value = typeof field.render === "function" ? field.render(row) : field.value;
                    return (
                      <div key={`${field.label}-${fieldIndex}`} className="min-w-0">
                        <dt className="truncate font-semibold uppercase tracking-[0.08em] text-slate-400">{field.label}</dt>
                        <dd className="truncate font-bold text-slate-700">{value === "" || value === null || value === undefined ? "-" : value}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : null}

              {(typeof footer === "function" || actionsColumn) ? (
                <div
                  className="mt-auto flex items-center justify-between gap-1 border-t border-slate-100 pt-1.5"
                  onClick={(event) => event.stopPropagation()}
                >
                  {typeof footer === "function"
                    ? footer(row)
                    : actionsColumn.render?.(row)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
});

function renderMedia(row, mediaColumn, image) {
  if (typeof image === "function") return image(row);
  if (typeof image === "string") return resolveTableValue(row, image);
  if (!mediaColumn) return null;
  return mediaUrlOf(row, mediaColumn, image);
}
