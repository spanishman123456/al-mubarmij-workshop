import { StandardLessonPage } from "./StandardLessonPage";
import { finalPresentationLesson } from "../../content/lessons/day15/finalPresentationLesson";
import { peerFeedbackLesson } from "../../content/lessons/day15/peerFeedbackLesson";
import { finalEvaluationLesson } from "../../content/lessons/day15/finalEvaluationLesson";
import { programClosureLesson } from "../../content/lessons/day15/programClosureLesson";
import { FinalPresentationLab, PeerFeedbackLab, FinalEvaluationLab } from "../../components/lesson/Day15Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-15";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function FinalPresentationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={finalPresentationLesson}
      subtitle="pdfPageIndex 459–460"
      backTo={BACK}
      nextLink={{ to: "/lessons/peer-feedback-and-refinement", label: "التالي: التغذية الراجعة →" }}
    >
      <Lab>
        <FinalPresentationLab lessonId={finalPresentationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function PeerFeedbackLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={peerFeedbackLesson}
      subtitle="pdfPageIndex 460–461"
      backTo={BACK}
      nextLink={{ to: "/lessons/final-evaluation", label: "التالي: التقييم الختامي →" }}
    >
      <Lab>
        <PeerFeedbackLab lessonId={peerFeedbackLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function FinalEvaluationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={finalEvaluationLesson}
      subtitle="pdfPageIndex 461–462"
      backTo={BACK}
      nextLink={{ to: "/lessons/program-closure-next-steps", label: "التالي: خاتمة البرنامج →" }}
    >
      <Lab>
        <FinalEvaluationLab lessonId={finalEvaluationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProgramClosureLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={programClosureLesson} subtitle="pdfPageIndex 462–463" backTo={BACK}>
      <Lab>
        <FinalEvaluationLab lessonId={programClosureLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
