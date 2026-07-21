import { useState } from "react";
import { listAccess, listSet } from "../../lib/pythonLabs/loopsAndLists";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function PythonListLab({ lessonId, userId }) {
  const [items, setItems] = useState([10, 20, 30]);
  const [index, setIndex] = useState("0");
  const [feedback, setFeedback] = useState("");

  function access() {
    const r = listAccess(items, Number(index));
    setFeedback(r.ok ? `items[${index}] = ${r.value}` : `خطأ: ${r.error}`);
    if (userId) recordLessonAttemptApi(userId, { lessonId, exerciseId: "list-access", answer: String(r.value ?? ""), correct: r.ok });
  }

  function mutate() {
    const r = listSet(items, 1, 99);
    if (r.ok) {
      setItems(r.list);
      setFeedback("تم تعديل index 1 → 99");
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 p-4" dir="rtl">
      <p className="font-mono text-sm" dir="ltr">
        {JSON.stringify(items)}
      </p>
      <div className="mt-2 flex gap-2" dir="ltr">
        <input className="w-16 rounded border px-2" value={index} onChange={(e) => setIndex(e.target.value)} />
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={access}>
          access
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={mutate}>
          items[1]=99
        </button>
      </div>
      {feedback ? <p className="mt-2 text-sm">{feedback}</p> : null}
    </div>
  );
}
