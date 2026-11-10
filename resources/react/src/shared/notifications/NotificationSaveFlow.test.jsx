import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NotificationCenterProvider, useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";

function SaveHarness() {
  const center = useNotificationCenter();
  const [pending, setPending] = React.useState(false);

  const save = () => {
    const task = center.startTask({ title: "Perbarui Product", message: "Menyimpan product..." });
    task.success("Product berhasil diperbarui.");
  };

  const slowSave = () => {
    setPending(true);
    const task = center.startTask({ title: "Hapus Product", message: "Menghapus product..." });
    window.setTimeout(() => {
      task.fail("Product gagal dihapus.");
      setPending(false);
    }, 800);
  };

  return (
    <div>
      <button type="button" onClick={save}>simpan</button>
      <button type="button" onClick={slowSave} disabled={pending}>hapus</button>
      {center.open && center.openMode === "panel" ? <NotificationCenterPanel /> : null}
    </div>
  );
}

import React from "react";

function renderBridge(briefMs = 7000) {
  return render(
    <NotificationCenterProvider>
      <NotificationFeedbackBridge briefMs={briefMs} />
      <SaveHarness />
    </NotificationCenterProvider>,
  );
}

describe("Notifikasi setelah menyimpan data", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("membuka panel antrean dan menampilkan hasil simpan", async () => {
    const user = userEvent.setup();
    renderBridge();

    await user.click(screen.getByRole("button", { name: "simpan" }));

    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();
    expect(screen.getByText("Product berhasil diperbarui.")).toBeInTheDocument();
  });

  it("tidak membuka panel untuk notifikasi yang sudah ada sebelum mount", () => {
    render(
      <NotificationCenterProvider>
        <NotificationFeedbackBridge />
        <PreshownHarness />
      </NotificationCenterProvider>,
    );

    expect(screen.queryByRole("button", { name: "Antrean" })).not.toBeInTheDocument();
  });

  it("mengembalikan hasil ke riwayat info setelah durasi singkat", async () => {
    const user = userEvent.setup();
    renderBridge(1200);

    await user.click(screen.getByRole("button", { name: "simpan" }));
    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1300);
    });

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Antrean" })).not.toBeInTheDocument();
    });
  });

  it("menampilkan kegagalan di tab info tanpa menutup proses lain", async () => {
    const user = userEvent.setup();
    renderBridge(5000);

    await user.click(screen.getByRole("button", { name: "hapus" }));
    expect(screen.getByRole("button", { name: "Antrean (1)" })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(900);
    });

    expect(screen.getByRole("button", { name: "Info (1)" })).toBeInTheDocument();
    expect(screen.getByText("Product gagal dihapus.")).toBeInTheDocument();
  });
});

function PreshownHarness() {
  const center = useNotificationCenter();
  const pushedRef = React.useRef(false);
  React.useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    center.push({ title: "Info lama", message: "Sudah ada sebelum mount" });
  }, [center]);
  return <div>{center.open ? <NotificationCenterPanel /> : null}</div>;
}
