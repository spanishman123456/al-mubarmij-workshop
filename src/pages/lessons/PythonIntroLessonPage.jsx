import { StandardLessonPage } from "./StandardLessonPage";
import { pythonIntroLesson } from "../../content/lessons/day01/pythonIntroLesson";
import { Link } from "react-router-dom";

export default function PythonIntroLessonPage() {
  return (
    <StandardLessonPage lesson={pythonIntroLesson} subtitle="pdfPage 40, 43, 85, 113">
      <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="font-semibold text-violet-900">مختبر بايثون</p>
        <p className="mt-1 text-sm text-slate-700">
          افتح مختبر بايثون من المنصة وجرّب الأمثلة: print، المتغيرات، // و %.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/python" className="text-sm font-semibold text-violet-700 hover:underline">
            فتح مختبر بايثون →
          </Link>
          <Link to="/path/day/day-01" className="text-sm font-semibold text-slate-600 hover:underline">
            ← ملخص اليوم الأول
          </Link>
        </div>
      </div>
    </StandardLessonPage>
  );
}
