import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/shared/utils/userFeedback", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, confirmDiscardChanges: vi.fn().mockResolvedValue(false) };
});

import { MemoryRouter } from "react-router-dom";
import { PanelTabsProvider, usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { confirmDiscardChanges } from "@/shared/utils/userFeedback";

const ITEMS = [{ href: "/seller/products", label: "Product" }];

function EditorHarness() {
  const tabs = usePanelTabs();
  const editor = useEntityEditor({ getEditLabel: () => "Edit Product" });

  return (
    <div>
      <button type="button" onClick={() => editor.edit({ id: 7, name: "Kaos" })}>buka editor</button>
      <button type="button" onClick={() => tabs.setTabDirty(tabs.activeTab?.id, true)}>tandai dirty</button>
      <button type="button" onClick={() => editor.completeSave()}>simpan</button>
      <button type="button" onClick={() => tabs.closeActiveTab()}>tutup tab</button>
      <p data-testid="state">{tabs.activeTab?.id || "tidak-ada"}</p>
    </div>
  );
}

function renderHarness() {
  return render(
    <MemoryRouter initialEntries={["/seller/products"]}>
      <PanelTabsProvider items={ITEMS}>
        <EditorHarness />
      </PanelTabsProvider>
    </MemoryRouter>,
  );
}

describe("Simpan tidak dianggap menutup tab", () => {
  it("tidak memunculkan konfirmasi batalkan saat penyimpanan sukses", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "buka editor" }));
    await user.click(screen.getByRole("button", { name: "tandai dirty" }));
    await user.click(screen.getByRole("button", { name: "simpan" }));

    expect(confirmDiscardChanges).not.toHaveBeenCalled();
    expect(screen.getByTestId("state").textContent).not.toContain("edit:7");
  });

  it("tetap memunculkan konfirmasi saat tabdirty ditutup manual", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "buka editor" }));
    await user.click(screen.getByRole("button", { name: "tandai dirty" }));
    await user.click(screen.getByRole("button", { name: "tutup tab" }));

    expect(confirmDiscardChanges).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("state").textContent).toContain("edit:7");
  });
});
