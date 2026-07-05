import { Link, useParams } from "react-router-dom";
import { QuizReviewPageContent } from "./ServerQuizPages";

export default function QuizReviewPage() {
  const { attemptId } = useParams();

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 font-ar text-white">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/quizzes" className="mb-6 inline-block text-sm text-slate-400 hover:text-white">
          ← العودة للاختبارات
        </Link>
        <QuizReviewPageContent attemptId={Number(attemptId)} />
      </div>
    </div>
  );
}
