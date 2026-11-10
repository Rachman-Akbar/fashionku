export const toTitleCase = (value = "") => {
  const text = String(value ?? "").trim();
  if (!text) return "";

  return text
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s\-(/])([\p{L}\p{N}])/gu, (_, prefix, character) => `${prefix}${character.toLocaleUpperCase("id-ID")}`);
};

export const formatEntityName = (value = "") => toTitleCase(value);

export const preserveIdentifier = (value = "") => String(value ?? "");
