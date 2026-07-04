import { describe, it, expect } from "vitest";
import { validateLessonContent, validateLessonCatalog } from "./validateLessonContent.js";
import { numberSystemsLesson } from "../../content/lessons/numberSystemsLesson.js";
import { pythonIntroLesson } from "../../content/lessons/day01/pythonIntroLesson.js";
import { asciiUnicodeLesson } from "../../content/lessons/day01/asciiUnicodeLesson.js";
import { hexColorsLesson } from "../../content/lessons/day01/hexColorsLesson.js";
import { binaryCardsLesson } from "../../content/lessons/day01/binaryCardsLesson.js";

describe("validateLessonContent", () => {
  it("rejects empty lesson", () => {
    const r = validateLessonContent({});
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(5);
  });

  it("accepts full number-systems lesson", () => {
    const r = validateLessonContent(numberSystemsLesson);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("rejects placeholder text", () => {
    const r = validateLessonContent({
      ...numberSystemsLesson,
      summary: "TODO",
    });
    expect(r.ok).toBe(false);
  });

  it("validates day-01 lesson catalog", () => {
    const results = validateLessonCatalog([
      numberSystemsLesson,
      binaryCardsLesson,
      pythonIntroLesson,
      asciiUnicodeLesson,
      hexColorsLesson,
    ]);
    for (const r of results) {
      expect(r.ok, `${r.id}: ${r.errors.join("; ")}`).toBe(true);
    }
  });
});