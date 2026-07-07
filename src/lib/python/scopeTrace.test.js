import { describe, expect, it } from "vitest";
import { assignVariable, enterFunctionScope, readVariable } from "./scopeTrace.js";

describe("scopeTrace", () => {
  it("reads local before global", () => {
    const state = { locals: { x: 3 }, globals: { x: 10 } };
    expect(readVariable(state, "x")).toEqual({ value: 3, scope: "local" });
  });

  it("enters function scope", () => {
    const outer = assignVariable({ locals: {}, globals: {} }, "a", 1, "global");
    const inner = enterFunctionScope(outer);
    expect(readVariable(inner, "a").scope).toBe("global");
    expect(readVariable(assignVariable(inner, "b", 2), "b").value).toBe(2);
  });
});
