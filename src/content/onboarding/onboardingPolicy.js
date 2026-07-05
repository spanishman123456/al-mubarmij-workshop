/** Onboarding gate policy — required docs vs optional diagnostic pre-assessment. */

export const DOC_TYPES = ["honor_code", "acceptable_use", "honor_agreement", "tech_contract"];

export const PRE_ASSESSMENT_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  DEFERRED: "deferred",
};

export const PRE_ASSESSMENT_STATUS_LABELS = {
  not_started: "لم يبدأ",
  in_progress: "قيد التنفيذ",
  submitted: "تم الإرسال",
  deferred: "مؤجل",
};

export const PRE_ASSESSMENT_HUB_HINT = "تقويم تشخيصي — يمكنك إكماله الآن أو لاحقًا";

export const PRE_ASSESSMENT_INTRO_AR =
  "هذا التقويم يساعد المعلم على معرفة خبراتك السابقة، ولا تؤثر نتيجته في دخولك إلى الدرس أو تقييمك النهائي.";

export const PRE_ASSESSMENT_SUBMITTED_AR =
  "شكرًا لإكمال التقويم القبلي. تم حفظ إجاباتك ليستفيد منها المعلم في دعم تعلمك.";

export const PRE_ASSESSMENT_DEFERRED_AR =
  "يمكنك إكمال التقويم القبلي لاحقًا، ولن يمنعك ذلك من بدء الدرس الأول.";

export const PRE_ASSESSMENT_DEFER_CONFIRM_AR =
  "تم حفظ إجاباتك الحالية. يمكنك متابعة الدرس الأول والعودة إلى التقويم في أي وقت.";

export function isRequiredOnboardingComplete({ bingo, agreements }) {
  const bingoOk = bingo?.status === "submitted";
  const agreementsOk = DOC_TYPES.every((t) => agreements?.[t]?.status === "signed");
  return bingoOk && agreementsOk;
}

function countAnswered(answers = {}) {
  return Object.values(answers).filter((v) => v !== undefined && v !== null && String(v).trim() !== "").length;
}

function legacyPreSubmitted(progress = {}) {
  if (progress.preTest?.percent != null || progress.preTest?.score != null) return true;
  const quizPre = progress.quizScores?.["quiz-pre"];
  return Boolean(quizPre?.submitted || quizPre?.percent != null || quizPre?.score != null);
}

export function resolvePreAssessmentStatus(progress = {}) {
  const pa = progress.preAssessment || {};
  const answers = pa.answers || {};
  const answeredCount = countAnswered(answers);
  const quizPre = progress.quizScores?.["quiz-pre"];

  let status = pa.status || PRE_ASSESSMENT_STATUS.NOT_STARTED;

  if (status === PRE_ASSESSMENT_STATUS.SUBMITTED || legacyPreSubmitted(progress)) {
    status = PRE_ASSESSMENT_STATUS.SUBMITTED;
  } else if (status === PRE_ASSESSMENT_STATUS.DEFERRED) {
    /* keep */
  } else if (status === PRE_ASSESSMENT_STATUS.IN_PROGRESS || answeredCount > 0) {
    status = PRE_ASSESSMENT_STATUS.IN_PROGRESS;
  } else {
    status = PRE_ASSESSMENT_STATUS.NOT_STARTED;
  }

  return {
    status,
    statusLabelAr: PRE_ASSESSMENT_STATUS_LABELS[status] || status,
    answeredCount: status === PRE_ASSESSMENT_STATUS.SUBMITTED ? (quizPre?.total ?? answeredCount) : answeredCount,
    totalQuestions: pa.totalQuestions ?? null,
    startedAt: pa.startedAt ?? null,
    updatedAt: pa.updatedAt ?? null,
    submittedAt: pa.submittedAt ?? quizPre?.at ?? null,
    deferredAt: pa.deferredAt ?? null,
    diagnosticPercent:
      status === PRE_ASSESSMENT_STATUS.SUBMITTED
        ? (progress.preTest?.percent ?? quizPre?.percent ?? null)
        : null,
    isDiagnosticOnly: true,
    isBlocking: false,
  };
}

export function buildOnboardingAccessStatus({ bingo, agreements, progress }) {
  const requiredComplete = isRequiredOnboardingComplete({ bingo, agreements });
  const preAssessment = resolvePreAssessmentStatus(progress);
  return {
    requiredComplete,
    canAccessDayOne: requiredComplete,
    complete: requiredComplete,
    preAssessment,
  };
}

export function getPreAssessmentTeacherLabel(status) {
  switch (status) {
    case PRE_ASSESSMENT_STATUS.SUBMITTED:
      return "أُرسل";
    case PRE_ASSESSMENT_STATUS.DEFERRED:
      return "أُجّل";
    case PRE_ASSESSMENT_STATUS.IN_PROGRESS:
      return "بدأ ولم يكمل";
    case PRE_ASSESSMENT_STATUS.NOT_STARTED:
    default:
      return "لم يبدأ";
  }
}
