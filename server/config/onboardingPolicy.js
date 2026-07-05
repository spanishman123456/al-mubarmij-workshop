export {
  buildOnboardingAccessStatus,
  DOC_TYPES,
  getPreAssessmentTeacherLabel,
  isRequiredOnboardingComplete,
  PRE_ASSESSMENT_STATUS,
  PRE_ASSESSMENT_STATUS_LABELS,
  resolvePreAssessmentStatus,
} from "../../src/content/onboarding/onboardingPolicy.js";

import { PRE_ASSESSMENT_STATUS } from "../../src/content/onboarding/onboardingPolicy.js";

export function mergePreAssessmentIntoProgress(progress, payload) {
  const now = new Date().toISOString();
  const existing = progress.preAssessment || {};
  const answers = payload.answers ?? existing.answers ?? {};
  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined && v !== null && String(v).trim() !== "",
  ).length;

  let status = payload.status ?? existing.status ?? PRE_ASSESSMENT_STATUS.NOT_STARTED;

  if (payload.defer) {
    status = PRE_ASSESSMENT_STATUS.DEFERRED;
  } else if (payload.status === PRE_ASSESSMENT_STATUS.SUBMITTED) {
    status = PRE_ASSESSMENT_STATUS.SUBMITTED;
  } else if (answeredCount > 0 && status === PRE_ASSESSMENT_STATUS.NOT_STARTED) {
    status = PRE_ASSESSMENT_STATUS.IN_PROGRESS;
  } else if (payload.status === PRE_ASSESSMENT_STATUS.IN_PROGRESS) {
    status = PRE_ASSESSMENT_STATUS.IN_PROGRESS;
  }

  const preAssessment = {
    ...existing,
    answers,
    status,
    totalQuestions: payload.totalQuestions ?? existing.totalQuestions ?? null,
    startedAt: existing.startedAt || (status !== PRE_ASSESSMENT_STATUS.NOT_STARTED ? now : null),
    updatedAt: now,
    deferredAt: payload.defer ? now : (existing.deferredAt ?? null),
    submittedAt: status === PRE_ASSESSMENT_STATUS.SUBMITTED ? now : (existing.submittedAt ?? null),
  };

  const next = { ...progress, preAssessment };

  if (payload.result && status === PRE_ASSESSMENT_STATUS.SUBMITTED) {
    next.quizScores = {
      ...(progress.quizScores || {}),
      "quiz-pre": { ...payload.result, submitted: true, at: now },
    };
    next.preTest = payload.result;
  }

  return next;
}
