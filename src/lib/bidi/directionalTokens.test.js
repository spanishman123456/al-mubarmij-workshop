import { describe, expect, it } from "vitest";
import { splitDirectionalParts } from "./directionalTokens";

describe("directionalTokens", () => {
  it("splits mixed arabic and code tokens", () => {
    const parts = splitDirectionalParts("ما ناتج p AND q عندما p = 1");
    expect(parts.some((p) => p.text === "p" && p.dir === "ltr")).toBe(true);
    expect(parts.some((p) => p.text === "AND" && p.dir === "ltr")).toBe(true);
    expect(parts.some((p) => p.text.includes("ما ناتج") && p.dir === "rtl")).toBe(true);
  });

  it.each([
    ["حوّل 101101 إلى عشري", "101101"],
    ["القيمة 0xFF بالنظام السداسي", "0xFF"],
    ["استخدم row[1] في الحل", "row[1]"],
    ["احسب A₁ ثم B₂", "A₁"],
    ["الترميز UTF-8 مطلوب", "UTF-8"],
    ["احسب A+B أولاً", "A+B"],
    ["المصفوفة [1, 0, 1] مطلوبة", "[1, 0, 1]"],
    ["المصفوفة [[1, 0], [0, 1]] مطلوبة", "[[1, 0], [0, 1]]"],
  ])("keeps %s technical token isolated as LTR", (text, token) => {
    expect(splitDirectionalParts(text)).toContainEqual({ text: token, dir: "ltr" });
  });

  it("keeps logic expression identifiers and operators LTR", () => {
    const ltrTokens = splitDirectionalParts("بسّط A AND B ثم A OR B")
      .filter((part) => part.dir === "ltr")
      .map((part) => part.text);

    expect(ltrTokens).toEqual(["A", "AND", "B", "A", "OR", "B"]);
  });

  it("does not absorb Arabic text inside a technical accessor", () => {
    const parts = splitDirectionalParts("استخدم row[القيمة] الآن");

    expect(parts.some((part) => part.dir === "rtl" && part.text.includes("القيمة"))).toBe(true);
  });

  it("returns empty list for non-string values", () => {
    expect(splitDirectionalParts(null)).toEqual([]);
    expect(splitDirectionalParts("")).toEqual([]);
  });
});

