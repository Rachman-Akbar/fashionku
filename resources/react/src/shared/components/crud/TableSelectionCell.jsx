import { memo } from "react";

export const TableSelectionHeader = memo(function TableSelectionHeader({ enabled, checked, onToggle }) {
  if (!enabled) return null;
  return (
    <th className="w-11 bg-slate-100 px-3 py-3 text-center">
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 accent-emerald-600" aria-label="Pilih semua baris" />
    </th>
  );
});

export const TableSelectionCell = memo(function TableSelectionCell({ enabled, checked, onToggle }) {
  if (!enabled) return null;
  return (
    <td className="w-11 px-3 py-3 text-center" onClick={(event) => event.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 accent-emerald-600" aria-label="Pilih baris" />
    </td>
  );
});
