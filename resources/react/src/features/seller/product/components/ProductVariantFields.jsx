import { memo } from "react";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { createClientId } from "@/core/utils/clientId";
import { toTitleCase } from "@/shared/utils/textFormatter";

function emptyValue() {
  return { clientId: createClientId("attribute-value"), attributeId: "", value: "" };
}

function emptyVariant() {
  return { clientId: createClientId("variant"), id: null, name: "", sku: "", price: "", stock: 0, values: [] };
}

const compactInputClass = `${inputClassName} h-10`;

export const ProductVariantFields = memo(function ProductVariantFields({ variants, attributes, onChange, onCreateAttribute, creatingAttribute = false }) {
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

  const addVariant = () => {
    const variant = emptyVariant();
    onChange([...variants, variant]);
  };

  const removeVariant = (index) => {
    onChange(variants.filter((_, variantIndex) => variantIndex !== index));
  };

  const addValue = (variantIndex) => {
    onChange(variants.map((variant, index) => index === variantIndex ? { ...variant, values: [...variant.values, emptyValue()] } : variant));
  };

  const removeValue = (variantIndex, valueIndex) => {
    onChange(variants.map((variant, index) => index === variantIndex ? { ...variant, values: variant.values.filter((_, itemIndex) => itemIndex !== valueIndex) } : variant));
  };

  const attributeOptions = attributes.map((attribute) => ({
    value: attribute.id,
    label: toTitleCase(attribute.name),
  }));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Daftar Variant</h2>
          <p className="text-xs text-slate-500">Isi Variant, SKU, Harga, dan Attribute. Batas stok diatur pada tab Stok.</p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          Tambah Variant
        </button>
      </div>

      {!variants.length ? (
        <div className="flex flex-col items-center gap-2 border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
          <p className="text-xs font-bold text-slate-600">Belum ada variant.</p>
          <button type="button" onClick={addVariant} className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">
            <span className="material-symbols-outlined text-[17px]">add</span>
            Tambah Variant
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {variants.map((variant, index) => {
              const key = variant.id || variant.clientId || index;

              return (
                <div key={key} className="rounded-[10px] border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-extrabold text-slate-600 ring-1 ring-inset ring-slate-200">{index + 1}</span>
                      <span className="truncate text-xs font-extrabold text-slate-800">{toTitleCase(variant.name) || `Variant ${index + 1}`}</span>
                      {index === 0 ? <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700">Default</span> : null}
                    </div>
                    {variants.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                        aria-label={`Hapus variant ${variant.name || index + 1}`}
                        title="Hapus variant"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-2.5 px-3 pt-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <FormField label="Variant" required>
                      <input value={variant.name} onChange={(event) => updateVariant(index, "name", event.target.value)} className={compactInputClass} placeholder="Contoh: Merah / XL" />
                    </FormField>

                    <FormField label="SKU">
                      <input value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} className={compactInputClass} placeholder="Kosongkan untuk otomatis" />
                    </FormField>

                    <FormField label="Harga" required>
                      <FormattedNumberInput min="0" value={variant.price} onChange={(value) => updateVariant(index, "price", value)} className={compactInputClass} placeholder="0" />
                    </FormField>
                  </div>

                  <div className="px-3 pb-3 pt-2.5">
                    <div className="rounded-[8px] bg-slate-50 p-2">
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">Attribute</span>
                        <button
                          type="button"
                          onClick={() => addValue(index)}
                          className="rounded-md px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                        >
                          + Tambah attribute
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {variant.values.map((item, valueIndex) => (
                          <div key={item.clientId || `${index}-${valueIndex}`} className="grid gap-1.5 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)_40px]">
                            <SearchableSelect
                              value={item.attributeId}
                              onChange={(nextValue) => updateValue(index, valueIndex, "attributeId", nextValue)}
                              options={attributeOptions}
                              placeholder="Pilih / ketik atribut"
                              searchPlaceholder="Cari atau ketik atribut baru"
                              emptyText="Atribut belum ada, ketik untuk menambah"
                              onCreate={onCreateAttribute}
                              creating={creatingAttribute}
                              createLabel={(name) => `Atribut “${name}” belum ada, tambahkan sekarang`}
                              buttonClassName="h-10 rounded-[8px]"
                            />
                            <input value={item.value} onChange={(event) => updateValue(index, valueIndex, "value", event.target.value)} className={`${inputClassName} h-10 rounded-[8px]`} placeholder="Contoh: Merah, XL, 128 GB" aria-label="Nilai attribute" />
                            <button type="button" onClick={() => removeValue(index, valueIndex)} className="flex h-10 w-10 items-center justify-center rounded-[8px] text-red-600 hover:bg-red-50" aria-label="Hapus attribute" title="Hapus attribute">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                        {!variant.values.length ? <p className="py-1 text-[11px] text-slate-400">Belum ada attribute. Klik “+ Tambah attribute” untuk menambah (boleh lebih dari satu).</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});
