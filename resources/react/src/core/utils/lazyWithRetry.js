import { lazy } from "react";

function isImportFailure(error) {
  return Boolean(
    error &&
      (error.name === "TypeError" ||
        String(error?.message || "").toLowerCase().includes("failed to fetch dynamically imported module")),
  );
}

export function lazyWithRetry(factory, options = {}) {
  const { retries = 3, delayMs = 350, reloadOnFinalFailure = true } = options;
  let attempts = 0;

  const resolveModule = async () => {
    try {
      return await factory();
    } catch (error) {
      if (!isImportFailure(error)) throw error;

      attempts += 1;
      if (attempts > retries) {
        if (reloadOnFinalFailure) {
          const delay = Math.min(delayMs * Math.pow(2, attempts), 2000);
          window.setTimeout(() => window.location.reload(), delay);
          return new Promise(() => {});
        }
        throw error;
      }

      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      return factory();
    }
  };

  return lazy(resolveModule);
}