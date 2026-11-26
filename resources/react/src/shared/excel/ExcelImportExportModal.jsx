import { useState } from "react";
import { createPortal } from "react-dom";
import { downloadExcelTemplate, exportExcel, getExcelError } from "@/shared/excel/excelService";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { ImportProgressTab } from "@/shared/excel/ImportProgressTab";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";

const MODULE_LABELS = {
  product: "Produk",
  category: "Kategori",
  "raw-material": "Bahan Baku",
  customer: "Pelanggan",
  stock: "Stok Produk",
  sales: "Penjualan",
  finance: "Keuangan",
  user: "Pengguna",
  voucher: "Voucher",
  promotion: "Promosi",
};

const MODULE_HELP = {
  product: { relation: "Produk memakai 2 sheet: template_produk (baris dengan kode_produk sama digabung sebagai varian) dan template_bahan_baku (kode_sku_varian + kode_bahan + qty_pakai). Kategori wajib sudah ada dan ditulis 3 level.", content: "HPP tiap varian dihitung otomatis dari SUM(qty_pakai × harga satuan bahan) setelah resep berhasil diimport. Kode bahan atau kombinasi kategori yang tidak ditemukan membatalkan baris tersebut." },
  "raw-material": { relation: "Master bahan baku berdiri sendiri. Kode bahan harus unik per toko.", content: "Import ini tidak mengubah stok. Stok bahan baku dikelola melalui modul Stok Bahan Baku." },
  stock: { relation: "Gunakan SKU varian yang sudah tersedia. Import stok tidak membuat Produk atau Bahan Baku baru.", content: "Penambahan stok akan memakai bahan baku resep HPP otomatis jika resep tersedia." },
  customer: { relation: "Pelanggan dibuat sebagai User + seller_customers. Kode pelanggan unik per toko.", content: "Email digunakan untuk pencocokan pelanggan yang sudah ada." },
  sales: { relation: "Invoice merelasikan SKU produk, kode pelanggan, kode voucher, dan nama kasir.", content: "Kode pelanggan dicari dari seller_customers. Jika tidak ada, gunakan email/nama+telepon untuk pencocokan." },
  finance: { relation: "Transaksi keuangan: income/expense/receivable/payable. Pihak ke dicari dari users.name.", content: "Kode referensi opsional menghubungkan ke order. Jatuh tempo untuk piutang/hutang." },
  user: { relation: "User dengan role. Email unik. Role dibuat otomatis jika tidak ada (lowercase).", content: "Avatar disematkan di sel Excel. Password tidak di-set via import." },
  voucher: { relation: "Voucher dengan kode unik. Target: product/shipping. Tipe: fixed/percentage.", content: "Produk terkait dipisah dengan titik koma (;). Minimal belanja, item, diskon max." },
  promotion: { relation: "Promosi banner/iklan. Jenis klik: none/product/category/url.", content: "Gambar desktop & mobile disematkan. Pembayaran promosi opsional (payment_number)." },
  category: { relation: "Kategori memakai 3 kolom: kategori_level_1, kategori_level_2, kategori_level_3. Import membuat level 1 lalu level 2 dan 3 dengan parent_id terikat ke baris yang sama.", content: "Semua nama otomatis strtolower(trim()). Level 3 hanya boleh diisi jika level 2 terisi. Image & icon hanya diterapkan pada level 3." },
};

const IMPORT_MODES = [
  { value: "create", label: "Buat Baru", desc: "Hanya membuat data baru. Kode yang sudah ada ditolak.", icon: "add_box", tone: "emerald" },
  { value: "update", label: "Update", desc: "Hanya memperbarui data lama. Kode wajib sudah ada.", icon: "edit_note", tone: "blue" },
  { value: "upsert", label: "Upsert (Default)", desc: "Buat baru bila belum ada, perbarui bila sudah ada.", icon: "sync", tone: "amber" },
];

function Header({ icon, eyebrow, title, description, onClose }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-700">{icon}</span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center gap-[5px] rounded-[10px] bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200">
        <span className="material-symbols-outlined text-[18px]">close</span>
        Tutup
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

function Overlay({ children, onClose, size = "md" }) {
  if (typeof document === "undefined") return null;
  const width = size === "lg" ? "max-w-5xl" : "max-w-3xl";
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className={`my-auto w-full ${width}`}>{children}</div>
    </div>,
    document.body,
  );
}

function ImportPanel({ module, label, workspace }) {
  const center = useNotificationCenter();
  const tabs = usePanelTabs();
  const [file, setFile] = useState(null);
  const [templatePending, setTemplatePending] = useState(false);
  const [importMode, setImportMode] = useState("upsert");
  const help = MODULE_HELP[module] || null;

  const downloadTemplate = async () => {
    setTemplatePending(true);
    const task = center.startTask({ title: `Template ${label}`, message: "Menyiapkan template Excel..." });
    try {
      await downloadExcelTemplate(module);
      task.success("Template Excel berhasil diunduh.");
    } catch (error) {
      task.fail(getExcelError(error));
    } finally {
      setTemplatePending(false);
    }
  };

  // Import berjalan pada tab progres terpisah (loading bar, data berhasil/gagal).
  const startImport = () => {
    if (!file) return;
    tabs?.openOperationTab("import-progress", {
      label: `Import ${label}`,
      payload: { module, label, file, importMode, createMissingRelations: false, workspace },
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <Header
        icon="upload_file"
        eyebrow="Import Excel"
        title={`Import ${label}`}
        description="Unduh template resmi, isi datanya, lalu unggah file untuk memulai proses import."
        onClose={workspace.close}
      />
      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <div className="px-5 py-1 sm:px-7">
          <Step number="1" title="Unduh template resmi">
            {module === "product"
              ? "Template berisi 7 sheet: template_produk, template_bahan_baku, contoh_produk, contoh_produk_varian, contoh_produk_hpp, contoh_produk_varian_hpp, dan penjelasan_kolom."
              : "Template berisi 3 sheet: Template Kosong, Contoh Import, dan Penjelasan Kolom."}
            {help?.relation ? <p className="mt-2 text-xs text-slate-500">{help.relation}</p> : null}
            <div className="mt-3">
              <button type="button" onClick={downloadTemplate} disabled={templatePending} className="inline-flex h-10 items-center gap-[5px] rounded-[10px] bg-slate-900 px-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Template
              </button>
            </div>
          </Step>
          <Step number="2" title="Unggah file Excel">
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-emerald-500 hover:bg-emerald-50/40">
              <span className="material-symbols-outlined text-4xl text-emerald-600">upload_file</span>
              <span className="mt-2 text-sm font-extrabold text-slate-800">{file?.name || "Pilih file .xlsx atau .xls"}</span>
              <span className="mt-1 text-xs text-slate-500">Maksimum 20 MB. Gambar disematkan di dalam sel.</span>
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </label>
            {help?.content ? <p className="mt-2 text-xs text-slate-500">{help.content}</p> : null}
          </Step>
        </div>
        <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-black text-slate-900">Mode Import</h3>
          <div className="mt-3 grid gap-2">
            {IMPORT_MODES.map((mode) => {
              const active = importMode === mode.value;
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setImportMode(mode.value)}
                  className={`rounded-[10px] border p-2.5 text-left transition ${active ? `border-${mode.tone}-600 bg-${mode.tone}-50 ring-1 ring-${mode.tone}-600` : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <span className="flex items-center gap-[5px] text-xs font-black text-slate-900">
                    <span className={`material-symbols-outlined text-[17px] text-${mode.tone}-700`}>{mode.icon}</span>
                    {mode.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{mode.desc}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={startImport} disabled={!file} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-[5px] rounded-[10px] bg-emerald-600 px-4 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45">
            <span className="material-symbols-outlined text-[19px]">play_arrow</span>
            Mulai Import
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">Proses berjalan di tab progres terpisah.</p>
        </aside>
      </div>
    </div>
  );
}

function ImportProgressPanel({ workspace, module, label, file, importMode, createMissingRelations }) {
  const handleComplete = () => {
    workspace.complete();
  };

  const handleCancel = () => {
    workspace.close();
  };

  return (
    <ImportProgressTab
      module={module}
      label={label}
      file={file}
      importMode={importMode}
      createMissingRelations={createMissingRelations}
      onComplete={handleComplete}
      onCancel={handleCancel}
      workspace={workspace}
    />
  );
}

function ExportPanel({ module, label, workspace, selectedIds = [] }) {
  const center = useNotificationCenter();
  const [pending, setPending] = useState(false);
  const supportsImages = ["product", "category", "raw-material", "promotion", "voucher", "customer", "user"].includes(module);

  const submit = async () => {
    setPending(true);
    const task = center.startTask({ title: `Export ${label}`, message: selectedIds.length ? `Menyiapkan ${selectedIds.length} data terpilih...` : "Menyiapkan seluruh data..." });
    try {
      const result = await exportExcel(module, selectedIds);
      task.success(`Export selesai: ${result.filename}`);
    } catch (error) {
      task.fail(getExcelError(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <Header icon="download" eyebrow="Export Excel" title={`Export ${label}`} description={supportsImages ? "File berisi data + gambar thumbnail yang disematkan di sel." : "File berisi data realtime sesuai scope toko."} onClose={workspace.close} />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[10px] bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Cakupan</p><p className="mt-2 text-lg font-black text-slate-900">{selectedIds.length ? `${selectedIds.length} data dipilih` : "Semua data"}</p></div>
          <div className="rounded-[10px] bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Format</p><p className="mt-2 text-lg font-black text-slate-900">Excel .xlsx</p></div>
          <div className="rounded-[10px] bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Isi</p><p className="mt-2 text-lg font-black text-slate-900">{supportsImages ? "Data + gambar" : "Data realtime"}</p></div>
        </div>
        <button type="button" onClick={submit} disabled={pending} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-[5px] rounded-[10px] bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"><span className={`material-symbols-outlined text-[19px] ${pending ? "animate-spin" : ""}`}>download</span>Mulai Export</button>
      </div>
    </div>
  );
}

export function ExcelImportExportModal({ workspace, module, label, selectedIds = [] }) {
  const moduleLabel = label || MODULE_LABELS[module] || module;
  const activeOp = workspace.activeOperation;

  if (!activeOp) return null;

  if (activeOp.type === "import") {
    return (
      <Overlay onClose={workspace.close}>
        <ImportPanel module={module} label={moduleLabel} workspace={workspace} />
      </Overlay>
    );
  }

  if (activeOp.type === "import-progress") {
    const payload = activeOp.payload || {};
    return (
      <Overlay onClose={workspace.close} size="lg">
        <div className="h-[85vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <ImportProgressPanel
            workspace={workspace}
            module={module}
            label={moduleLabel}
            file={payload.file}
            importMode={payload.importMode}
            createMissingRelations={payload.createMissingRelations}
          />
        </div>
      </Overlay>
    );
  }

  if (activeOp.type === "export") {
    return (
      <Overlay onClose={workspace.close}>
        <ExportPanel module={module} label={moduleLabel} workspace={workspace} selectedIds={selectedIds} />
      </Overlay>
    );
  }

  return null;
}