import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    getItem: (key) => (store.has(String(key)) ? store.get(String(key)) : null),
    setItem: (key, value) => store.set(String(key), String(value)),
    removeItem: (key) => store.delete(String(key)),
    clear: () => store.clear(),
  };
}

if (typeof globalThis !== "undefined") {
  if (typeof globalThis.localStorage === "undefined") {
    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
  }
  if (typeof globalThis.sessionStorage === "undefined") {
    Object.defineProperty(globalThis, "sessionStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
  }
}

if (typeof window !== "undefined") {
  if (typeof window.localStorage === "undefined") {
    Object.defineProperty(window, "localStorage", {
      value: typeof globalThis.localStorage !== "undefined"
        ? globalThis.localStorage
        : createMemoryStorage(),
      configurable: true,
    });
  }
  if (typeof window.sessionStorage === "undefined") {
    Object.defineProperty(window, "sessionStorage", {
      value: typeof globalThis.sessionStorage !== "undefined"
        ? globalThis.sessionStorage
        : createMemoryStorage(),
      configurable: true,
    });
  }

  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }

  if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
  }
}