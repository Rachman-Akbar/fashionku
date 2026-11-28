import CodePatternSettingsPage from "@/features/advanced/pages/CodePatternSettingsPage";

export default function AdminStoreCodePage() {
  return (
    <section className="space-y-4">
      <header>
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">tune</span>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
            Kode Custom
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Atur pola kode unik otomatis untuk produk, bahan baku, pesanan, dan stok.
        </p>
      </header>

      <CodePatternSettingsPage />
    </section>
  );
}
