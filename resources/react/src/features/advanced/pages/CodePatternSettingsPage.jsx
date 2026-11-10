import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getCodePatternError,
  renderCodePattern,
  useCodePatterns,
  useSaveCodePatterns,
} from "@/features/advanced/services/codePatternService";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const FALLBACK_TOKENS = {
  type: "Tipe kode, mis. SKU/RM/INV",
  name: "Nama produk atau bahan baku",
  brand: "Merek produk",
  category: "Kategori produk",
  store: "Nama toko",
  movement: "Jenis pergerakan stok",
  status: "Status transaksi",
  year: "Tahun, mis. 26",
  month: "Bulan, mis. 09",
  day: "Tanggal, mis. 27",
  date: "Tanggal lengkap, mis. 260927",
  time: "Waktu, mis. 142530",
  datetime: "Tanggal dan waktu",
  seq: "Nomor urut harian",
  rand: "Kode acak",
};

function PatternField({ item, value, onChange, onReset }) {
  const sample = useMemo(() => renderCodePattern(value || item.default), [item.default, value]);
  const isCustomized = value && value !== item.default;

  return (
    <div className="panel-surface space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-800">{item.label}</p>
          <p className="text-[11px] text-slate-500">
            Rumus bawaan: <code className="rounded-md bg-slate-100 px-1 py-0.5 text-[10px] text-slate-600">{item.default}</code>
            {item.scope === "store" ? " · memakai rumus toko ini" : item.scope === "global" ? " · memakai rumus global" : " · memakai rumus bawaan sistem"}
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={() => onReset(item.type)} disabled={!isCustomized} title="Kembalikan ke rumus bawaan">
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          Bawaan
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value || ""}
          onChange={(event) => onChange(item.type, event.target.value)}
          placeholder={item.default}
          spellCheck={false}
          className="font-mono text-[13px] uppercase"
        />
        <div className="flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-emerald-50 px-3 text-[13px] font-black text-emerald-700 ring-1 ring-emerald-200 sm:min-w-[220px]">
          <span className="material-symbols-outlined text-[16px]">preview</span>
          <span className="truncate font-mono" title={sample}>{sample || "—"}</span>
        </div>
      </div>
    </div>
  );
}

export default function CodePatternSettingsPage() {
  const { activeRole, store } = useAuth();
  const isAdmin = activeRole === "admin";
  const query = useCodePatterns();
  const saveMutation = useSaveCodePatterns();

  const serverPatterns = useMemo(() => query.data?.patterns || [], [query.data?.patterns]);
  const tokens = useMemo(() => query.data?.tokens || FALLBACK_TOKENS, [query.data?.tokens]);

  const [draft, setDraft] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || !serverPatterns.length) return;
    setDraft(Object.fromEntries(serverPatterns.map((item) => [item.type, item.pattern])));
  }, [serverPatterns, touched]);

  const items = useMemo(
    () => serverPatterns.map((item) => ({ ...item, pattern: draft[item.type] ?? item.pattern })),
    [draft, serverPatterns],
  );

  const change = (type, value) => {
    setTouched(true);
    setDraft((current) => ({ ...current, [type]: value.toUpperCase() }));
  };

  const reset = (type) => {
    setTouched(true);
    setDraft((current) => ({ ...current, [type]: "" }));
  };

  const insertToken = (targetType, token) => {
    setTouched(true);
    setDraft((current) => ({ ...current, [targetType]: `${current[targetType] || ""}{${token}}` }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saveMutation.isPending) return;

    try {
      await saveMutation.mutateAsync({ patterns: draft });
      setTouched(false);
      toastSuccess("Rumus Kode Unik", "Rumus kode unik berhasil disimpan dan langsung dipakai saat kode dibuat otomatis.");
    } catch (error) {
      toastError("Rumus Kode Unik", getCodePatternError(error));
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="panel-surface space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Rumus Kode Unik</h2>
            <p className="text-[11px] text-slate-500">
              Atur pola kode yang dibuat otomatis oleh sistem. Kode tetap bisa diketik manual pada form produk, bahan baku, pesanan, dan stok.
            </p>
          </div>
          <div className="flex items-center gap-[5px]">
            <Button type="button" variant="ghost" onClick={() => { setDraft({}); setTouched(false); }} disabled={!touched}>
              <span className="material-symbols-outlined text-[16px]">undo</span>
              Batalkan
            </Button>
            <Button type="submit" disabled={saveMutation.isPending || query.isLoading}>
              <span className="material-symbols-outlined text-[16px]">save</span>
              {saveMutation.isPending ? "Menyimpan..." : "Simpan Rumus"}
            </Button>
          </div>
        </div>

        <div className="rounded-[10px] bg-amber-50 p-3 text-[11px] text-amber-800 ring-1 ring-amber-200">
          <p className="font-extrabold">Cara pakai rumus</p>
          <p className="mt-1">
            Tulis bebas dengan penanda kurung kurawal. Contoh: <code className="font-mono font-bold">{`{type}-{name:6}-{date}-{seq:3}`}</code> menghasilkan
            {" "}<code className="font-mono font-bold">RM-GULAPA-260927-001</code>. Angka setelah titik dua membatasi panjang nilai token. Klik token di bawah untuk menyisipkannya ke rumus aktif.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(tokens).map(([token, description]) => (
              <button
                key={token}
                type="button"
                onClick={() => insertToken(items.find((item) => item.pattern !== item.default)?.type || items[0]?.type, token)}
                title={description}
                className="rounded-md bg-white px-2 py-1 font-mono text-[11px] font-bold text-slate-700 ring-1 ring-amber-300 transition-colors hover:bg-amber-100"
              >
                {`{${token}}`}
              </button>
            ))}
          </div>
        </div>

        {isAdmin ? (
          <p className="text-[11px] text-slate-500">
            Mode admin: rumus disimpan untuk toko <strong className="font-bold text-slate-700">{store?.name || "semua toko"}</strong>. Kosongkan kolom untuk memakai rumus bawaan sistem.
          </p>
        ) : null}
      </div>

      {query.isLoading ? <div className="panel-surface p-6 text-center text-sm text-slate-500">Memuat rumus kode unik...</div> : null}
      {query.isError ? <div className="panel-surface p-6 text-center text-sm text-rose-600">Rumus kode unik gagal dimuat. Muat ulang halaman untuk mencoba lagi.</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <PatternField key={item.type} item={item} value={item.pattern} onChange={change} onReset={reset} />
        ))}
      </div>
    </form>
  );
}
