import { describe, expect, it } from "vitest";
import { filterSnippetLibrary, insertSnippetTemplate } from "./snippetLibrary.js";

describe("python snippet library", () => {
  it("filters snippets by keyword", () => {
    const results = filterSnippetLibrary("elif");
    expect(results.some((r) => r.id === "if-elif-else")).toBe(true);
  });

  it("appends snippet with spacing", () => {
    const next = insertSnippetTemplate("print('a')", "print('b')");
    expect(next).toBe("print('a')\n\nprint('b')");
  });

  it("returns snippet when editor is empty", () => {
    const next = insertSnippetTemplate("", "x = 1");
    expect(next).toBe("x = 1");
  });
});
