import { describe, it, expect } from "vitest";
import { runLoopControlTrace } from "./loopControlInterpreter";

describe("runLoopControlTrace", () => {
  it("executes continue sample with correct output and trace", () => {
    const code = "for i in range(5):\n    if i == 2:\n        continue\n    print(i)";
    const res = runLoopControlTrace(code);
    expect(res.errors).toEqual([]);
    expect(res.outputs).toEqual(["0", "1", "3", "4"]);
    expect(res.trace).toContain("i = 2 → تنفيذ continue وتجاوز print");
  });

  it("executes break sample", () => {
    const code = "for i in range(10):\n    if i == 5:\n        break\n    print(i)";
    const res = runLoopControlTrace(code);
    expect(res.errors).toEqual([]);
    expect(res.outputs).toEqual(["0", "1", "2", "3", "4"]);
    expect(res.meta?.broke).toBe(true);
  });

  it("executes pass sample", () => {
    const code = "for i in range(3):\n    if i == 1:\n        pass\n    print(i)";
    const res = runLoopControlTrace(code);
    expect(res.errors).toEqual([]);
    expect(res.outputs).toEqual(["0", "1", "2"]);
    expect(res.trace.some((t) => t.includes("pass"))).toBe(true);
  });

  it("executes for-else when no break", () => {
    const code = "for i in range(3):\n    print(i)\nelse:\n    print(\"done\")";
    const res = runLoopControlTrace(code);
    expect(res.errors).toEqual([]);
    expect(res.outputs).toEqual(["0", "1", "2", "done"]);
  });

  it("does not execute for-else after break", () => {
    const code = "for i in range(3):\n    if i == 1:\n        break\n    print(i)\nelse:\n    print(\"done\")";
    const res = runLoopControlTrace(code);
    expect(res.errors).toEqual([]);
    expect(res.outputs).toEqual(["0"]);
    expect(res.outputs.includes("done")).toBe(false);
  });

  it("returns precise parser error for malformed loop", () => {
    const code = "for i in range(5)\n    print(i)";
    const res = runLoopControlTrace(code);
    expect(res.parserIssue).toBe(true);
    expect(res.errors[0]).toMatch(/تعذر تحليل الحلقة/);
  });
});
