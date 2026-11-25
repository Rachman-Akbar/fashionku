import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { DataGrid } from "@/features/advanced/components/DataGrid";

const columns = [
  { key: "code", label: "Kode" },
  { key: "name", label: "Nama" },
];

const rows = [
  { id: 1, code: "BRG-1", name: "Kaos" },
  { id: 2, code: "BRG-2", name: "Jaket" },
];

function headers() {
  return screen.getAllByRole("columnheader").map((header) => header.textContent.trim());
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

  it("membuat header sticky dan bukan bagian dari scrollport vertikal", () => {
    const { container } = render(<DataGrid columns={columns} rows={rows} viewMode="grid" />);
    const sticky = container.querySelector(".sticky");
    expect(sticky).not.toBeNull();
    // `overflow-y: clip` membuat kontainer hanya scroll horizontal sehingga
    // header tetap menempel ke area gulir halaman, bukan ke kontainer.
    expect(sticky.parentElement.className).toContain("[overflow-y:clip]");
    cleanup();
  });
});
