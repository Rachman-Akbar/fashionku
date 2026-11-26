import { describe, expect, it } from "vitest";
import { matchesColumnFilter } from "@/shared/utils/tableData";

// Baris nyata dari tabel `financial_transactions` (bentuk mentah dari API:
// nominal berupa string desimal "12400000.00", tanggal berupa "Y-m-d H:i:s").
const rows = [
  { reference_number: "PAY-20261122-001", title: "Inv supplier katun combed 24s & 30s", type: "payable", status: "open", amount: "12400000.00", paid_amount: "6000000.00", occurred_at: "2026-11-02 11:00:00" },
  { reference_number: "PAY-20261125-002", title: "Invoice jasa jahit konveksi Cimahi batch 120 pcs", type: "payable", status: "partial", amount: "6400000.00", paid_amount: "2000000.00", occurred_at: "2026-11-23 09:40:00" },
  { reference_number: "RCV-20261125-001", title: "Piutang reseller Surabaya — 60 pcs (tempo 14 hari)", type: "receivable", status: "open", amount: "5600000.00", paid_amount: "0.00", occurred_at: "2026-11-25 08:30:00" },
];

function filterRows(filters) {
  return rows.filter((row) =>
    Object.entries(filters).every(([key, { value, type }]) => matchesColumnFilter(row[key], value, type)),
  );
}

describe("filter kolom pada data transaksi keuangan nyata", () => {
  it("menemukan transaksi yang letaknya jauh di halaman belakang", () => {
    const found = filterRows({ reference_number: { value: "PAY-20261122-001", type: "text" } });
    expect(found).toHaveLength(1);
    expect(found[0].title).toContain("katun combed");
  });

  it("mengabaikan spasi dan huruf besar pada keyword", () => {
    expect(filterRows({ reference_number: { value: "  pay-20261125  ", type: "text" } })).toHaveLength(1);
  });

  it("menyaring nominal string desimal dengan rentang angka", () => {
    const found = filterRows({ amount: { value: { min: "5000000", max: "7000000" }, type: "range" } });
    expect(found.map((row) => row.reference_number).sort()).toEqual(["PAY-20261125-002", "RCV-20261125-001"]);
  });

  it("menerima batas rentang berformat rupiah", () => {
    const found = filterRows({ amount: { value: { min: "Rp 12.000.000", max: "" }, type: "range" } });
    expect(found.map((row) => row.reference_number)).toEqual(["PAY-20261122-001"]);
  });

  it("menyaring tanggal baik format ISO maupun lokal Indonesia", () => {
    expect(filterRows({ occurred_at: { value: "2026-11-25", type: "text" } })).toHaveLength(1);
    expect(filterRows({ occurred_at: { value: "25/11/2026", type: "text" } })).toHaveLength(1);
    expect(filterRows({ occurred_at: { value: "25 Nov 2026", type: "text" } })).toHaveLength(1);
    expect(filterRows({ occurred_at: { value: "24/11/2026", type: "text" } })).toHaveLength(0);
  });

  it("menyaring pilihan status tanpa membedakan huruf besar/kecil", () => {
    expect(filterRows({ status: { value: "OPEN", type: "select" } })).toHaveLength(2);
  });

  it("menggabungkan beberapa kolom dengan logika AND", () => {
    const found = filterRows({
      type: { value: "payable", type: "select" },
      status: { value: "open", type: "select" },
    });
    expect(found).toHaveLength(1);
    expect(found[0].reference_number).toBe("PAY-20261122-001");
  });

  it("tidak menemukan apa pun untuk keyword yang tidak ada di database", () => {
    expect(filterRows({ reference_number: { value: "PAY-99999999-999", type: "text" } })).toHaveLength(0);
  });

  it("keyword dengan spasi ganda di tengah tetap cocok", () => {
    expect(filterRows({ title: { value: "jasa   jahit", type: "text" } })).toHaveLength(1);
  });
});
