import { useMemo, useState } from "react";
import { downloadExcelTemplate, exportExcel, getExcelError, importExcel, previewExcelImport } from "@/shared/excel/excelService";
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

function ImportPanel({ module, label, workspace }) {
  const center = useNotificationCenter();
  const tabs = usePanelTabs();
  const [file, setFile] = useState(null);
  const [pending, setPending] = useState(false);
  const [templatePending, setTemplatePending] = useState(false);
  const [importMode, setImportMode] = useState("upsert");
  const [createMissingRelations, setCreateMissingRelations] = useState(false);
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

  const handleStartImport = async () => {
    if (!file || pending) return;
    setPending(true);
    
    try {
      const preview = await previewExcelImport(module, file, { importMode });
      const blocking = preview.blocking_relations || [];
      const missing = preview.missing_relations || [];

      if (blocking.length) {
        const details = blocking.slice(0, 5).map((item) => `${item.type}: ${item.name}`).join(", ");
        center.push({
          type: "error",
          title: `Validasi ${label}`,
          message: `Import belum dapat dilanjutkan. Relasi berikut wajib dibuat manual: ${details}${blocking.length > 5 ? ` dan ${blocking.length - 5} lainnya` : ""}.`,
        });
        center.setActiveTab("info");
        center.setOpen(true);
        setPending(false);
        return;
      }

      if (preview.requires_confirmation && missing.length) {
        const confirmed = await new Promise((resolve) => {
          const taskId = center.push({
            type: "queue",
            title: `Konfirmasi Import ${label}`,
            message: `${preview.total_rows || 0} baris siap diperiksa. Relasi belum tersedia: ${missing.slice(0, 6).map((item) => `${item.type}: ${item.name}`).join(", ")}${missing.length > 6 ? ` dan ${missing.length - 6} lainnya` : ""}. Lanjutkan untuk membuat relasi tersebut otomatis, atau batalkan import.`,
            status: "waiting",
            actionLabel: "Lanjutkan",
            secondaryActionLabel: "Batal",
            onAction: () => resolve(true),
            onSecondaryAction: () => resolve(false),
          });
          center.setActiveTab("queue");
          center.setOpen(true);
        });

        if (!confirmed) {
          center.remove(center.queueItems[0]?.id);
          setPending(false);
          return;
        }
        setCreateMissingRelations(true);
      }

      center.push({ type: "success", title: `Validasi ${label}`, message: "File valid. Memulai import...", brief: true });

      tabs?.openOperationTab("import-progress", {
        label: `Import ${label}`,
        payload: { module, label, file, importMode, createMissingRelations, workspace },
      });

    } catch (error) {
      center.push({ type: "error", title: `Validasi ${label}`, message: getExcelError(error) });
      center.setActiveTab("info");
      center.setOpen(true);
    } finally {
      setPending(false);
      setCreateMissingRelations(false);
    }
  };

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">        <Header icon="upload_file" eyebrow="Import Excel" title={`Import ${label}`} description={module === "product" ? "Template 7 sheet: template_produk, template_bahan_baku, contoh_produk, contoh_produk_varian, contoh_produk_hpp, contoh_produk_varian_hpp, penjelasan_kolom. Gambar disematkan di dalam sel." : "Template 3 sheet: Template Kosong, Contoh Import, Penjelasan Kolom. Gambar disematkan di dalam sel."} onClose={workspace.close} />
      <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
        <div className="px-5 sm:px-7">
          <Step number="1" title="Pilih jenis import">
            <div className="grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={() => setImportMode("create")} className={`border p-4 text-left transition ${importMode === "create" ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <span className="flex items-center gap-[5px] text-sm font-black text-slate-900"><span className="material-symbols-outlined text-[19px] text-emerald-700">add_box</span>Buat Baru</span>
                <span className="mt-2 block text-xs leading-5 text-slate-600">Hanya membuat data baru. Kode yang sudah ada ditolak.</span>
              </button>
              <button type="button" onClick={() => setImportMode("update")} className={`border p-4 text-left transition ${importMode === "update" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <span className="flex items-center gap-[5px] text-sm font-black text-slate-900"><span className="material-symbols-outlined text-[19px] text-blue-700">edit_note</span>Update</span>
                <span className="mt-2 block text-xs leading-5 text-slate-600">Hanya update data existing. Kode wajib ada.</span>
              </button>
              <button type="button" onClick={() => setImportMode("upsert")} className={`border p-4 text-left transition ${importMode === "upsert" ? "border-amber-600 bg-amber-50 ring-1 ring-amber-600" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <span className="flex items-center gap-[5px] text-sm font-black text-slate-900"><span className="material-symbols-outlined text-[19px] text-amber-700">sync</span>Upsert (Default)</span>
                <span className="mt-2 block text-xs leading-5 text-slate-600">Buat baru jika kode tidak ada, update jika ada.</span>
              </button>
            </div>
          </Step>
          <Step number="2" title="Unduh template resmi">
            {module === "product" ? "Template berisi 7 sheet: template_produk, template_bahan_baku, contoh_produk (tanpa varian), contoh_produk_varian, contoh_produk_hpp, contoh_produk_varian_hpp, dan penjelasan_kolom lengkap dengan aturan HPP otomatis." : "Template berisi 3 sheet: Template Kosong, Contoh Import (2-3 baris), Penjelasan Kolom lengkap."}
            <div className="mt-3"><button type="button" onClick={downloadTemplate} disabled={templatePending} className="inline-flex h-10 items-center gap-[5px] bg-slate-900 px-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"><span className="material-symbols-outlined text-[18px]">download</span>Download Template</button></div>
          </Step>
          <Step number="3" title="Periksa aturan relasi">
            {help?.relation || "Relasi diisi sesuai Penjelasan Kolom pada template. Data relasi wajib tidak dibuat otomatis tanpa konfirmasi."}
          </Step>
          <Step number="4" title="Isi data sesuai format">
            {help?.content || "Isi hanya kolom yang menjadi tanggung jawab modul ini. Teks relasi (nama kategori, username, kode) akan dinormalisasi ke lowercase."}
          </Step>
          <Step number="5" title="Pilih file Excel">
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-emerald-500 hover:bg-emerald-50/40">
              <span className="material-symbols-outlined text-4xl text-emerald-600">upload_file</span>
              <span className="mt-2 text-sm font-extrabold text-slate-800">{file?.name || "Pilih file .xlsx atau .xls"}</span>
              <span className="mt-1 text-xs text-slate-500">Maksimum 20 MB. Gambar disematkan di dalam sel.</span>
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </label>
          </Step>
        </div>
        <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-black text-slate-900">Ringkasan</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Mode: <strong>{importMode === "create" ? "Buat Baru" : importMode === "update" ? "Update" : "Upsert"}</strong>.</p>
            <p>File divalidasi sebelum disimpan (preview otomatis).</p>
            <p>Relasi (kode/nama/username) dicari case-insensitive & lowercase.</p>
            <p>Gambar diekstrak dari sel & disimpan ke storage.</p>
            <p>Data gagal → file error Excel otomatis diunduh.</p>
          </div>
          <button type="button" onClick={handleStartImport} disabled={!file || pending} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-[5px] bg-emerald-600 px-4 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45">
            <span className={`material-symbols-outlined text-[19px] ${pending ? "animate-spin" : ""}`}>fact_check</span>
            {pending ? "Memvalidasi..." : "Validasi & Import"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function ImportProgressPanel({ workspace, module, label, file, importMode, createMissingRelations }) {
  const handleComplete = (result) => {
    workspace.complete();
    if (result?.download_error_url) {
      // File error tersedia untuk diunduh
    }
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
    <div className="overflow-hidden border border-slate-200 bg-white">
      <Header icon="download" eyebrow="Export Excel" title={`Export ${label}`} description={supportsImages ? "File berisi data + gambar thumbnail yang disematkan di sel." : "File berisi data realtime sesuai scope toko."} onClose={workspace.close} />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Cakupan</p><p className="mt-2 text-lg font-black text-slate-900">{selectedIds.length ? `${selectedIds.length} data dipilih` : "Semua data"}</p></div>
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Format</p><p className="mt-2 text-lg font-black text-slate-900">Excel .xlsx {module === "product" ? "(2 sheet: produk + bahan baku)" : "(3 sheet)"}</p></div>
          <div className="bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">Isi</p><p className="mt-2 text-lg font-black text-slate-900">{supportsImages ? "Data + gambar" : "Data realtime"}</p></div>
        </div>
        <button type="button" onClick={submit} disabled={pending} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-[5px] bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"><span className={`material-symbols-outlined text-[19px] ${pending ? "animate-spin" : ""}`}>download</span>Mulai Export</button>
      </div>
    </div>
  );
}

export function ExcelImportExportModal({ workspace, module, label, selectedIds = [] }) {
  const moduleLabel = label || MODULE_LABELS[module] || module;
  const activeOp = workspace.activeOperation;

  if (!activeOp) return null;

  if (activeOp.type === "import") {
    return <ImportPanel module={module} label={moduleLabel} workspace={workspace} />;
  }

  if (activeOp.type === "import-progress") {
    const payload = activeOp.payload || {};
    return (
      <ImportProgressPanel
        workspace={workspace}
        module={module}
        label={moduleLabel}
        file={payload.file}
        importMode={payload.importMode}
        createMissingRelations={payload.createMissingRelations}
      />
    );
  }

  if (activeOp.type === "export") {
    return <ExportPanel module={module} label={moduleLabel} workspace={workspace} selectedIds={selectedIds} />;
  }

  return null;
}