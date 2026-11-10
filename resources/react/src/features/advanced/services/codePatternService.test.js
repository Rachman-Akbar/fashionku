import { describe, expect, it } from "vitest";
import { codeToken, renderCodePattern } from "./codePatternService";

describe("renderCodePattern", () => {
  it("merender token dasar sesuai rumus bawaan", () => {
    expect(renderCodePattern("RM-{name:6}")).toBe("RM-KECAPM");
    expect(renderCodePattern("MAN-{datetime}-{rand:6}")).toMatch(/^MAN-\d{14}-[A-Z0-9]{6}$/);
    expect(renderCodePattern("INV/{type:3}/{date}/{rand:4}")).toMatch(/^INV\/SKU\/\d{6}\/[A-Z0-9]{4}$/);
  });

  it("menghormati panjang token dan urutan", () => {
    expect(renderCodePattern("{type}-{name:4}-{seq:4}", {}, 7)).toBe("SKU-KECA-0007");
    expect(renderCodePattern("{name:20}-{date:6}-{seq:4}", {}, 12)).toBe("KECAPMANIS-260927-0012");
  });

  it("mengganti token kosong dengan placeholder", () => {
    expect(renderCodePattern("RM-{brand}-{seq:1}", { brand: "" })).toBe("RM-X-1");
  });

  it("membersihkan spasi ganda dan garis berlebih", () => {
    expect(renderCodePattern("A  -  B")).toBe("A-B");
    expect(renderCodePattern("  /SKU/  ")).toBe("SKU");
  });

  it("codeToken meniru backend", () => {
    expect(codeToken("Gula Pasir")).toBe("GULAPASIR");
    expect(codeToken("Kecap Manis 600 ml")).toBe("KECAPMANIS600ML");
    expect(codeToken("Ziip Store")).toBe("ZIIPSTORE");
  });
});
