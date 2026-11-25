import { describe, expect, it } from "vitest";
import { ALL_FINANCE_TYPES, CASH_STATUSES, DEBT_STATUSES, isDebtTransaction, statusOptionsFor } from "@/features/advanced/pages/FinancePage";

describe("jenis transaksi keuangan", () => {
  it("halaman keuangan memuat pemasukan, pengeluaran, piutang, dan hutang", () => {
    expect(ALL_FINANCE_TYPES).toEqual(["income", "expense", "receivable", "payable"]);
  });

  it("mengenali jenis hutang-piutang", () => {
    expect(isDebtTransaction("receivable")).toBe(true);
    expect(isDebtTransaction("payable")).toBe(true);
    expect(isDebtTransaction("income")).toBe(false);
    expect(isDebtTransaction("expense")).toBe(false);
  });

  it("memberi pilihan status sesuai jenis transaksi", () => {
    expect(statusOptionsFor("income")).toEqual(CASH_STATUSES);
    expect(statusOptionsFor("expense")).toEqual(CASH_STATUSES);
    expect(statusOptionsFor("receivable")).toEqual(DEBT_STATUSES);
    expect(statusOptionsFor("payable")).toEqual(DEBT_STATUSES);
  });
});
