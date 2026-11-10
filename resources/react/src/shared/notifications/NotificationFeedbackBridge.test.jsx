import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NotificationCenterProvider, useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { toastError, toastInfo, toastSuccess } from "@/shared/utils/userFeedback";

function Harness() {
  const center = useNotificationCenter();
  return (
    <div>
      <button type="button" onClick={() => toastSuccess("Simpan Product", "Product berhasil disimpan.")}>sukses</button>
      <button type="button" onClick={() => toastError("Simpan Product", "Product gagal disimpan.")}>gagal</button>
      <button type="button" onClick={() => toastInfo("Info", "Peng Payingatan tersedia.")}>info</button>
      {center.open && center.openMode === "panel" ? <NotificationCenterPanel /> : null}
    </div>
  );
}

function renderBridge(briefMs = 7000) {
  return render(
    <NotificationCenterProvider>
      <NotificationFeedbackBridge briefMs={briefMs} />
      <Harness />
    </NotificationCenterProvider>,
  );
}

describe("Bridge notifikasi panel", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("membuka tab antrean dan menaruh notifikasi singkat di dalamnya", async () => {
    const user = userEvent.setup();
    renderBridge();

    await user.click(screen.getByRole("button", { name: "sukses" }));

    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();
    expect(screen.getByText("Product berhasil disimpan.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Info (1)" })).not.toBeInTheDocument();
  });

  it("tidak mengantrekan notifikasi yang sama dua kali", async () => {
    const user = userEvent.setup();
    renderBridge();

    await user.click(screen.getByRole("button", { name: "sukses" }));
    await user.click(screen.getByRole("button", { name: "sukses" }));

    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();
    expect(screen.getByText("2x")).toBeInTheDocument();
  });

  it("memisahkan notifikasi berbeda dan jenis berbeda", async () => {
    const user = userEvent.setup();
    renderBridge();

    await user.click(screen.getByRole("button", { name: "sukses" }));
    await user.click(screen.getByRole("button", { name: "gagal" }));
    await user.click(screen.getByRole("button", { name: "sukses" }));

    expect(screen.getByRole("button", { name: "Antrean (2)" })).toBeInTheDocument();
    expect(screen.getByText("2x")).toBeInTheDocument();
  });

  it("menghapus notifikasi singkat dan menutup panel setelah durasi singkat", async () => {
    const user = userEvent.setup();
    renderBridge(1200);

    await user.click(screen.getByRole("button", { name: "sukses" }));
    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200);
    });

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Antrean (0)" })).not.toBeInTheDocument();
    });
  });

  it("tidak menutup panel bila masih ada proses berjalan", async () => {
    const user = userEvent.setup();

    render(
      <NotificationCenterProvider>
        <NotificationFeedbackBridge briefMs={1200} />
        <TaskHarness />
      </NotificationCenterProvider>,
    );

    await user.click(screen.getByRole("button", { name: "mulai proses" }));
    await user.click(screen.getByRole("button", { name: "sukses" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();
    expect(screen.getByText("Memproses data")).toBeInTheDocument();
  });
});

function TaskHarness() {
  const center = useNotificationCenter();
  return (
    <div>
      <button type="button" onClick={() => center.startTask({ title: "Proses", message: "Memproses data" })}>mulai proses</button>
      <button type="button" onClick={() => toastSuccess("Simpan Product", "Product berhasil disimpan.")}>sukses</button>
      {center.open && center.openMode === "panel" ? <NotificationCenterPanel /> : null}
    </div>
  );
}
