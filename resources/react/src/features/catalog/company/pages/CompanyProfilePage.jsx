export default function CompanyProfilePage() {
  const stats = [
    { value: "50K+", label: "Pelanggan Puas" },
    { value: "120+", label: "Koleksi Produk" },
    { value: "4", label: "Cabang & Titik Layanan" },
    { value: "4.9/5", label: "Rating Kepuasan" },
  ];

  const branches = [
    {
      name: "Kantor Pusat — Jakarta",
      type: "Head Office & Flagship Store",
      address: "Jl. Sudirman Kav. 1, Jakarta Pusat, DKI Jakarta 10220",
      phone: "0812-3456-7890",
      hours: "Senin–Minggu, 09.00–21.00 WIB",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      badge: "Utama",
    },
    {
      name: "Cabang Bandung",
      type: "Store & Pick-up Point",
      address: "Jl. Braga No. 45, Sumur Bandung, Kota Bandung, Jawa Barat 40111",
      phone: "0813-1111-2233",
      hours: "Senin–Sabtu, 10.00–20.00 WIB",
      image:
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=80",
      badge: "Cabang",
    },
    {
      name: "Cabang Surabaya",
      type: "Store & Pick-up Point",
      address: "Jl. Tunjungan No. 88, Genteng, Kota Surabaya, Jawa Timur 60275",
      phone: "0813-4444-5566",
      hours: "Senin–Sabtu, 10.00–20.00 WIB",
      image:
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=900&q=80",
      badge: "Cabang",
    },
    {
      name: "Cabang Yogyakarta",
      type: "Store & Pick-up Point",
      address: "Jl. Malioboro No. 120, Gedong Tengen, Kota Yogyakarta, DIY 55271",
      phone: "0813-7777-8899",
      hours: "Senin–Minggu, 10.00–21.00 WIB",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80",
      badge: "Cabang",
    },
  ];

  const gallery = [
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      title: "Koleksi Fashion Terkini",
      desc: "Pilihan outfit trendi untuk berbagai gaya.",
    },
    {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      title: "Kualitas & Detail",
      desc: "Material nyaman dengan finishing rapi.",
    },
    {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      title: "Pengalaman Belanja",
      desc: "Layanan ramah di toko dan online.",
    },
  ];

  const values = [
    {
      title: "Produk Berkualitas",
      desc: "Kurasi bahan nyaman, tahan lama, dan mengikuti tren fashion terkini.",
      icon: "checkroom",
    },
    {
      title: "Pengiriman Cepat & Aman",
      desc: "Bermitra dengan kurir terpercaya agar pesanan tiba tepat waktu.",
      icon: "local_shipping",
    },
    {
      title: "Layanan Pelanggan Ramah",
      desc: "Tim support responsif membantu sebelum dan sesudah pembelian.",
      icon: "support_agent",
    },
    {
      title: "Harga Transparan",
      desc: "Promo jujur, tanpa biaya tersembunyi, nilai terbaik untuk pelanggan.",
      icon: "sell",
    },
  ];

  return (
    <main className="bg-white text-[#1b1c1c]">
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=80"
          alt="Toko fashion Fashionku"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-emerald-900/30" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1200px] flex-col justify-center px-6 py-16 sm:min-h-[520px] lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur">
            Portofolio Perusahaan
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Fashionku — Fashion Berkualitas untuk Semua Generasi
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/90 sm:text-lg">
            Kami adalah marketplace fashion yang menghadirkan pakaian, aksesori,
            dan kebutuhan gaya hidup dengan kurasi kualitas, harga terjangkau,
            pengiriman cepat, serta layanan yang ramah di seluruh Indonesia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-xl bg-[#10B981] px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(16,185,129,0.35)] transition hover:bg-[#059669]"
            >
              Mulai Belanja
            </a>
            <a
              href="#cabang"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Lihat Cabang Kami
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:grid-cols-4 sm:p-6">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-2xl font-black text-[#10B981] sm:text-3xl">{item.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#10B981]">Tentang Kami</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Toko fashion terpercaya dengan jangkauan cabang yang terus bertumbuh
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Fashionku hadir untuk memudahkan pelanggan menemukan gaya terbaik dalam satu tempat.
            Kami menggabungkan pengalaman belanja online yang praktis dengan kehadiran toko fisik
            di beberapa kota, sehingga pelanggan dapat berbelanja, mengambil pesanan, dan
            mendapatkan layanan secara lebih dekat.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Dengan komitmen pada kualitas produk, ketepatan pengiriman, dan keamanan transaksi,
            kami terus berinovasi menghadirkan koleksi fashion yang relevan untuk kebutuhan harian
            hingga momen spesial.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-[#ecfdf5] p-6">
            <p className="text-sm font-black uppercase tracking-wider text-[#059669]">Visi</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Menjadi platform dan toko fashion pilihan utama di Indonesia yang terpercaya,
              inklusif, dan menghadirkan produk berkualitas untuk semua kalangan.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <p className="text-sm font-black uppercase tracking-wider text-[#059669]">Misi</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Menyediakan koleksi berkualitas dengan harga terjangkau, pengalaman belanja yang
              aman dan nyaman, serta pelayanan responsif di setiap kanal online maupun cabang.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl sm:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80"
              alt="Tim dan layanan Fashionku"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#10B981]">Keunggulan</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Nilai & Layanan Utama</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Komitmen kami dalam memberikan pengalaman belanja fashion terbaik.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10B981]">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="mt-4 text-base font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#10B981]">Portofolio</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Galeri & Koleksi</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Sekilas suasana toko dan ragam koleksi fashion yang kami hadirkan.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {gallery.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="cabang" className="bg-[#0f172a] py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Jaringan Kami</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Cabang & Titik Layanan</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Kunjungi kantor pusat atau cabang Fashionku terdekat untuk pengalaman belanja langsung
              dan layanan pick-up.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {branches.map((branch) => (
              <article key={branch.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="relative h-44">
                  <img src={branch.image} alt={branch.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#10B981] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white">
                    {branch.badge}
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-lg font-black text-white">{branch.name}</h3>
                    <p className="text-sm font-semibold text-emerald-300">{branch.type}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-200">
                    <li className="flex gap-2">
                      <span className="material-symbols-outlined text-base text-emerald-300">location_on</span>
                      <span>{branch.address}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="material-symbols-outlined text-base text-emerald-300">call</span>
                      <span>{branch.phone}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="material-symbols-outlined text-base text-emerald-300">schedule</span>
                      <span>{branch.hours}</span>
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
        <div className="grid gap-6 rounded-3xl border border-[#10B981]/20 bg-[#ecfdf5] p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#059669]">Hubungi Kami</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Siap melayani kebutuhan fashion Anda</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Untuk kerja sama, pertanyaan produk, atau informasi cabang, tim kami siap membantu.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/" className="rounded-xl bg-[#10B981] px-6 py-3 text-sm font-black text-white transition hover:bg-[#059669]">
                Mulai Belanja
              </a>
              <a href="/chat" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Hubungi Kami
              </a>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-slate-900">Informasi Kontak</p>
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Alamat:</span> Jl. Sudirman Kav. 1, Jakarta Pusat</p>
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Telepon:</span> 0812-3456-7890</p>
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Email:</span> support@fashionku.test</p>
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Jam Operasional:</span> Senin–Minggu, 09.00–21.00 WIB</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">&copy; 2026 Fashionku. Hak cipta dilindungi.</p>
      </section>
    </main>
  );
}
