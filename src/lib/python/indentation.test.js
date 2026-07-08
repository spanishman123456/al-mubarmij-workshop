import { describe, expect, it } from "vitest";
import { applySmartEnter, applyTabIndent, autoFixIndentation } from "./indentation.js";

describe("python indentation helpers", () => {
  it("adds 4 spaces after if block", () => {
    const code = "if a < b:";
    const r = applySmartEnter(code, code.length);
    expect(r.code).toBe("if a < b:\n    ");
  });

  it("inserts 4 spaces on tab", () => {
    const r = applyTabIndent("print('x')", 0, 0);
    expect(r.code.startsWith("    ")).toBe(true);
  });

  it("dedents selection on shift+tab", () => {
    const code = "    if a < b:\n        print(a)";
    const r = applyTabIndent(code, 0, code.length, { shift: true });
    expect(r.code).toBe("if a < b:\n    print(a)");
  });

  it("normalizes if/else indentation", () => {
    const fixed = autoFixIndentation("if a < b:\nprint(b)\nelse:\nprint(a)");
    expect(fixed).toBe("if a < b:\n    print(b)\nelse:\n    print(a)");
  });
});
