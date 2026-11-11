import { Link } from "react-router-dom";

export default function HomeHeader() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
        alt="Koleksi fashion Fashionku"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-emerald-900/20" />
      <div className="relative grid gap-6 px-6 py-10 sm:px-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
            Toko Resmi Fashionku
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Gaya Terbaru, Kualitas Terbaik untuk Setiap Hari
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-100/90 sm:text-base">
            Temukan koleksi fashion pilihan, promo menarik, dan pengalaman belanja aman
            dalam satu toko. Dari outfit harian hingga momen spesial, semua ada di sini.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(16,185,129,0.35)] transition hover:bg-[#059669]"
            >
              Belanja Sekarang
            </Link>
            <Link
              to="/promotions"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Lihat Semua Promo
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "local_shipping", title: "Pengiriman Cepat", desc: "Aman & tepat waktu" },
            { icon: "verified", title: "Kualitas Terjamin", desc: "Kurasi produk terbaik" },
            { icon: "sell", title: "Promo Menarik", desc: "Penawaran setiap hari" },
            { icon: "support_agent", title: "Layanan Ramah", desc: "Bantuan responsif" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <span className="material-symbols-outlined text-emerald-300">{item.icon}</span>
              <p className="mt-2 text-sm font-black text-white">{item.title}</p>
              <p className="text-xs text-slate-200/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
