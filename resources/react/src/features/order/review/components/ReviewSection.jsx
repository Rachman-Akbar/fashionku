import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

const PER_PAGE = 10;

function Stars({ value = 0, size = "h-4 w-4" }) {
  const rating = Number(value || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} className={`${size} ${index < Math.round(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatReviewDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export function ReviewSection({ reviews = [], summary = null, loading = false }) {
  const rows = Array.isArray(reviews) ? reviews : [];
  const location = useLocation();
  const [ratingFilter, setRatingFilter] = useState(0);
  const [variantFilter, setVariantFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (loading || !rows.length) return undefined;
    const targetId = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!targetId.startsWith("review-")) return undefined;
    const el = document.getElementById(targetId);
    if (!el) return undefined;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.setProperty("animation", "review-flash 2s ease");
    const timer = window.setTimeout(() => {
      el.style.removeProperty("animation");
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [loading, location.hash, rows.length]);

  const average = Number(summary?.average || summary?.rating || 0);
  const total = Number(summary?.total || summary?.count || rows.length || 0);
  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: rows.filter((row) => Math.round(Number(row.rating || 0)) === rating).length,
  }));

  const variants = useMemo(() => {
    const set = new Set();
    rows.forEach((row) => {
      const variant = row.variant_name || row.sku || "";
      if (variant) set.add(variant);
    });
    return [...set];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchRating = !ratingFilter || Math.round(Number(row.rating || 0)) === ratingFilter;
      const variant = row.variant_name || row.sku || "";
      const matchVariant = variantFilter === "all" || variant === variantFilter;
      return matchRating && matchVariant;
    });
  }, [rows, ratingFilter, variantFilter]);

  useEffect(() => {
    setPage(1);
  }, [ratingFilter, variantFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const changeRating = (value) => {
    setRatingFilter(value);
    setVariantFilter("all");
  };

  const changeVariant = (value) => {
    setVariantFilter(value);
    setRatingFilter(0);
  };

  return (
    <section className="mt-8 border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-base font-extrabold text-slate-950">Ulasan dan Rating Produk</h2>
        <p className="mt-1 text-xs text-slate-500">Penilaian hanya berasal dari buyer yang menyelesaikan atau menerima pesanan.</p>
      </header>

      <div className="grid gap-6 p-5 lg:grid-cols-[240px_1fr]">
        <div className="border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-end gap-2">
            <strong className="text-4xl font-extrabold text-slate-950">{average.toFixed(1)}</strong>
            <span className="pb-1 text-sm font-semibold text-slate-500">/ 5.0</span>
          </div>
          <div className="mt-2"><Stars value={average} size="h-5 w-5" /></div>
          <p className="mt-2 text-sm font-semibold text-slate-600">{total} ulasan pembeli</p>
          <div className="mt-5 grid gap-2">
            {counts.map((item) => {
              const width = rows.length ? Math.round((item.count / rows.length) * 100) : 0;
              const active = ratingFilter === item.rating;
              return (
                <button
                  key={item.rating}
                  type="button"
                  onClick={() => changeRating(item.rating)}
                  className={`grid grid-cols-[18px_1fr_28px] items-center gap-2 rounded-md px-1 py-0.5 text-xs transition ${
                    active ? "bg-amber-100 font-bold text-amber-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                  aria-pressed={active}
                >
                  <span>{item.rating}</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} /></div>
                  <span className="text-right">{item.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {[0, 5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeRating(value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  ratingFilter === value
                    ? "bg-amber-400 text-white"
                    : "border border-slate-300 text-slate-600 hover:border-amber-400 hover:text-amber-600"
                }`}
                aria-pressed={ratingFilter === value}
              >
                {value === 0 ? "Semua" : `${value} bintang`}
              </button>
            ))}
            {variants.length ? (
              <select
                value={variantFilter}
                onChange={(event) => changeVariant(event.target.value)}
                className="ml-auto rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 outline-none focus:border-amber-400"
              >
                <option value="all">Semua Varian</option>
                {variants.map((variant) => (
                  <option key={variant} value={variant}>{variant}</option>
                ))}
              </select>
            ) : null}
          </div>

          {!loading && pagedRows.length ? (
            <div className="divide-y divide-slate-100">
              {pagedRows.map((review) => (
                <article key={review.id} id={`review-${review.id}`} className="scroll-mt-24 py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{review.customer_name || review.user_name || review.buyer_name || "Pembeli"}</p>
                      <div className="mt-1"><Stars value={Number(review.rating || 0)} /></div>
                    </div>
                    <time className="text-xs text-slate-400">{formatReviewDate(review.created_at)}</time>
                  </div>
                  {review.variant_name || review.sku ? <p className="mt-2 text-xs text-slate-500">Varian: {review.variant_name || review.sku}</p> : null}
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{review.comment || review.review || "Pembeli memberikan rating tanpa komentar."}</p>
                  {Array.isArray(review.media) && review.media.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.media.map((url, index) => (
                        <img
                          key={`${review.id}-media-${index}`}
                          src={resolveMediaUrl(url)}
                          alt={`Lampiran ${index + 1}`}
                          className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
          {!loading && !pagedRows.length ? <div className="flex min-h-40 items-center justify-center border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">{(ratingFilter || variantFilter !== "all") ? "Tidak ada ulasan yang cocok dengan filter." : "Belum ada ulasan untuk produk ini."}</div> : null}

          {!loading && filteredRows.length > PER_PAGE ? (
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage(safePage - 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                &larr; Sebelumnya
              </button>
              <span>Halaman {safePage} dari {totalPages}</span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(safePage + 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya &rarr;
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
