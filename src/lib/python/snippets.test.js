import { describe, expect, it } from "vitest";
import { createSnippetRecord, filterSnippets, sortSnippets } from "./snippets.js";

describe("python snippets helpers", () => {
  it("creates snippet with metadata", () => {
    const s = createSnippetRecord({ title: "if demo", code: "print(1)", lessonId: "day-02", activityId: "if" });
    expect(s.title).toBe("if demo");
    expect(s.lessonId).toBe("day-02");
    expect(s.activityId).toBe("if");
    expect(s.code).toContain("print");
  });

  it("filters snippets by query", () => {
    const list = [
      { id: "1", title: "if", code: "if a<b:\n    print(b)" },
      { id: "2", title: "while", code: "while n>0:\n    n-=1" },
    ];
    expect(filterSnippets(list, "while")).toHaveLength(1);
    expect(filterSnippets(list, "print")).toHaveLength(1);
  });

  it("sorts snippets by title", () => {
    const list = [
      { id: "1", title: "باء", at: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "ألف", at: "2026-01-02T00:00:00.000Z" },
    ];
    const sorted = sortSnippets(list, "title");
    expect(sorted[0].title).toBe("ألف");
  });
});
