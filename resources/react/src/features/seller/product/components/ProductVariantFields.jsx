import { memo, useEffect, useState } from "react";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { createClientId } from "@/core/utils/clientId";
import { toTitleCase } from "@/shared/utils/textFormatter";

function emptyValue() {
  return { clientId: createClientId("attribute-value"), attributeId: "", value: "" };
}

function emptyVariant() {
  return { clientId: createClientId("variant"), id: null, name: "", sku: "", price: "", stock: 0, values: [] };
}

export const ProductVariantFields = memo(function ProductVariantFields({ variants, attributes, onChange, onCreateAttribute, creatingAttribute = false }) {
  const [expanded, setExpanded] = useState(() => new Set(variants.map((variant, index) => variant.id || variant.clientId || index)));

  useEffect(() => {
    setExpanded((current) => {
      const next = new Set(current);
      variants.forEach((variant, index) => {
        const key = variant.id || variant.clientId || index;
        if (!current.size) next.add(key);
      });
      return next;
    });
  }, [variants]);

  const updateVariant = (index, field, value) => {
    onChange(variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant));
  };

  const updateValue = (variantIndex, valueIndex, field, value) => {
    onChange(variants.map((variant, index) => {
      if (index !== variantIndex) return variant;
      return {
        ...variant,
        values: variant.values.map((item, itemIndex) => itemIndex === valueIndex ? { ...item, [field]: value } : item),
      };
    }));
  };

  const addValue = (variantIndex) => {
    onChange(variants.map((variant, index) => index === variantIndex ? { ...variant, values: [...variant.values, emptyValue()] } : variant));
  };

  const removeValue = (variantIndex, valueIndex) => {
    onChange(variants.map((variant, index) => index === variantIndex ? { ...variant, values: variant.values.filter((_, itemIndex) => itemIndex !== valueIndex) } : variant));
  };

  const toggle = (key) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const attributeOptions = attributes.map((attribute) => ({
    value: attribute.id,
    label: toTitleCase(attribute.name),
  }));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">tune</span>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Daftar Variant</h2>
            <p className="mt-0.5 text-xs text-slate-500">Setiap container dapat dilipat. Harga dan batas stok diisi pada tab Stok; saldo stok dikelola di menu Persediaan.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const variant = emptyVariant();
            onChange([...variants, variant]);
            setExpanded((current) => new Set([...current, variant.clientId]));
          }}
          className="inline-flex h-9 items-center justify-center gap-1.5 border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          Tambah Variant
        </button>
      </div>

      {variants.map((variant, index) => {
        const key = variant.id || variant.clientId || index;
        const isExpanded = expanded.has(key);

        return (
          <div key={key} className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5">
              <button type="button" onClick={() => toggle(key)} className="flex min-w-0 flex-1 items-center gap-[5px] text-left">
                <span className="material-symbols-outlined text-[19px] text-slate-500">{isExpanded ? "expand_less" : "expand_more"}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-white text-xs font-extrabold text-slate-700 ring-1 ring-inset ring-slate-200">{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-extrabold text-slate-800">{toTitleCase(variant.name) || `Variant ${index + 1}`}</span>
                  <span className="block truncate text-[10px] font-bold text-slate-500">{variant.sku || "SKU otomatis"}</span>
                </span>
              </button>
              <div className="flex items-center gap-1">
                {index === 0 ? <span className="bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">Default</span> : null}
                {variants.length > 1 ? (
                  <button type="button" onClick={() => onChange(variants.filter((_, variantIndex) => variantIndex !== index))} className="flex h-8 w-8 items-center justify-center text-red-600 hover:bg-red-50" aria-label="Hapus variant">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                ) : null}
              </div>
            </div>

            {isExpanded ? (
              <div className="space-y-4 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="Nama variant" required>
                    <input value={variant.name} onChange={(event) => updateVariant(index, "name", event.target.value)} className={inputClassName} placeholder="Contoh: Merah / XL" />
                  </FormField>
                  <FormField label="SKU" hint="Isi kode manual bila punya kode sendiri, atau kosongkan agar sistem membuat SKU otomatis.">
                    <input value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} className={inputClassName} placeholder="Kosongkan untuk SKU otomatis" />
                  </FormField>
                </div>

                <div className="bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">Atribut variant</p>
                      <p className="text-[11px] text-slate-500">Ukuran, warna, kapasitas, material, dan atribut lain.</p>
                    </div>
                    <button type="button" onClick={() => addValue(index)} className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50">+ Tambah atribut</button>
                  </div>

                  <div className="space-y-2">
                    {variant.values.map((item, valueIndex) => (
                      <div key={item.clientId || `${index}-${valueIndex}`} className="grid gap-[5px] sm:grid-cols-[210px_1fr_36px]">
                        <SearchableSelect
                          value={item.attributeId}
                          onChange={(nextValue) => updateValue(index, valueIndex, "attributeId", nextValue)}
                          options={attributeOptions}
                          placeholder="Pilih atribut"
                          searchPlaceholder="Cari atribut"
                          onCreate={onCreateAttribute}
                          creating={creatingAttribute}
                          createLabel={(name) => `Data tidak ditemukan, tambahkan “${name}” sebagai atribut baru`}
                        />
                        <input value={item.value} onChange={(event) => updateValue(index, valueIndex, "value", event.target.value)} className={inputClassName} placeholder="Contoh: Merah, XL, 128 GB" />
                        <button type="button" onClick={() => removeValue(index, valueIndex)} className="flex h-11 w-9 items-center justify-center text-red-600 hover:bg-red-50" aria-label="Hapus atribut">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ))}
                    {!variant.values.length ? <p className="py-2 text-center text-xs text-slate-400">Belum ada atribut pada variant ini.</p> : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
});
