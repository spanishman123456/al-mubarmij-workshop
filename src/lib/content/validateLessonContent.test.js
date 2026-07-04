import { describe, it, expect } from "vitest";
import { validateLessonContent, validateLessonCatalog } from "./validateLessonContent.js";
import { lessonCatalog } from "../../content/lessons/lessonCatalog.js";

describe("validateLessonContent", () => {
  it("rejects empty lesson", () => {
    const r = validateLessonContent({});
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(5);
  });

  it("validates full lesson catalog", () => {
    const results = validateLessonCatalog(lessonCatalog);
    for (const r of results) {
      expect(r.ok, `${r.id}: ${r.errors.join("; ")}`).toBe(true);
    }
  });

  it("rejects duplicate summaries", () => {
    const dup = [{ ...lessonCatalog[0] }, { ...lessonCatalog[0], id: "copy" }];
    const results = validateLessonCatalog(dup);
    expect(results.some((r) => !r.ok)).toBe(true);
  });
});
