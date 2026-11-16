import { describe, it, expect, vi } from "vitest";

function memStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
    setItem: (k, v) => m.set(String(k), String(v)),
    removeItem: (k) => m.delete(String(k)),
    clear: () => m.clear(),
  };
}

describe("App render", () => {
  it("renders home without crashing", async () => {
    Object.defineProperty(window, "localStorage", { value: memStorage(), configurable: true });
    Object.defineProperty(window, "sessionStorage", { value: memStorage(), configurable: true });
    const { render } = await import("@testing-library/react");
    const { MemoryRouter } = await import("react-router-dom");
    const { default: App } = await import("@/App");

    let error = null;
    try {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>,
      );
    } catch (e) {
      error = e;
    }
    expect(error ? error.message : null).toBeNull();
    console.log("BODY TEXT:", document.body.textContent.slice(0, 200));
  });
});
