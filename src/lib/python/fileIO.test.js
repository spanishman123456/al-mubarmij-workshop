import { describe, expect, it } from "vitest";
import { countWords, fillTemplate, simulateRead, simulateWrite } from "./fileIO.js";

describe("fileIO", () => {
  it("writes virtual file metadata", () => {
    const f = simulateWrite("scores.txt", "Ali: 90\nSara: 88");
    expect(f.lineCount).toBe(2);
    expect(f.charCount).toBeGreaterThan(0);
  });

  it("reads back content", () => {
    const f = simulateWrite("a.txt", "hello");
    expect(simulateRead(f)).toBe("hello");
  });

  it("counts words and fills template", () => {
    expect(countWords("one two three")).toBe(3);
    expect(fillTemplate("Score={score}", { score: 95 })).toBe("Score=95");
  });
});
