import { describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { DataGrid } from "@/features/advanced/components/DataGrid";

const columns = [
  { key: "code", label: "Kode" },
  { key: "name", label: "Nama" },
];

const rows = [
  { id: 1, code: "BRG-1", name: "Kaos" },
  { id: 2, code: "BRG-2", name: "Jaket" },
];

const statusColumns = [
  { key: "code", label: "Kode" },
  { key: "status", label: "Status", filterType: "select", options: [
    { value: "lunas", label: "Lunas" },
    { value: "pending", label: "Pending" },
  ] },
];

const statusRows = [
  { id: 1, code: "INV-1", status: "lunas" },
  { id: 2, code: "INV-2", status: "pending" },
  { id: 3, code: "INV-3", status: "lunas" },
];

function headers() {
  return screen.getAllByRole("columnheader").map((header) => header.textContent.trim());
}

function openColumnFilter(label) {
  const header = screen.getAllByRole("columnheader").find((item) => item.textContent.includes(label));
  fireEvent.click(within(header).getAllByRole("button")[0]);
}

// Label opsi diikuti teks ikon material ("check_box_outline_blank"), jadi
// pencarian memakai akhiran teks, bukan accessible name persis.
function clickOption(label) {
  const option = screen.getAllByRole("button").find((item) => item.textContent.trim().endsWith(label));
  fireEvent.click(option);
}

describe("DataGrid filter header di setiap mode tampilan", () => {
  it("menampilkan header kolom pada mode list", () => {
    render(<DataGrid columns={columns} rows={rows} />);
    expect(headers()).toEqual(["Kode", "Nama"]);
    cleanup();
  });

  it("tetap menampilkan header kolom pada mode kartu (grid)", () => {
    render(<DataGrid columns={columns} rows={rows} viewMode="grid" />);
    expect(headers()).toEqual(["Kode", "Nama"]);
    cleanup();
  });

  it("tetap menampilkan header kolom pada mode grafik", () => {
    render(<DataGrid columns={columns} rows={rows} viewMode="chart" chart={<div>grafik</div>} />);
    expect(headers()).toEqual(["Kode", "Nama"]);
    cleanup();
  });

  it("header sticky berada di luar kontainer scroll horizontal", () => {
    const { container } = render(<DataGrid columns={columns} rows={rows} viewMode="grid" />);
    const sticky = container.querySelector(".sticky");
    expect(sticky).not.toBeNull();
    // Header sticky tidak boleh berada di dalam scrollport horizontal/vertikal.
    expect(sticky.parentElement.className).not.toContain("overflow-x-auto");
    const viewport = sticky.querySelector("div");
    expect(viewport.className).toContain("overflow-x-auto");
    expect(viewport.className).toContain("[overflow-y:clip]");
    cleanup();
  });

  it("tidak me-remount header saat mode tampilan diganti", () => {
    const { rerender } = render(<DataGrid columns={columns} rows={rows} viewMode="list" />);
    const listHeader = screen.getAllByRole("columnheader")[0];

    rerender(<DataGrid columns={columns} rows={rows} viewMode="grid" />);
    const gridHeader = screen.getAllByRole("columnheader")[0];

    rerender(<DataGrid columns={columns} rows={rows} viewMode="chart" chart={<div>grafik</div>} />);
    const chartHeader = screen.getAllByRole("columnheader")[0];

    expect(gridHeader).toBe(listHeader);
    expect(chartHeader).toBe(listHeader);
    cleanup();
  });

  it("filter teks di header tetap aktif dan menyaring data setelah ganti mode", () => {
    const { rerender, container } = render(<DataGrid columns={columns} rows={rows} />);
    openColumnFilter("Nama");
    fireEvent.change(screen.getByPlaceholderText("Cari nilai"), { target: { value: "kaos" } });
    fireEvent.click(screen.getByRole("button", { name: "Terapkan" }));

    // List: hanya Kaos.
    expect(screen.queryByText("Jaket")).toBeNull();

    rerender(<DataGrid columns={columns} rows={rows} viewMode="grid" />);
    expect(container.textContent).toContain("Kaos");
    expect(container.textContent).not.toContain("Jaket");
    const header = screen.getAllByRole("columnheader")[1];
    expect(header.textContent).toContain("Nama");
    cleanup();
  });

  it("grafik menerima baris yang sudah difilter", () => {
    const chart = (filtered) => <div data-testid="chart">{`chart:${filtered.length}`}</div>;
    const { rerender } = render(<DataGrid columns={columns} rows={rows} chart={chart} viewMode="chart" />);
    expect(screen.getByTestId("chart").textContent).toBe("chart:2");

    rerender(<DataGrid columns={columns} rows={rows} chart={chart} viewMode="list" />);
    openColumnFilter("Kode");
    fireEvent.change(screen.getByPlaceholderText("Cari nilai"), { target: { value: "BRG-2" } });
    fireEvent.click(screen.getByRole("button", { name: "Terapkan" }));
    rerender(<DataGrid columns={columns} rows={rows} chart={chart} viewMode="chart" />);
    expect(screen.getByTestId("chart").textContent).toBe("chart:1");
    cleanup();
  });

  it("checkbox multi-select menyaring beberapa nilai sekaligus", () => {
    const { container } = render(<DataGrid columns={statusColumns} rows={statusRows} viewMode="grid" />);
    openColumnFilter("Status");
    clickOption("Lunas");
    clickOption("Pending");
    fireEvent.click(screen.getByRole("button", { name: "Terapkan" }));

    // Semua nilai dipilih = tanpa filter.
    expect(container.textContent).toContain("INV-1");
    expect(container.textContent).toContain("INV-2");

    openColumnFilter("Status");
    clickOption("Pending");
    fireEvent.click(screen.getByRole("button", { name: "Terapkan" }));

    expect(container.textContent).toContain("INV-2");
    expect(container.textContent).not.toContain("INV-1");
    cleanup();
  });
});
