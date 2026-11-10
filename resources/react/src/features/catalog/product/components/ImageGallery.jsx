import { useEffect, useMemo, useState } from "react";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";

export function ImageGallery({ images = [], alt = "Product" }) {
  const galleryImages = useMemo(() => {
    const mapped = images
      .map((image) =>
        typeof image === "string" ? { url: image, alt_text: alt } : image,
      )
      .filter((image) => image?.url);
    return mapped.length ? mapped : [{ url: PLACEHOLDER_IMAGE, alt_text: alt }];
  }, [images, alt]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [galleryImages.length]);

  const prev = () =>
    setActive((a) => (a - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setActive((a) => (a + 1) % galleryImages.length);

  return (
    <div className="sticky top-20">
      <div
        className="relative overflow-hidden border border-gray-200 mb-3 aspect-square"
        style={{ borderRadius: 5 }}
      >
        <img
          src={galleryImages[active]?.url || PLACEHOLDER_IMAGE}
          alt={galleryImages[active]?.alt_text || alt}
          className="w-full h-full object-cover transition-opacity duration-200"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center transition-all"
              style={{ borderRadius: 5 }}
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>

            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center transition-all"
              style={{ borderRadius: 5 }}
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? "bg-[#10B981] w-3" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {galleryImages.map((img, i) => (
          <button
            key={img.id || img.url || i}
            onClick={() => setActive(i)}
            className={`overflow-hidden border-2 flex-1 transition-all ${i === active ? "border-[#10B981]" : "border-gray-200 hover:border-gray-400"}`}
            style={{ borderRadius: 5 }}
          >
            <img
              src={img.url}
              alt={img.alt_text || `${alt} ${i + 1}`}
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
