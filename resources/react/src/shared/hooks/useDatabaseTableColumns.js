import { useMemo } from "react";
import { useColumnVisibility } from "@/shared/hooks/useColumnVisibility";
import { buildDatabaseColumns, mergeColumns } from "@/shared/utils/tableData";

/**
 * Kolom tabel halaman data admin/seller: semua kolom database yang muncul di
 * API (termasuk kolom relasi) ditampilkan otomatis, kecuali kolom ID.
 *
 * Kolom kurasi (yang punya render/label khusus) tetap menang; kolom database
 * lain menyusul dengan label dari nama kolomnya dan default tampil.
 *
 * @param {Array} curatedColumns kolom yang sudah didefinisikan halaman
 * @param {Array} rows           baris data dari API
 * @param {object} options       { storageKey, omit, labels }
 */
export function useDatabaseTableColumns(curatedColumns = [], rows = [], options = {}) {
  const { storageKey = "", omit, labels } = options;

  const columns = useMemo(
    () => mergeColumns(curatedColumns, buildDatabaseColumns(rows, { omit, labels })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [curatedColumns, rows, JSON.stringify(omit ?? []), JSON.stringify(labels ?? {})],
  );

  const columnVisibility = useColumnVisibility(columns, storageKey);

  return {
    columns,
    columnVisibility,
    visibleColumns: columnVisibility.orderedColumns,
  };
}

export default useDatabaseTableColumns;
