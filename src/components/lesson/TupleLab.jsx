import { useCallback, useEffect, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

const START = [10, 20, 30];

export function TupleLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "tuple-lab",
  });
  const [index, setIndex] = useState("1");
  const [unpackA, setUnpackA] = useState("");
  const [unpackB, setUnpackB] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.index != null) setIndex(String(progress.index));
  }, [restored, progress]);

  const t = START;
  const save = useCallback(
    (patch, done = false) => {
      const payload = { index, unpackA, unpackB, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [index, unpackA, unpackB, persist, markComplete],
  );

  function checkIndex() {
    const i = Number(index);
    const ok = Number.isInteger(i) && i >= 0 && i < t.length && t[i] === 20;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "tuple-index",
        answer: `t[${index}]=${t[i]}`,
        correct: ok,
      });
    }
    setFeedback(ok ? "صحيح! t[1] = 20" : `t[${index}] = ${t[i] ?? "؟"} — جرّب الفهرس 1.`);
    if (ok) save({ index }, false);
  }

  function checkUnpack() {
    const ok = unpackA.trim() === "10" && unpackB.trim() === "20";
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "tuple-unpack",
        answer: `${unpackA},${unpackB}`,
        correct: ok,
      });
    }
    if (ok) {
      setFeedback("ممتاز! a=10, b=20 من التفكيك.");
      save({ unpackA, unpackB }, true);
    } else {
      setFeedback("a, b = t — أول عنصر 10 والثاني 20.");
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4" dir="rtl" data-testid="tuple-lab">
      <p className="font-bold text-amber-900">مختبر الحقول المترابطة</p>
      <p className="mt-1 font-mono text-sm" dir="ltr">
        t = {JSON.stringify(t)}
      </p>

      <div className="mt-4 space-y-3">
        <label className="block text-sm">
          ما قيمة t[i] إذا كان i =
          <input
            type="number"
            className="mx-2 w-16 rounded border px-2 py-1"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            min={0}
            max={2}
          />
          ؟ (المطلوب: 20)
        </label>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={checkIndex}>
          تحقق من الفهرس
        </button>

        <label className="mt-4 block text-sm">
          تفكيك: a, b = t — اكتب a و b:
          <div className="mt-2 flex gap-2">
            <input
              className="w-20 rounded border px-2 py-1"
              placeholder="a"
              value={unpackA}
              onChange={(e) => setUnpackA(e.target.value)}
            />
            <input
              className="w-20 rounded border px-2 py-1"
              placeholder="b"
              value={unpackB}
              onChange={(e) => setUnpackB(e.target.value)}
            />
          </div>
        </label>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkUnpack}>
          تحقق من التفكيك
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-amber-900">{feedback}</p> : null}
    </div>
  );
}
