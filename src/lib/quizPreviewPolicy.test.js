import { describe, expect, it } from "vitest";
import { isQuizInputDisabled, shouldPersistQuizAttempt } from "./quizPreviewPolicy.js";

describe("quizPreviewPolicy", () => {
  it("allows input in teacher preview (not disabled)", () => {
    expect(isQuizInputDisabled({ submitted: false })).toBe(false);
    expect(isQuizInputDisabled({ submitted: true })).toBe(true);
  });

  it("does not persist attempts in teacher preview", () => {
    expect(
      shouldPersistQuizAttempt({ teacherPreviewMode: true, attempt: { id: 1 }, submitted: false }),
    ).toBe(false);
    expect(
      shouldPersistQuizAttempt({ teacherPreviewMode: false, attempt: { id: 1 }, submitted: false }),
    ).toBe(true);
    expect(
      shouldPersistQuizAttempt({ teacherPreviewMode: false, attempt: null, submitted: false }),
    ).toBe(false);
  });
});
