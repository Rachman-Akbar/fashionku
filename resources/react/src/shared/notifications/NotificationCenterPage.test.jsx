import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/shared/utils/userFeedback", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, confirmClearNotifications: vi.fn().mockResolvedValue(true) };
});

import { NotificationCenterProvider, useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { confirmClearNotifications } from "@/shared/utils/userFeedback";

function Harness() {
  const center = useNotificationCenter();
  return (
    <div>
      <button type="button" onClick={() => center.startTask({ title: "Proses impor", message: "Menghitung..." })}>mulai proses</button>
      <button type="button" onClick={() => center.push({ title: "Info stok", message: "Stok menipis" })}>push info</button>
      <button type="button" onClick={() => center.update(center.queueItems[0]?.id, { status: "waiting" })}>tunggu</button>
      <NotificationCenterPanel />
    </div>
  );
}

function renderPanel() {
  return render(
    <NotificationCenterProvider>
      <Harness />
    </NotificationCenterProvider>,
  );
}

describe("Tombol kosongkan notifikasi", () => {
  it("menonaktifkan tombol saat tab kosong", () => {
    renderPanel();
    expect(screen.getByRole("button", { name: /Kosongkan/ })).toBeDisabled();
  });

  it("menghapus seluruh notifikasi info setelah konfirmasi", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole("button", { name: "push info" }));
    await user.click(await screen.findByRole("button", { name: "Info (1)" }));
    const clearButton = await screen.findByRole("button", { name: /Kosongkan \(1\)/ });
    expect(clearButton).toBeEnabled();

    await user.click(clearButton);
    expect(confirmClearNotifications).toHaveBeenCalled();

    expect(screen.getByRole("button", { name: "Info (0)" })).toBeInTheDocument();
    expect(screen.getByText(/Belum ada informasi/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kosongkan/ })).toBeDisabled();
  });

  it("tidak menghapus proses yang sedang berjalan di tab antrean", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole("button", { name: "mulai proses" }));
    const clearButton = await screen.findByRole("button", { name: /Kosongkan/ });
    expect(clearButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "tunggu" }));
    const waitingClear = await screen.findByRole("button", { name: /Kosongkan \(1\)/ });
    expect(waitingClear).toBeEnabled();

    await user.click(waitingClear);
    expect(screen.getByRole("button", { name: "Antrean (0)" })).toBeInTheDocument();
  });
});
