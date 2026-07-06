/** Quiz runner input/persist rules — teacher preview is interactive but never saved. */

export function isQuizInputDisabled({ submitted }) {
  return Boolean(submitted);
}

export function shouldPersistQuizAttempt({ teacherPreviewMode, attempt, submitted }) {
  return !teacherPreviewMode && Boolean(attempt) && !submitted;
}
