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

  it("validates activity lesson with activityGuide", () => {
    const activity = lessonCatalog.find((l) => l.id === "conversions-intro");
    expect(validateLessonContent(activity).ok).toBe(true);
  });

  it("validates lab lesson", () => {
    const lab = lessonCatalog.find((l) => l.id === "day02-computer-lab");
    expect(validateLessonContent(lab).ok).toBe(true);
  });

  it("rejects activity without activityGuide", () => {
    const r = validateLessonContent({
      id: "x",
      lessonKind: "activity",
      titleAr: "t",
      learningObjectives: ["a", "b", "c"],
      whyLearn: "w",
      prerequisites: ["p"],
      conceptSimple: "c",
      stepsDetailed: [{ titleAr: "1", bodyAr: "b" }, { titleAr: "2", bodyAr: "b" }, { titleAr: "3", bodyAr: "b" }, { titleAr: "4", bodyAr: "b" }],
      summary: "s",
      linkedActivity: "/x",
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("activityGuide"))).toBe(true);
  });

  it("day02 catalog includes new lesson ids", () => {
    const ids = lessonCatalog.map((l) => l.id);
    expect(ids).toContain("base-arithmetic");
    expect(ids).toContain("twos-complement");
    expect(ids).toContain("python-for-range");
  });
});
