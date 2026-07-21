/**
 * التحقق من اكتمال محتوى الدرس — يمنع اعتماد دروس ناقصة
 */

const PLACEHOLDER_PATTERNS = [
  /^TODO$/i,
  /^TBD$/i,
  /^placeholder$/i,
  /^lorem ipsum/i,
  /^نص تجريبي/,
  /^\.{3,}$/,
  /^—+$/,
];

function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return true;
    return PLACEHOLDER_PATTERNS.some((p) => p.test(t));
  }
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function assertNonEmpty(value, field, errors) {
  if (isEmpty(value)) errors.push(`حقل فارغ أو Placeholder: ${field}`);
}

export function validateLessonContent(lesson) {
  const errors = [];
  if (!lesson || typeof lesson !== "object") {
    return { ok: false, errors: ["lesson object required"] };
  }

  const kind = lesson.lessonKind || "lesson";

  assertNonEmpty(lesson.id, "id", errors);
  assertNonEmpty(lesson.titleAr, "titleAr", errors);
  assertNonEmpty(lesson.learningObjectives, "learningObjectives", errors);
  assertNonEmpty(lesson.whyLearn, "whyLearn", errors);
  assertNonEmpty(lesson.prerequisites, "prerequisites", errors);
  assertNonEmpty(lesson.summary, "summary", errors);
  assertNonEmpty(lesson.linkedActivity, "linkedActivity", errors);

  if (kind === "activity" || kind === "lab") {
    validateActivityGuide(lesson.activityGuide, errors, kind);
    // activity/lab still needs minimal teaching structure
    assertNonEmpty(lesson.conceptSimple, "conceptSimple", errors);
    assertNonEmpty(lesson.stepsDetailed, "stepsDetailed", errors);
    if (Array.isArray(lesson.stepsDetailed) && lesson.stepsDetailed.length < 4) {
      errors.push("stepsDetailed: يلزم 4 خطوات على الأقل");
    }
    return { ok: errors.length === 0, errors };
  }

  assertNonEmpty(lesson.conceptSimple, "conceptSimple", errors);
  assertNonEmpty(lesson.stepsDetailed, "stepsDetailed", errors);
  assertNonEmpty(lesson.workedExamples, "workedExamples", errors);
  assertNonEmpty(lesson.interactiveExample, "interactiveExample", errors);
  assertNonEmpty(lesson.commonMistakes, "commonMistakes", errors);
  assertNonEmpty(lesson.quickCheck, "quickCheck", errors);
  assertNonEmpty(lesson.guidedPractice, "guidedPractice", errors);
  assertNonEmpty(lesson.independentPractice, "independentPractice", errors);
  assertNonEmpty(lesson.summary, "summary", errors);
  assertNonEmpty(lesson.linkedActivity, "linkedActivity", errors);

  if (Array.isArray(lesson.learningObjectives) && lesson.learningObjectives.length < 3) {
    errors.push("learningObjectives: يلزم 3 أهداف على الأقل");
  }
  if (Array.isArray(lesson.stepsDetailed) && lesson.stepsDetailed.length < 4) {
    errors.push("stepsDetailed: يلزم 4 خطوات على الأقل");
  }
  if (Array.isArray(lesson.workedExamples) && lesson.workedExamples.length < 2) {
    errors.push("workedExamples: يلزم مثالان محلولان على الأقل");
  }
  if (Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length < 2) {
    errors.push("commonMistakes: يلزم خطأان شائعان على الأقل");
  }
  if (Array.isArray(lesson.independentPractice) && lesson.independentPractice.length < 2) {
    errors.push("independentPractice: يلزم تمرينان مستقلان على الأقل");
  }

  if (Array.isArray(lesson.guidedPractice) && lesson.guidedPractice.length < 2) {
    errors.push("guidedPractice: يلزم تمرينان موجهان على الأقل");
  }

  if (lesson.linkedActivity && typeof lesson.linkedActivity === "string" && !lesson.linkedActivity.startsWith("/")) {
    errors.push("linkedActivity: يجب أن يبدأ بـ /");
  }

  for (const ex of lesson.workedExamples || []) {
    assertNonEmpty(ex.titleAr, `workedExample.${ex.id}.titleAr`, errors);
    assertNonEmpty(ex.steps, `workedExample.${ex.id}.steps`, errors);
    if (Array.isArray(ex.steps) && ex.steps.length < 2) {
      errors.push(`workedExample.${ex.id}: خطوات غير كافية`);
    }
  }

  if (lesson.quickCheck?.questions) {
    for (const q of lesson.quickCheck.questions) {
      assertNonEmpty(q.promptAr, `quickCheck.${q.id}`, errors);
      assertNonEmpty(q.answer, `quickCheck.${q.id}.answer`, errors);
    }
  } else {
    errors.push("quickCheck.questions مفقود");
  }

  return { ok: errors.length === 0, errors };
}

const ACTIVITY_REQUIRED = [
  "goalAr",
  "instructionsAr",
  "estimatedMinutes",
  "executionSteps",
  "taskAr",
  "successCriteria",
  "verificationAr",
  "feedbackAr",
  "reflectionAr",
  "completionTracking",
];

function validateActivityGuide(guide, errors, kind) {
  if (!guide || typeof guide !== "object") {
    errors.push(`${kind}: activityGuide مطلوب`);
    return;
  }
  for (const field of ACTIVITY_REQUIRED) {
    assertNonEmpty(guide[field], `activityGuide.${field}`, errors);
  }
  if (Array.isArray(guide.instructionsAr) && guide.instructionsAr.length < 2) {
    errors.push("activityGuide.instructionsAr: يلزم تعليمتان على الأقل");
  }
  if (Array.isArray(guide.executionSteps) && guide.executionSteps.length < 3) {
    errors.push("activityGuide.executionSteps: يلزم 3 خطوات تنفيذ على الأقل");
  }
  if (Array.isArray(guide.successCriteria) && guide.successCriteria.length < 2) {
    errors.push("activityGuide.successCriteria: يلزم معياران للنجاح");
  }
}

export function validateLessonCatalog(catalog, seenSummaries = new Set()) {
  const results = [];
  for (const lesson of catalog) {
    const v = validateLessonContent(lesson);
    const summaryKey = (lesson.summary || "").trim().slice(0, 80);
    if (summaryKey && seenSummaries.has(summaryKey)) {
      v.errors.push("summary مكرر بين دروس مختلفة");
      v.ok = false;
    }
    if (summaryKey) seenSummaries.add(summaryKey);
    results.push({ id: lesson.id, ...v });
  }
  return results;
}
