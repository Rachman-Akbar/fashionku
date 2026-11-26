import CodePatternSettingsPage from "@/features/advanced/pages/CodePatternSettingsPage";

export default function AdminStoreCodePage() {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-slate-900">Kode Custom</h2>
        <p className="mt-1 text-sm text-slate-500">
          Atur pola kode unik otomatis untuk produk, bahan baku, pesanan, dan stok.
        </p>
      </div>
      <CodePatternSettingsPage />
    </section>
  );
}