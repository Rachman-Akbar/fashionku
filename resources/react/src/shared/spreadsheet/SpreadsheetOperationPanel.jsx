import { useMemo, useState } from "react";
import { bulkDeleteSpreadsheet, downloadSpreadsheetTemplate, exportSpreadsheet, getSpreadsheetError, importSpreadsheet, previewSpreadsheetImport } from "@/shared/spreadsheet/spreadsheetService";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";

const MODULE_HELP = {
  product: { relation: "Product mengelola identitas, kategori, variant, SKU, harga, dan gambar. Saldo stok tidak diubah melalui import Product.", content: "Setelah Product dibuat, gunakan import Stok Produk untuk saldo dan HPP & Harga Jual untuk resep bahan. Ketiga modul berdiri terpisah." },
  "raw-material": { relation: "Master bahan baku berdiri sendiri. Toko Seller diambil dari sesi dan kode bahan harus unik per toko.", content: "Import ini tidak mengubah stok. Stok bahan baku dikelola melalui modul Stok Bahan Baku." },
  "raw-material-stock": { relation: "Gunakan raw_material_code yang sudah tersedia. Import stok tidak membuat master bahan baku baru.", content: "Delta positif adalah restock; unit_cost dipakai untuk average cost tertimbang. Delta negatif adalah pemakaian." },
  "product-costing": { relation: "Gunakan product_id atau product_name yang sudah tersedia dan materials dengan format KODE:QTY|KODE:QTY.", content: "Biaya bahan selalu diambil dari average cost database. Import HPP tidak mengubah stok produk atau bahan baku." },
  stock: { relation: "Gunakan SKU variant yang sudah tersedia pada toko. Import stok tidak membuat Product atau Bahan Baku baru.", content: "Penambahan stok produk akan memakai bahan baku resep HPP secara otomatis jika resep tersedia." },
  income: { relation: "Toko Seller diambil dari sesi. order_number dan counterparty_email hanya dihubungkan jika data sudah tersedia.", content: "Import hanya mencatat transaksi pemasukan dan tidak membuat Order atau User baru." },
  expense: { relation: "Toko Seller diambil dari sesi. order_number dan counterparty_email hanya dihubungkan jika data sudah tersedia.", content: "Import hanya mencatat transaksi pengeluaran dan tidak membuat Order atau User baru." },
  receivable: { relation: "Toko Seller diambil dari sesi. Nilai terbayar tidak dapat diedit melalui import update.", content: "Gunakan fitur Bayar untuk cicilan agar histori pembayaran tetap lengkap." },
  payable: { relation: "Toko Seller diambil dari sesi. Nilai terbayar tidak dapat diedit melalui import update.", content: "Gunakan fitur Bayar untuk cicilan agar histori pembayaran tetap lengkap." },
};

function Header({ icon, eyebrow, title, description, onClose }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700">{icon}</span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center gap-[5px] bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200">
        <span className="material-symbols-outlined text-[18px]">close</span>
        Tutup tab
      </button>
    </header>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4 border-b border-slate-100 py-5 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{number}</div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
      </div>
    </div>
  );
}

function ImportPanel({ operation, workspace }) {
  const center = useNotificationCenter();
  const [file, setFile] = useState(null);
  const [pending, setPending] = useState(false);
  const [templatePending, setTemplatePending] = useState(false);
  const [importMode, setImportMode] = useState("create");
  const module = operation.payload?.module;
  const label = operation.payload?.label;
  const help = MODULE_HELP[module] || null;

  const downloadTemplate = async () => {
    setTemplatePending(true);
    const task = center.startTask({ title: `Template ${label}`, message: "Menyiapkan template Excel 3 sheet dengan 10 contoh kasus..." });
    try {
      await downloadSpreadsheetTemplate(module);
      task.success("Template Excel berhasil diunduh.");
    } catch (error) {
      task.fail(getSpreadsheetError(error));
    } finally {
      setTemplatePending(false);
    }
  };

  const executeImport = async (createMissingRelations, notificationId = null) => {
    const task = notificationId
      ? {
          success: (message) => center.update(notificationId, { status: "done", type: "success", message, progress: 100, actionLabel: "", onAction: null, secondaryActionLabel: "", onSecondaryAction: null }),
          fail: (message) => center.update(notificationId, { status: "failed", type: "error", message, progress: null, actionLabel: "", onAction: null, secondaryActionLabel: "", onSecondaryAction: null }),
          progress: (progress, message) => center.update(notificationId, { status: "processing", progress, ...(message ? { message } : {}) }),
        }
      : center.startTask({ title: `Import ${label}`, message: `Mengunggah ${file.name}...`, progress: 5 });

    if (notificationId) {
      center.update(notificationId, { status: "processing", type: "queue", message: "Membuat relasi yang disetujui dan mengimport data...", progress: 5, actionLabel: "", onAction: null, secondaryActionLabel: "", onSecondaryAction: null });
    }

    try {
      const result = await importSpreadsheet(module, file, (event) => {
        if (!event.total) return;
        task.progress(Math.round((event.loaded / event.total) * 70), "File sedang diunggah dan divalidasi...");
      }, { createMissingRelations, importMode });
      task.success(result.message);
      workspace.complete();
    } catch (error) {
      task.fail(getSpreadsheetError(error));
    }
  };

  const submit = async () => {
    if (!file || pending) return;
    setPending(true);
    const previewTask = center.startTask({ title: `Validasi ${label}`, message: `Memeriksa ${file.name} dan relasi antartabel...`, progress: 10 });

    try {
      const preview = await previewSpreadsheetImport(module, file, { importMode });
      const blocking = preview.blocking_relations || [];
      const missing = preview.missing_relations || [];

      if (blocking.length) {
        const details = blocking.slice(0, 5).map((item) => `${item.type}: ${item.name}`).join(", ");
        previewTask.fail(`Import belum dapat dilanjutkan. Relasi berikut wajib dibuat manual: ${details}${blocking.length > 5 ? ` dan ${blocking.length - 5} lainnya` : ""}.`);
        center.setActiveTab("info");
        center.setOpen(true);
        return;
      }

      if (preview.requires_confirmation && missing.length) {
        const totalRows = Number(preview.total_rows || 0);
        const detail = missing.slice(0, 6).map((item) => `${item.type}: ${item.name}`).join(", ");
        center.update(previewTask.id, {
          status: "waiting",
          type: "queue",
          title: `Konfirmasi Import ${label}`,
          message: `${totalRows} baris siap diperiksa. Relasi belum tersedia: ${detail}${missing.length > 6 ? ` dan ${missing.length - 6} lainnya` : ""}. Lanjutkan untuk membuat relasi tersebut otomatis, atau batalkan import.`,
          progress: null,
          actionLabel: "Lanjutkan",
          secondaryActionLabel: "Batal",
          onAction: () => executeImport(true, previewTask.id),
          onSecondaryAction: () => {
            center.update(previewTask.id, { status: "cancelled", type: "info", message: "Import dibatalkan. Tidak ada data atau relasi yang dibuat.", actionLabel: "", onAction: null, secondaryActionLabel: "", onSecondaryAction: null });
            center.setActiveTab("info");
          },
        });
        center.setActiveTab("queue");
        center.setOpen(true);
        return;
      }

      center.remove(previewTask.id);
      await executeImport(false);
    } catch (error) {
      previewTask.fail(getSpreadsheetError(error));
      center.setActiveTab("info");
      center.setOpen(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <Header icon="upload_file" eyebrow="Import Excel" title={`Import ${label}`} description="Proses import berjalan pada tab khusus dan relasi baru memerlukan konfirmasi melalui antrean." onClose={workspace.close} />
      <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
        <div className="px-5 sm:px-7">
          <Step number="1" title="Pilih jenis import">
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setImportMode("create")} className={`border p-4 text-left transition ${importMode === "create" ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <span className="flex items-center gap-[5px] text-sm font-black text-slate-900"><span className="material-symbols-outlined text-[19px] text-emerald-700">add_box</span>Import Data Baru</span>
                <span className="mt-2 block text-xs leading-5 text-slate-600">Hanya membuat data baru. Kolom ID harus kosong dan data yang sudah ada akan ditolak agar tidak ter-update tanpa sengaja.</span>
              </button>
              <button type="button" onClick={() => setImportMode("update")} className={`border p-4 text-left transition ${importMode === "update" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <span className="flex items-center gap-[5px] text-sm font-black text-slate-900"><span className="material-symbols-outlined text-[19px] text-blue-700">edit_note</span>Import Update Data</span>
                <span className="mt-2 block text-xs leading-5 text-slate-600">Hanya memperbarui data lama. Kolom ID wajib diisi sehingga baris baru tidak tercipta atau menggandakan data.</span>
              </button>
            </div>
          </Step>
          <Step number="2" title="Unduh template resmi">
            Template berisi Template Kosong, 10 Contoh Kasus Import yang rinci, dan Penjelasan Kolom.
            <div className="mt-3"><button type="button" onClick={downloadTemplate} disabled={templatePending} className="inline-flex h-10 items-center gap-[5px] bg-slate-900 px-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"><span className={`material-symbols-outlined text-[18px] ${templatePending ? "" : ""}`}>download</span>Download Template</button></div>
          </Step>
          <Step number="3" title="Periksa relasi modul">
            {help?.relation || "Relasi diisi sesuai Penjelasan Kolom pada template. Data relasi yang wajib tersedia tidak dibuat otomatis tanpa aturan yang jelas."}
          </Step>
          <Step number="4" title="Isi data sesuai fungsi modul">
            {help?.content || "Isi hanya kolom yang memang menjadi tanggung jawab modul ini. Jangan mencampur data dari modul lain ke satu import."}
          </Step>
          <Step number="5" title="Pilih file Excel">
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-emerald-500 hover:bg-emerald-50/40">
              <span className="material-symbols-outlined text-4xl text-emerald-600">upload_file</span>
              <span className="mt-2 text-sm font-extrabold text-slate-800">{file?.name || "Pilih file .xlsx atau .xls"}</span>
              <span className="mt-1 text-xs text-slate-500">Maksimum 20 MB</span>
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </label>
          </Step>
        </div>
        <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-black text-slate-900">Ringkasan proses</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Mode aktif: <strong>{importMode === "create" ? "Import Data Baru" : "Import Update Data"}</strong>.</p>
            <p>File diperiksa terlebih dahulu sebelum penyimpanan.</p>
            <p>Relasi wajib diperiksa sebelum penyimpanan.</p>
            <p>Master dari modul lain tidak dibuat otomatis oleh import ini.</p>
            <p>Data gagal otomatis dibuatkan file Excel error beserta penyebabnya.</p>
          </div>
          <button type="button" onClick={submit} disabled={!file || pending} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-[5px] bg-emerald-600 px-4 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45">
            <span className={`material-symbols-outlined text-[19px] ${pending ? "" : ""}`}>fact_check</span>
            {pending ? "Memvalidasi..." : "Validasi & Import"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function ExportPanel({ operation, workspace }) {
  const center = useNotificationCenter();
  const [pending, setPending] = useState(false);
  const ids = operation.payload?.ids || [];
  const label = operation.payload?.label;
  const module = operation.payload?.module;
  const supportsImages = ["product", "category", "promotion", "banner"].includes(module);

  const submit = async () => {
    setPending(true);
    const task = center.startTask({ title: `Export ${label}`, message: ids.length ? `Menyiapkan ${ids.length} data terpilih...` : "Menyiapkan seluruh data..." });
    try {
      const result = await exportSpreadsheet(operation.payload?.module, ids);
      task.success(`Export selesai: ${result.filename}`);
    } catch (error) {
      task.fail(getSpreadsheetError(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <Header icon="download" eyebrow="Export Excel" title={`Export ${label}`} description={supportsImages ? "File berisi data tabel dan preview thumbnail gambar yang tersedia." : "File berisi data database sesuai scope toko dan modul yang dipilih."} onClose={workspace.close} />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Cakupan</p><p className="mt-2 text-lg font-black text-slate-900">{ids.length ? `${ids.length} data dipilih` : "Semua data"}</p></div>
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Format</p><p className="mt-2 text-lg font-black text-slate-900">Excel .xlsx</p></div>
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Isi</p><p className="mt-2 text-lg font-black text-slate-900">{supportsImages ? "Data + gambar" : "Data realtime"}</p></div>
        </div>
        <button type="button" onClick={submit} disabled={pending} className="mt-6 inline-flex h-11 items-center justify-center gap-[5px] bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"><span className={`material-symbols-outlined text-[19px] ${pending ? "" : ""}`}>download</span>Mulai Export</button>
      </div>
    </div>
  );
}

function DeletePanel({ operation, workspace }) {
  const center = useNotificationCenter();
  const [pending, setPending] = useState(false);
  const rows = operation.payload?.rows || [];
  const ids = operation.payload?.ids || [];
  const label = operation.payload?.label;
  const names = useMemo(() => rows.map((row) => row?.name || row?.title || row?.code || `ID ${row?.id}`).filter(Boolean), [rows]);

  const submit = async () => {
    if (!ids.length) return;
    setPending(true);
    const task = center.startTask({ title: `Hapus ${label}`, message: `Menghapus ${ids.length} data terpilih...` });
    try {
      const result = await bulkDeleteSpreadsheet(operation.payload?.module, ids);
      task.success(`${Number(result.deleted_count || ids.length)} data berhasil dihapus.`);
      workspace.complete();
      workspace.close();
    } catch (error) {
      task.fail(getSpreadsheetError(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="overflow-hidden border border-red-200 bg-white">
      <Header icon="delete_sweep" eyebrow="Bulk Delete" title={`Hapus ${label}`} description="Penghapusan multiple dilakukan melalui tab khusus agar data yang dipilih dapat diperiksa kembali." onClose={workspace.close} />
      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        <div className="p-6">
          <h3 className="text-sm font-black text-slate-900">Data yang akan dihapus</h3>
          <div className="mt-4 max-h-96 overflow-y-auto border border-slate-200">
            {names.length ? names.map((name, index) => <div key={`${name}-${index}`} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-600">{index + 1}</span><span className="font-semibold text-slate-700">{name}</span></div>) : <p className="p-5 text-sm text-slate-500">Tidak ada data yang dipilih.</p>}
          </div>
        </div>
        <aside className="border-t border-red-100 bg-red-50/50 p-6 lg:border-l lg:border-t-0">
          <span className="material-symbols-outlined text-4xl text-red-600">warning</span>
          <h3 className="mt-3 text-base font-black text-red-900">Konfirmasi penghapusan</h3>
          <p className="mt-2 text-sm leading-6 text-red-800">Sebanyak {ids.length} data akan dihapus. Proses ini tetap berjalan di backend dan dipantau melalui antrean.</p>
          <button type="button" onClick={submit} disabled={!ids.length || pending} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-[5px] bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700 disabled:opacity-45"><span className={`material-symbols-outlined text-[19px] ${pending ? "" : ""}`}>delete</span>Hapus Data</button>
        </aside>
      </div>
    </div>
  );
}

export function SpreadsheetOperationPanel({ workspace }) {
  const operation = workspace.activeOperation;
  if (!operation) return null;
  if (operation.type === "import") return <ImportPanel operation={operation} workspace={workspace} />;
  if (operation.type === "export") return <ExportPanel operation={operation} workspace={workspace} />;
  if (operation.type === "bulk-delete") return <DeletePanel operation={operation} workspace={workspace} />;
  return null;
}
