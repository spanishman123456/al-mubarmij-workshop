/**
 * تصنيف أسئلة التقويم القبلي/البعدي الرسمية حسب موضوعات مسار 15 يوماً.
 * كل سؤال قد يُنسب لموضوع واحد أو أكثر لأغراض الربط فقط.
 */

/** @typedef {string} CurriculumTopic */

/** @type {Record<string, CurriculumTopic[]>} */
export const OFFICIAL_QUESTION_TOPICS = {
  // ── أنظمة العد والثنائي ──
  "pre-01a": ["number-systems", "binary"],
  "pre-01b": ["number-systems", "binary"],
  "pre-01c": ["number-systems", "binary", "hex"],
  "pre-01d": ["number-systems", "hex"],
  "pre-02a": ["number-systems", "binary"],
  "pre-02b": ["number-systems", "hex"],
  "pre-03a": ["number-systems", "binary"],
  "pre-03b": ["number-systems", "binary"],
  "pre-03c": ["number-systems", "binary"],
  "pre-07": ["number-systems", "binary"],
  "pre-bin-d2b-1": ["number-systems", "binary"],
  "pre-bin-d2b-2": ["number-systems", "binary"],
  "pre-bin-d2b-3": ["number-systems", "binary"],
  "pre-bin-d2b-4": ["number-systems", "binary"],
  "pre-bin-d2b-5": ["number-systems", "binary"],
  "pre-bin-d2b-6": ["number-systems", "binary"],
  "pre-bin-b2d-7": ["number-systems", "binary"],
  "pre-bin-b2d-8": ["number-systems", "binary"],
  "pre-bin-b2d-9": ["number-systems", "binary"],
  "pre-bin-b2d-10": ["number-systems", "binary"],
  "pre-bin-11": ["number-systems", "binary"],
  "pre-base11-2": ["number-systems"],
  "pre-base11-3": ["number-systems"],
  "pre-base11-4": ["number-systems"],
  "pre-base11-5": ["number-systems"],
  "pre-base11-6": ["number-systems"],
  "pre-base11-7": ["number-systems"],
  "pre-base11-8": ["number-systems"],
  "pre-puzzle-1": ["number-systems", "binary"],
  "pre-puzzle-2": ["number-systems", "binary"],
  "pre-puzzle-3": ["number-systems", "binary"],
  "pre-puzzle-4": ["number-systems", "binary"],
  "pre-puzzle-5": ["number-systems", "binary"],
  "pre-puzzle-6": ["number-systems", "binary"],
  "pre-puzzle-7": ["number-systems", "binary"],
  "pre-match-A": ["number-systems", "binary"],
  "pre-match-B": ["number-systems", "binary"],
  "pre-match-C": ["number-systems", "binary"],
  "pre-match-D": ["number-systems", "binary"],
  "pre-match-E": ["number-systems", "binary"],
  "pre-match-F": ["number-systems", "binary"],
  "pre-match-G": ["number-systems", "binary"],
  "pre-match-H": ["number-systems", "binary"],
  "pre-match-I": ["number-systems", "binary"],
  "pre-match-J": ["number-systems", "binary"],
  "pre-match-K": ["number-systems", "binary"],
  "pre-match-L": ["number-systems", "binary"],
  "pre-match-M": ["number-systems", "binary"],
  "pre-match-N": ["number-systems", "binary"],
  "pre-match-O": ["number-systems", "binary"],
  "pre-match-P": ["number-systems", "binary"],
  "pre-match-Q": ["number-systems", "binary"],
  "pre-match-R": ["number-systems", "binary"],
  "pre-match-S": ["number-systems", "binary"],
  "pre-match-T": ["number-systems", "binary"],
  "pre-bincard-sheet": ["number-systems", "binary"],
  "pre-tern-1": ["number-systems"],
  "pre-tern-2": ["number-systems"],
  "pre-tern-3": ["number-systems"],
  "pre-tern-4": ["number-systems"],
  "pre-tern-5": ["number-systems"],
  "pre-tern-6": ["number-systems"],
  "pre-tern-7": ["number-systems"],
  "pre-tern-8": ["number-systems"],
  "pre-tern-9": ["number-systems"],
  "pre-tern-10": ["number-systems"],
  "pre-tern-11": ["number-systems"],
  "pre-tern-12": ["number-systems"],
  "pre-tern-13": ["number-systems"],
  "pre-tern-14": ["number-systems"],
  "pre-tern-15": ["number-systems"],

  // ── بايثون أساسيات ──
  "pre-py-01": ["python-basics"],
  "pre-py-02": ["python-basics"],
  "pre-py-03": ["python-basics"],
  "pre-py-04": ["python-basics"],
  "pre-py-05": ["python-basics"],
  "pre-py-06": ["python-basics"],
  "pre-str-1": ["python-basics", "strings"],
  "pre-str-2": ["python-basics", "strings"],
  "pre-str-3": ["python-basics", "strings"],

  // ── الخوارزميات والمخططات ──
  "pre-05أ": ["algorithms"],
  "pre-08": ["algorithms", "search-sort"],
  "pre-11": ["algorithms", "search-sort"],
  "pre-19": ["algorithms", "flowchart"],

  // ── المنطق ──
  "pre-04": ["logic", "truth-tables"],
  "pre-17": ["logic", "karnaugh"],

  // ── المكونات والذاكرة ──
  "pre-05ب": ["hardware"],
  "pre-05ج": ["hardware", "software"],
  "pre-05د": ["hardware", "software"],
  "pre-06a": ["hardware"],
  "pre-06b": ["hardware", "memory"],
  "pre-06c": ["hardware", "memory"],
  "pre-06d": ["hardware", "memory"],

  // ── التحكم والحلقات ──
  "pre-09": ["control-flow", "loops", "python-basics"],
  "pre-13a": ["control-flow", "loops"],
  "pre-13b": ["control-flow", "loops"],
  "pre-14": ["control-flow", "loops"],
  "pre-18": ["control-flow", "functions"],

  // ── التكرار ──
  "pre-12": ["recursion"],

  // ── جدولة المعالج ──
  "pre-16a": ["scheduling"],
  "pre-16b": ["scheduling"],

  // ── نظرية المخططات ──
  "pre-15": ["graphs"],

  // ── أخلاقيات / مراجعة ──
  "pre-10": ["ethics", "review"],
};

/** نسخ البعدي — نفس الموضوعات */
for (const [id, topics] of Object.entries({ ...OFFICIAL_QUESTION_TOPICS })) {
  if (id.startsWith("pre-")) {
    OFFICIAL_QUESTION_TOPICS[id.replace(/^pre-/, "post-")] = [...topics];
  }
}

export function getTopicsForOfficialId(id) {
  return OFFICIAL_QUESTION_TOPICS[id] ?? [];
}
