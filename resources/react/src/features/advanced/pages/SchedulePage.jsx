import { useState } from "react";

const initialSchedules = [
  { id: 1, title: "Cek stok bahan baku", waktu: "08:00", hari: "Senin", jenis: "Stok", status: "Aktif" },
  { id: 2, title: "Rekonsiliasi transaksi harian", waktu: "18:00", hari: "Senin - Jumat", jenis: "Transaksi", status: "Aktif" },
  { id: 3, title: "Kirim laporan keuangan mingguan", waktu: "09:00", hari: "Senin", jenis: "Laporan", status: "Nonaktif" },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [form, setForm] = useState({ title: "", waktu: "", hari: "", jenis: "Stok" });
  const [open, setOpen] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.waktu || !form.hari) return;
    const next = { id: Date.now(), ...form, status: "Aktif" };
    setSchedules([...schedules, next]);
    setForm({ title: "", waktu: "", hari: "", jenis: "Stok" });
    setOpen(false);
  };

  const toggleStatus = (id) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, status: s.status === "Aktif" ? "Nonaktif" : "Aktif" } : s)));
  };

  const remove = (id) => setSchedules(schedules.filter((s) => s.id !== id));

  const typeColors = { Stok: "bg-emerald-50 text-emerald-700", Transaksi: "bg-blue-50 text-blue-700", Laporan: "bg-indigo-50 text-indigo-700" };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { setForm({ title: "", waktu: "", hari: "", jenis: "Stok" }); setOpen(true); }}
            className="flex items-center gap-2 rounded-[10px] bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Tambah Jadwal</span>
          </button>
        </div>

        <div className="border border-slate-200 bg-white rounded-[10px] shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 w-24">Jadwal</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Waktu</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Hari</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Jenis</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 w-16">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.waktu}</td>
                  <td className="px-4 py-3 text-slate-600">{item.hari}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColors[item.jenis] || typeColors.Stok}`}>{item.jenis}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleStatus(item.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${item.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {item.status === "Aktif" ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      aria-label="Hapus jadwal"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {!schedules.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">Belum ada jadwal pengingat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-extrabold text-slate-950">Tambah Jadwal Pengingat</h2>
              <form onSubmit={handleSave} className="mt-4 space-y-3">
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Judul Jadwal</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Waktu</label>
                    <input required type="time" value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })} className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Jenis</label>
                    <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })} className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="Stok">Stok</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Laporan">Laporan</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Hari</label>
                  <input required value={form.hari} onChange={(e) => setForm({ ...form, hari: e.target.value })} placeholder="Contoh: Senin - Jumat" className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-[10px] border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                  <button type="submit" className="h-10 rounded-[10px] bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
