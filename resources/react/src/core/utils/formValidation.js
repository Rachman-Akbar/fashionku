export function validateFields(values, rules = {}) {
  return Object.entries(rules).reduce((errors, [field, validators]) => {
    const list = Array.isArray(validators) ? validators : [validators];

    for (const validator of list) {
      const message = validator(values[field], values);
      if (message) {
        errors[field] = message;
        break;
      }
    }

    return errors;
  }, {});
}

export const required = (label) => (value) =>
  String(value ?? "").trim() ? "" : `${label} wajib diisi.`;

export const minimumNumber = (label, minimum = 0) => (value) =>
  Number(value) >= minimum ? "" : `${label} minimal ${minimum}.`;

export const validUrl = (label) => (value) => {
  if (!value) return "";
  try {
    new URL(value);
    return "";
  } catch {
    return `${label} harus berupa URL valid.`;
  }
};

export const validAppUrl = (label) => (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw.startsWith("/") && !raw.startsWith("//")) return "";
  return validUrl(label)(raw);
};
