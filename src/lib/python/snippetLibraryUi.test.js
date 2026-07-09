import { describe, expect, it } from "vitest";
import {
  buildSnippetSearchText,
  filterSnippets,
  normalizeSnippetType,
  paginateSnippets,
  sortSnippets,
} from "./snippetLibraryUi";

const SNIPPETS = [
  {
    id: "1",
    title: "AND table",
    code: "print(True and False)",
    snippetType: "activity",
    lessonTitle: "جداول الحقيقة",
    updatedAt: "2026-07-10T01:00:00.000Z",
  },
  {
    id: "2",
    title: "if example",
    code: "if a < b:\n    print(b)",
    snippetType: "lesson",
    lessonTitle: "الجملة الشرطية",
    updatedAt: "2026-07-09T01:00:00.000Z",
  },
  {
    id: "3",
    title: "mini project",
    code: "input('name')",
    snippetType: "project",
    lessonTitle: "مشروع",
    updatedAt: "2026-07-08T01:00:00.000Z",
  },
];

describe("snippetLibraryUi", () => {
  it("normalizes snippet type safely", () => {
    expect(normalizeSnippetType("project")).toBe("project");
    expect(normalizeSnippetType("unknown")).toBe("lesson");
  });

  it("builds search text from metadata and code", () => {
    const text = buildSnippetSearchText(SNIPPETS[0]);
    expect(text).toContain("and table");
    expect(text).toContain("جداول الحقيقة");
  });

  it("filters by query and type", () => {
    const logic = filterSnippets(SNIPPETS, { query: "and", type: "activity" });
    expect(logic).toHaveLength(1);
    expect(logic[0].id).toBe("1");
  });

  it("sorts newest first by default", () => {
    const sorted = sortSnippets(SNIPPETS);
    expect(sorted.map((s) => s.id)).toEqual(["1", "2", "3"]);
  });

  it("paginates snippets with bounded page number", () => {
    const paged = paginateSnippets(SNIPPETS, 5, 2);
    expect(paged.currentPage).toBe(2);
    expect(paged.totalPages).toBe(2);
    expect(paged.items).toHaveLength(1);
  });
});

