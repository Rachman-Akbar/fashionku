import { useEffect, useMemo, useRef, useState } from "react";

function getVariantId(variant) {
  return Number(variant?.id ?? variant?.variant_id ?? 0);
}

function getVariantStock(variant) {
  const value =
    variant?.stock ??
    variant?.stock_quantity ??
    variant?.quantity ??
    variant?.available_stock;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isVariantAvailable(variant) {
  const stock = getVariantStock(variant);
  return stock === null || stock > 0;
}

function getAttributeKey(item) {
  return String(item?.attribute_id || item?.attribute_name || "variant");
}

function buildVariantGroups(variants = []) {
  const groups = new Map();

  variants.forEach((variant) => {
    (variant.values || []).forEach((item) => {
      const key = getAttributeKey(item);

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          name: item.attribute_name || "Varian",
          values: [],
        });
      }

      const group = groups.get(key);
      const value = String(item.value ?? "");

      if (!group.values.some((row) => row.value === value)) {
        group.values.push({ value, label: value });
      }
    });
  });

  return Array.from(groups.values()).slice(0, 2);
}

function variantMatches(variant, selectedValues) {
  return Object.entries(selectedValues).every(([key, value]) => {
    if (!value) return true;

    return (variant.values || []).some(
      (item) =>
        getAttributeKey(item) === String(key) &&
        String(item.value ?? "") === String(value),
    );
  });
}

function getVariantValues(variant, groups) {
  const values = {};

  groups.forEach((group) => {
    const matched = (variant?.values || []).find(
      (item) => getAttributeKey(item) === String(group.key),
    );

    values[group.key] = String(matched?.value ?? "");
  });

  return values;
}

function getInitialVariant(variants, value) {
  const preferredId = getVariantId(value);
  const preferred = variants.find(
    (variant) => getVariantId(variant) === preferredId,
  );

  if (preferred && isVariantAvailable(preferred)) {
    return preferred;
  }

  return (
    variants.find(
      (variant) => variant.is_default && isVariantAvailable(variant),
    ) ||
    variants.find(isVariantAvailable) ||
    null
  );
}

export function VariantSelector({
  variants = [],
  value = null,
  onVariantChange,
}) {
  const rows = useMemo(
    () =>
      Array.isArray(variants)
        ? variants.filter((variant) => getVariantId(variant) > 0)
        : [],
    [variants],
  );

  const groups = useMemo(() => buildVariantGroups(rows), [rows]);
  const callbackRef = useRef(onVariantChange);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const controlledVariantId = getVariantId(value);

  useEffect(() => {
    callbackRef.current = onVariantChange;
  }, [onVariantChange]);

  useEffect(() => {
    if (!rows.length) {
      setSelectedValues({});
      setSelectedVariantId(null);
      callbackRef.current?.(null);
      return;
    }

    const initialVariant = getInitialVariant(rows, value);
    const displayVariant =
      initialVariant ||
      rows.find((variant) => variant.is_default) ||
      rows[0] ||
      null;

    setSelectedValues(getVariantValues(displayVariant, groups));
    setSelectedVariantId(
      initialVariant ? getVariantId(initialVariant) : null,
    );
    callbackRef.current?.(initialVariant);
  }, [controlledVariantId, groups, rows]);

  if (!rows.length) return null;

  if (!groups.length) {
    return (
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Pilih varian</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {rows.map((variant) => {
            const variantId = getVariantId(variant);
            const outOfStock = !isVariantAvailable(variant);
            const active = variantId === selectedVariantId;

            return (
              <button
                key={variantId || variant.sku || variant.name}
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  setSelectedVariantId(variantId);
                  callbackRef.current?.(variant);
                }}
                className={`min-h-11 min-w-[44px] rounded-lg border-2 px-3 text-sm font-semibold transition-colors ${
                  outOfStock
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-50"
                    : active
                      ? "border-[#10B981] bg-[#e5f9e7] font-bold text-[#10B981]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#10B981]"
                }`}
              >
                <span>{variant.name || variant.label || variant.sku}</span>
                {outOfStock ? (
                  <span className="ml-1.5 text-[10px] font-normal">Habis</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const isOptionDisabled = (groupIndex, itemValue) => {
    const criteria = {};

    groups.slice(0, groupIndex).forEach((group) => {
      criteria[group.key] = selectedValues[group.key] || "";
    });

    criteria[groups[groupIndex].key] = itemValue;

    return !rows.some(
      (variant) =>
        isVariantAvailable(variant) && variantMatches(variant, criteria),
    );
  };

  const handleGroupSelect = (groupIndex, itemValue) => {
    const group = groups[groupIndex];
    const nextValues = {
      ...selectedValues,
      [group.key]: itemValue,
    };

    const exactVariant = rows.find(
      (variant) =>
        isVariantAvailable(variant) && variantMatches(variant, nextValues),
    );

    const prefixCriteria = {};

    groups.slice(0, groupIndex).forEach((row) => {
      prefixCriteria[row.key] = selectedValues[row.key] || "";
    });

    prefixCriteria[group.key] = itemValue;

    const nextVariant =
      exactVariant ||
      rows.find(
        (variant) =>
          isVariantAvailable(variant) &&
          variantMatches(variant, prefixCriteria),
      ) ||
      null;

    if (!nextVariant) return;

    setSelectedValues(getVariantValues(nextVariant, groups));
    setSelectedVariantId(getVariantId(nextVariant));
    callbackRef.current?.(nextVariant);
  };

  return (
    <>
      {groups.map((group, groupIndex) => (
        <div
          key={group.key}
          className={groupIndex === groups.length - 1 ? "mb-8" : "mb-6"}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">
              Pilih {group.name.toLowerCase()}:{" "}
              <span className="ml-1 font-normal text-gray-500">
                {selectedValues[group.key] || "-"}
              </span>
            </span>
          </div>

          <div
            className={
              groupIndex === 0
                ? "grid grid-cols-2 gap-2"
                : "flex flex-wrap gap-2"
            }
          >
            {group.values.map((item) => {
              const active = selectedValues[group.key] === item.value;
              const disabled = isOptionDisabled(groupIndex, item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleGroupSelect(groupIndex, item.value)}
                  className={
                    groupIndex === 0
                      ? `flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-colors ${
                          disabled
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                            : active
                              ? "border-[#10B981] bg-[#e5f9e7]"
                              : "border-gray-200 bg-white hover:border-gray-400"
                        }`
                      : `min-h-11 min-w-[44px] rounded-lg border-2 px-3 text-sm font-semibold transition-colors ${
                          disabled
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-50"
                            : active
                              ? "border-[#10B981] bg-[#e5f9e7] font-bold text-[#10B981]"
                              : "border-gray-200 bg-white text-gray-700 hover:border-[#10B981]"
                        }`
                  }
                >
                  <span
                    className={
                      groupIndex === 0
                        ? `text-xs font-semibold ${
                            disabled
                              ? "text-gray-400"
                              : active
                                ? "text-[#10B981]"
                                : "text-gray-500"
                          }`
                        : ""
                    }
                  >
                    {item.label}
                    {disabled ? (
                      <span className="ml-1.5 text-[10px] font-normal">
                        Habis
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
