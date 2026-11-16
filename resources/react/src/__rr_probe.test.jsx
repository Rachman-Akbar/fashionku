import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

function ScrollToTop() {
  return null;
}

describe("ScrollToTop inside Routes", () => {
  it("renders", () => {
    let error = null;
    try {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <ScrollToTop />
            <Route path="/" element={<div>home</div>} />
          </Routes>
        </MemoryRouter>,
      );
    } catch (e) {
      error = e;
    }
    expect(error ? error.message : null).toBeNull();
  });
});
