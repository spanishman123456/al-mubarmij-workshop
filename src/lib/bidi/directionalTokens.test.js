import { describe, expect, it } from "vitest";
import { splitDirectionalParts } from "./directionalTokens";

describe("directionalTokens", () => {
  it("splits mixed arabic and code tokens", () => {
    const parts = splitDirectionalParts("ما ناتج p AND q عندما p = 1");
    expect(parts.some((p) => p.text === "p" && p.dir === "ltr")).toBe(true);
    expect(parts.some((p) => p.text === "AND" && p.dir === "ltr")).toBe(true);
    expect(parts.some((p) => p.text.includes("ما ناتج") && p.dir === "rtl")).toBe(true);
  });

  it("returns empty list for non-string values", () => {
    expect(splitDirectionalParts(null)).toEqual([]);
    expect(splitDirectionalParts("")).toEqual([]);
  });
});

