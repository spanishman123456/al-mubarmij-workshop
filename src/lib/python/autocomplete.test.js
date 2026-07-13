import { describe, expect, it } from "vitest";
import {
  applyCompletion,
  extractUserSymbols,
  findTypoHint,
  getSuggestions,
  isSkuiNamespace,
  parseCompletionContext,
  shouldAutoTrigger,
} from "./autocomplete.js";

describe("python autocomplete", () => {
  it("filters builtins by first letter p", () => {
    const ctx = parseCompletionContext("p", 1);
    const { items } = getSuggestions(ctx, { code: "p" });
    expect(items.some((i) => i.label === "print")).toBe(true);
    expect(items.some((i) => i.label === "pass")).toBe(true);
  });

  it("narrows to print for pri", () => {
    const code = "pri";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code });
    expect(items[0]?.label).toBe("print");
  });

  it("inserts suggestion at cursor without duplicating", () => {
    const code = "pri";
    const { code: next, cursor } = applyCompletion(code, code.length, "print");
    expect(next).toBe("print");
    expect(cursor).toBe(5);
  });

  it("does not suggest inside comments", () => {
    const code = "# pri";
    const ctx = parseCompletionContext(code, code.length);
    expect(ctx).toBeNull();
  });

  it("does not suggest inside strings", () => {
    const code = 'x = "pri';
    const ctx = parseCompletionContext(code, code.length);
    expect(ctx).toBeNull();
  });

  it("suggests str methods after dot", () => {
    const code = "text.up";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code });
    expect(items.some((i) => i.label === "upper")).toBe(true);
  });

  it("suggests skui components for ui alias in app mode", () => {
    const code = "import skui as ui\nui.Bu";
    expect(isSkuiNamespace(code, "ui")).toBe(true);
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code, appMode: true });
    expect(items.map((i) => i.label)).toEqual(["Button"]);
  });

  it("does not suggest skui components outside app mode", () => {
    const code = "import skui as ui\nui.Bu";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code, appMode: false });
    expect(items.some((i) => i.label === "Button")).toBe(false);
  });

  it("suggests list methods for list variable", () => {
    const code = "items = []\nitems.ap";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code });
    expect(items.some((i) => i.label === "append")).toBe(true);
  });

  it("suggests user variables", () => {
    const code = "student_name = 'Ali'\nstu";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code });
    expect(items.some((i) => i.label === "student_name")).toBe(true);
  });

  it("suggests user-defined functions", () => {
    const code = "def calculate_total():\n    pass\ncalc";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code });
    expect(items.some((i) => i.label === "calculate_total")).toBe(true);
  });

  it("finds typo hint pirnt -> print", () => {
    expect(findTypoHint("pirnt", ["print", "pow", "pass"])).toBe("print");
  });

  it("respects assist mode thresholds", () => {
    expect(shouldAutoTrigger("p", "full")).toBe(true);
    expect(shouldAutoTrigger("p", "reduced")).toBe(false);
    expect(shouldAutoTrigger("pr", "reduced")).toBe(true);
    expect(shouldAutoTrigger("p", "off")).toBe(false);
  });

  it("extracts symbols from code", () => {
    const syms = extractUserSymbols("total_score = 95\ndef foo():\n    pass");
    expect(syms.variables).toContain("total_score");
    expect(syms.functions).toContain("foo");
  });

  it("boosts unit-related keywords", () => {
    const code = "p";
    const ctx = parseCompletionContext(code, 1);
    const { items } = getSuggestions(ctx, { code, unitId: "intro" });
    expect(items[0]?.label).toBe("print");
  });
});
