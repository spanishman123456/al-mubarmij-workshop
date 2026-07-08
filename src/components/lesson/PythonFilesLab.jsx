import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { simulateWrite, simulateRead, countWords, fillTemplate } from "../../lib/python/fileIO.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_TEMPLATE = "مرحبًا {name}!\nالمادة: {course}\nاليوم: {day}";

export function PythonFilesLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "python-files-io-lab",
  });
  const [filename, setFilename] = useState("report.txt");
  const [nameVar, setNameVar] = useState("");
  const [courseVar, setCourseVar] = useState("برمجة");
  const [dayVar, setDayVar] = useState("8");
  const [content, setContent] = useState("");
  const [lineGuess, setLineGuess] = useState("");
  const [wordGuess, setWordGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const virtualFile = useMemo(() => simulateWrite(filename, content), [filename, content]);
  const actualWords = useMemo(() => countWords(content), [content]);

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.filename) setFilename(String(progress.filename));
    if (progress.nameVar != null) setNameVar(String(progress.nameVar));
    if (progress.courseVar != null) setCourseVar(String(progress.courseVar));
    if (progress.dayVar != null) setDayVar(String(progress.dayVar));
    if (progress.content != null) setContent(String(progress.content));
    if (progress.lineGuess != null) setLineGuess(String(progress.lineGuess));
    if (progress.wordGuess != null) setWordGuess(String(progress.wordGuess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = {
        filename,
        nameVar,
        courseVar,
        dayVar,
        content,
        lineGuess,
        wordGuess,
        hints,
        ...patch,
      };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [filename, nameVar, courseVar, dayVar, content, lineGuess, wordGuess, hints, persist, markComplete],
  );

  function applyTemplate() {
    const filled = fillTemplate(DEFAULT_TEMPLATE, {
      name: nameVar || "طالب",
      course: courseVar || "برمجة",
      day: dayVar || "8",
    });
    setContent(filled);
    setFeedback("تم ملء القالب — راجع المحتوى ثم حدّد عدد الأسطر والكلمات.");
    save({ content: filled });
  }

  function checkAnswer() {
    const lines = Number(String(lineGuess || "").trim());
    const words = Number(String(wordGuess || "").trim());
    const file = simulateWrite(filename, content);
    const readBack = simulateRead(file);
    const wordsActual = countWords(readBack);
    const ok =
      Number.isFinite(lines) &&
      Number.isFinite(words) &&
      lines === file.lineCount &&
      words === wordsActual &&
      content.trim().length > 0;

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "python-files-io-count",
        answer: `${lineGuess},${wordGuess}`,
        correct: ok,
        hintsUsed: hints,
      });
    }

    if (ok) {
      setFeedback(
        `إجابة صحيحة ✓ الملف "${file.filename}": ${file.lineCount} أسطر، ${wordsActual} كلمات، ${file.charCount} حرف.`,
      );
      save({ lineGuess, wordGuess, solvedAt: new Date().toISOString() }, true);
    } else if (!content.trim()) {
      setFeedback("اكتب محتوى الملف أولًا — استخدم «ملء القالب» أو عدّل النص يدويًا.");
      save({ lineGuess, wordGuess });
    } else {
      setFeedback(
        `غير صحيح — المحتوى الحالي: ${file.lineCount} أسطر و${wordsActual} كلمات. راجع split("\\n") و countWords.`,
      );
      save({ lineGuess, wordGuess });
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    if (next === 1) {
      setFeedback('تلميح 1: عدد الأسطر = content.split("\\n").length — كل سطر ينتهي بـ Enter.');
    } else {
      setFeedback(`تلميح 2: المحتوى الحالي يحتوي ${virtualFile.lineCount} أسطر و${actualWords} كلمات.`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-teal-200 bg-teal-50/40 p-4"
      dir="rtl"
      data-testid="python-files-io-lab"
    >
      <p className="font-bold text-teal-900">مختبر قراءة/كتابة الملفات (Python)</p>
      <p className="mt-1 text-sm text-slate-700">
        اكتب محتوى ملف افتراضي، ثم حدّد عدد الأسطر والكلمات كما يفعل simulateWrite و countWords.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-semibold">اسم الملف</span>
          <input
            type="text"
            value={filename}
            onChange={(e) => {
              setFilename(e.target.value);
              save({ filename: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            data-testid="file-name-input"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">الاسم (قالب)</span>
          <input
            type="text"
            value={nameVar}
            onChange={(e) => {
              setNameVar(e.target.value);
              save({ nameVar: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            placeholder="اسمك"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">المادة</span>
          <input
            type="text"
            value={courseVar}
            onChange={(e) => {
              setCourseVar(e.target.value);
              save({ courseVar: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">اليوم</span>
          <input
            type="text"
            value={dayVar}
            onChange={(e) => {
              setDayVar(e.target.value);
              save({ dayVar: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            dir="ltr"
          />
        </label>
      </div>

      <button type="button" onClick={applyTemplate} className="edu-btn edu-btn-outline mt-3 text-sm">
        ملء القالب
      </button>

      <label className="mt-4 block text-sm">
        <span className="font-semibold">محتوى الملف</span>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            save({ content: e.target.value });
          }}
          rows={5}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
          placeholder="اكتب أو املأ القالب..."
          data-testid="file-content-textarea"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="font-semibold">عدد الأسطر</span>
          <input
            type="number"
            min={0}
            value={lineGuess}
            onChange={(e) => {
              setLineGuess(e.target.value);
              save({ lineGuess: e.target.value });
            }}
            className="mt-1 w-24 rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            data-testid="line-count-guess"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">عدد الكلمات</span>
          <input
            type="number"
            min={0}
            value={wordGuess}
            onChange={(e) => {
              setWordGuess(e.target.value);
              save({ wordGuess: e.target.value });
            }}
            className="mt-1 w-24 rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            data-testid="word-count-guess"
          />
        </label>
        <button type="button" onClick={checkAnswer} className="edu-btn edu-btn-primary text-sm">
          تحقق
        </button>
        <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
          تلميح ({hints}/2)
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
