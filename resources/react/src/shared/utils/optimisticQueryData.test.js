import { describe, expect, it } from "vitest";
import {
  mergeOptimisticValues,
  updateEntityInQueryData,
} from "@/shared/utils/optimisticQueryData";

describe("updateEntityInQueryData", () => {
  it("updates a matching row inside a plain array", () => {
    const data = [{ id: 1, name: "a" }, { id: 2, name: "b" }];
    const result = updateEntityInQueryData(data, 1, (row) => ({ ...row, name: "updated" }));
    expect(result[0].name).toBe("updated");
    expect(result[1].name).toBe("b");
  });

  it("updates rows inside { rows } and { data } wrappers", () => {
    expect(updateEntityInQueryData({ rows: [{ id: 1, name: "a" }] }, 1, (r) => ({ ...r, name: "x" })).rows[0].name).toBe("x");
    expect(updateEntityInQueryData({ data: [{ id: 2, name: "b" }] }, 2, (r) => ({ ...r, name: "y" })).data[0].name).toBe("y");
  });

  it("updates an entity wrapped directly in an object", () => {
    expect(updateEntityInQueryData({ id: 5, name: "a" }, "5", (r) => ({ ...r, name: "z" })).name).toBe("z");
  });

  it("updates using string/integer insensitive id comparison", () => {
    const result = updateEntityInQueryData([{ id: 10, name: "a" }], "10", (r) => ({ ...r, name: "q" }));
    expect(result[0].name).toBe("q");
  });

  it("leaves non-matching objects unchanged", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const result = updateEntityInQueryData(data, 9, (row) => ({ ...row, hit: true }));
    expect(result).toEqual(data);
  });

  it("passes through primitives", () => {
    expect(updateEntityInQueryData(null, 1, (r) => r)).toBe(null);
    expect(updateEntityInQueryData("str", 1, (r) => r)).toBe("str");
  });
});

describe("mergeOptimisticValues", () => {
  it("merges values over the row", () => {
    const row = { id: 1, isActive: true };
    expect(mergeOptimisticValues(row, { name: "Baru" })).toMatchObject({ id: 1, name: "Baru" });
  });

  it("normalizes isActive and is_active together", () => {
    const result = mergeOptimisticValues({ id: 1, is_active: 0 }, { isActive: true });
    expect(result.isActive).toBe(true);
    expect(result.is_active).toBe(true);
    expect(result.raw.is_active).toBe(true);
  });

  it("does not touch raw when no active flag is provided", () => {
    const row = { id: 1, raw: { is_active: true } };
    const result = mergeOptimisticValues(row, { name: "x" });
    expect(result.raw).toEqual({ is_active: true });
  });
});