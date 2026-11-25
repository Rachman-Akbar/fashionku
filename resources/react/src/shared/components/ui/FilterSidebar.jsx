import { useState } from "react";

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function formatNumber(value) {
  if (!value) return "";
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("id-ID");
}

function parseNumber(value) {
  return value.replace(/\D/g, "");
}

export function FilterSidebar({
  showCategories = true,
  categories = [],
  filters,
  onChange,
  sort,
  onSortChange,
}) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);

  const update = (patch) => onChange?.({ ...filters, ...patch });

  return (
    <div
      className="bg-white border border-gray-100 p-4 sticky top-24"
      style={{ borderRadius: 5 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1b1c1c]">Filter</h3>
        <button
          type="button"
          onClick={() =>
            onChange?.({
              categories: [],
              minPrice: "",
              maxPrice: "",
              hasDiscount: false,
            })
          }
          className="text-xs font-bold text-[#047857] hover:underline"
        >
          Reset
        </button>
      </div>

      {showCategories && categories.length > 0 ? (
        <div className="border-b border-[#bccbb4] pb-4 mb-4">
          <button
            type="button"
            className="mb-3 flex w-full items-center justify-between"
            onClick={() => setCategoryOpen((value) => !value)}
          >
            <span className="text-xs font-bold">Kategori</span>
            <span className="material-symbols-outlined text-sm">
              {categoryOpen ? "expand_less" : "expand_more"}
            </span>
          </button>
          {categoryOpen ? (
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {categories.map((category) => (
                <label
                  key={category.id || category.slug}
                  className="flex cursor-pointer items-center gap-[5px] group"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(String(category.id))}
                    onChange={() =>
                      update({
                        categories: toggleValue(
                          filters.categories,
                          String(category.id),
                        ),
                      })
                    }
                    className="rounded text-[#047857] focus:ring-[#047857] h-4 w-4 border-[#6d7b67]"
                  />
                  <span className="text-sm group-hover:text-[#047857] transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="border-b border-[#bccbb4] pb-4 mb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between mb-3"
          onClick={() => setDiscountOpen((value) => !value)}
        >
          <span className="text-xs font-bold">Diskon</span>
          <span className="material-symbols-outlined text-sm">
            {discountOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
        {discountOpen ? (
          <div className="space-y-3">
            <label className="flex items-center gap-[5px] cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasDiscount}
                onChange={() => update({ hasDiscount: !filters.hasDiscount })}
                className="rounded text-[#047857] focus:ring-[#047857] h-4 w-4 border-[#6d7b67]"
              />
              <span className="text-sm group-hover:text-[#047857] transition-colors">
                Hanya produk diskon
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <div className="border-b border-[#bccbb4] pb-4 mb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between mb-3"
          onClick={() => setPriceOpen((value) => !value)}
        >
          <span className="text-xs font-bold">Harga</span>
          <span className="material-symbols-outlined text-sm">
            {priceOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
        {priceOpen ? (
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4a39] text-xs">
                Rp
              </span>
              <input
                value={formatNumber(filters.minPrice)}
                onChange={(event) =>
                  update({ minPrice: parseNumber(event.target.value) })
                }
                onBlur={(event) => {
                  const formatted = formatNumber(event.target.value);
                  event.target.value = formatted;
                }}
                className="w-full pl-8 pr-3 py-1.5 border border-[#bccbb4] rounded-lg text-xs focus:ring-[#047857] focus:border-[#047857] outline-none"
                placeholder="Harga Minimum"
                inputMode="numeric"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4a39] text-xs">
                Rp
              </span>
              <input
                value={formatNumber(filters.maxPrice)}
                onChange={(event) =>
                  update({ maxPrice: parseNumber(event.target.value) })
                }
                onBlur={(event) => {
                  const formatted = formatNumber(event.target.value);
                  event.target.value = formatted;
                }}
                className="w-full pl-8 pr-3 py-1.5 border border-[#bccbb4] rounded-lg text-xs focus:ring-[#047857] focus:border-[#047857] outline-none"
                placeholder="Harga Maksimum"
                inputMode="numeric"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between mb-3"
          onClick={() => setSortOpen((value) => !value)}
        >
          <span className="text-xs font-bold">Urutkan</span>
          <span className="material-symbols-outlined text-sm">
            {sortOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
        {sortOpen ? (
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 cursor-pointer ${
                sort === "relevance"
                  ? "text-[#047857] font-bold"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value="relevance"
                checked={sort === "relevance"}
                onChange={() => onSortChange?.("relevance")}
                className="text-[#047857] focus:ring-[#047857]"
              />
              <span className="text-sm">Paling Sesuai</span>
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer ${
                sort === "latest"
                  ? "text-[#047857] font-bold"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value="latest"
                checked={sort === "latest"}
                onChange={() => onSortChange?.("latest")}
                className="text-[#047857] focus:ring-[#047857]"
              />
              <span className="text-sm">Terbaru</span>
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer ${
                sort === "price_asc"
                  ? "text-[#047857] font-bold"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value="price_asc"
                checked={sort === "price_asc"}
                onChange={() => onSortChange?.("price_asc")}
                className="text-[#047857] focus:ring-[#047857]"
              />
              <span className="text-sm">Harga Terendah</span>
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer ${
                sort === "price_desc"
                  ? "text-[#047857] font-bold"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value="price_desc"
                checked={sort === "price_desc"}
                onChange={() => onSortChange?.("price_desc")}
                className="text-[#047857] focus:ring-[#047857]"
              />
              <span className="text-sm">Harga Tertinggi</span>
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer ${
                sort === "most_reviewed"
                  ? "text-[#047857] font-bold"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value="most_reviewed"
                checked={sort === "most_reviewed"}
                onChange={() => onSortChange?.("most_reviewed")}
                className="text-[#047857] focus:ring-[#047857]"
              />
              <span className="text-sm">Ulasan Terbanyak</span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}