import {
  PRE_ASSESSMENT_STATUS,
  PRE_ASSESSMENT_STATUS_LABELS,
  resolvePreAssessmentStatus,
} from "../content/onboarding/onboardingPolicy.js";

export const POST_ASSESSMENT_STATUS = {
  NOT_AVAILABLE: "not_available",
  LOCKED: "locked",
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
};

export const POST_ASSESSMENT_STATUS_LABELS = {
  not_available: "غير متاح بعد",
  locked: "يفتح في نهاية المسار",
  not_started: "لم يبدأ",
  in_progress: "قيد التنفيذ",
  submitted: "تم الإرسال",
};

/**
 * Unified pre/post assessment view — single source for teacher UI and APIs.
 * @param {object} progress
 * @param {{ preAttempt?: object|null, postAttempt?: object|null, publishedDays?: number }} [ctx]
 */
export function buildAssessmentSummary(progress = {}, ctx = {}) {
  const { preAttempt = null, postAttempt = null, publishedDays = null } = ctx;
  const preResolved = resolvePreAssessmentStatus(progress, preAttempt);
  const postQuiz = progress.quizScores?.["quiz-post"];
  const postFromProgress = progress.postTest;

  let postStatus = POST_ASSESSMENT_STATUS.LOCKED;
  let postPercent = null;
  let postSubmittedAt = null;

  if (postAttempt?.status === "submitted" && postAttempt.result) {
    postStatus = POST_ASSESSMENT_STATUS.SUBMITTED;
    postPercent = postAttempt.result.percent ?? null;
    postSubmittedAt = postAttempt.submittedAt ?? null;
  } else if (postQuiz?.submitted || postFromProgress?.percent != null) {
    postStatus = POST_ASSESSMENT_STATUS.SUBMITTED;
    postPercent = postFromProgress?.percent ?? postQuiz?.percent ?? null;
    postSubmittedAt = postQuiz?.at ?? null;
  } else if (publishedDays != null && publishedDays >= 15) {
    postStatus = POST_ASSESSMENT_STATUS.NOT_STARTED;
  }

  return {
    preAssessment: {
      status: preResolved.status,
      statusLabelAr: preResolved.statusLabelAr,
      scorePercent: preResolved.diagnosticPercent,
      answeredCount: preResolved.answeredCount,
      totalQuestions: preResolved.totalQuestions,
      submittedAt: preResolved.submittedAt,
      deferredAt: preResolved.deferredAt,
      isDiagnosticOnly: true,
      isBlocking: false,
    },
    postAssessment: {
      status: postStatus,
      statusLabelAr: POST_ASSESSMENT_STATUS_LABELS[postStatus] || postStatus,
      scorePercent: postPercent,
      submittedAt: postSubmittedAt,
      isDiagnosticOnly: true,
      isBlocking: false,
    },
  };
}

/** Human-readable line for teacher student card. */
export function formatAssessmentCardLine(summary) {
  if (!summary) return "—";
  const pre = formatPreAssessmentDisplay(summary.preAssessment);
  const post = formatPostAssessmentDisplay(summary.postAssessment);
  return `${pre} → ${post}`;
}

export function formatPreAssessmentDisplay(pre) {
  if (!pre) return "—";
  if (pre.status === PRE_ASSESSMENT_STATUS.SUBMITTED && pre.scorePercent != null) {
    return `${pre.scorePercent}%`;
  }
  if (pre.status === PRE_ASSESSMENT_STATUS.SUBMITTED) {
    return PRE_ASSESSMENT_STATUS_LABELS.submitted;
  }
  return pre.statusLabelAr || PRE_ASSESSMENT_STATUS_LABELS.not_started;
}

export function formatPostAssessmentDisplay(post) {
  if (!post) return "غير متاح بعد";
  if (post.status === POST_ASSESSMENT_STATUS.SUBMITTED && post.scorePercent != null) {
    return `${post.scorePercent}%`;
  }
  if (post.status === POST_ASSESSMENT_STATUS.SUBMITTED) {
    return POST_ASSESSMENT_STATUS_LABELS.submitted;
  }
  return post.statusLabelAr || POST_ASSESSMENT_STATUS_LABELS.not_available;
}

/** Merge quiz attempt result into progress snapshot when preTest missing (backfill). */
export function backfillAssessmentProgress(progress, { preAttempt = null, postAttempt = null } = {}) {
  const next = { ...progress };
  let changed = false;

  if (preAttempt?.status === "submitted" && preAttempt.result && !next.preTest?.percent) {
    next.preTest = preAttempt.result;
    next.quizScores = {
      ...(next.quizScores || {}),
      "quiz-pre": { ...preAttempt.result, submitted: true, at: preAttempt.submittedAt },
    };
    const pa = next.preAssessment || {};
    next.preAssessment = {
      ...pa,
      status: PRE_ASSESSMENT_STATUS.SUBMITTED,
      submittedAt: pa.submittedAt || preAttempt.submittedAt,
    };
    changed = true;
  }

  if (postAttempt?.status === "submitted" && postAttempt.result && !next.postTest?.percent) {
    next.postTest = postAttempt.result;
    next.quizScores = {
      ...(next.quizScores || {}),
      "quiz-post": { ...postAttempt.result, submitted: true, at: postAttempt.submittedAt },
    };
    changed = true;
  }

  return changed ? next : progress;
}
