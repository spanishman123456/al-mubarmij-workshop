import { StandardLessonPage } from "./StandardLessonPage";
import { aiFoundationsLesson } from "../../content/lessons/day11/aiFoundationsLesson";
import { machineLearningBasicsLesson } from "../../content/lessons/day11/machineLearningBasicsLesson";
import { aiEthicsSafetyLesson } from "../../content/lessons/day11/aiEthicsSafetyLesson";
import { aiResearchPresentationLesson } from "../../content/lessons/day11/aiResearchPresentationLesson";
import { AiFoundationsLab, MachineLearningLab, AiEthicsLab, AiPresentationLab } from "../../components/lesson/Day11Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-11";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function AiFoundationsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={aiFoundationsLesson}
      subtitle="pdfPageIndex 429–431"
      backTo={BACK}
      nextLink={{ to: "/lessons/machine-learning-basics", label: "التالي: التعلم الآلي →" }}
    >
      <Lab>
        <AiFoundationsLab lessonId={aiFoundationsLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function MachineLearningBasicsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={machineLearningBasicsLesson}
      subtitle="pdfPageIndex 431–433"
      backTo={BACK}
      nextLink={{ to: "/lessons/ai-ethics-safety", label: "التالي: أخلاقيات AI →" }}
    >
      <Lab>
        <MachineLearningLab lessonId={machineLearningBasicsLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function AiEthicsSafetyLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={aiEthicsSafetyLesson}
      subtitle="pdfPageIndex 433–435"
      backTo={BACK}
      nextLink={{ to: "/lessons/ai-research-presentation", label: "التالي: البحث والعرض →" }}
    >
      <Lab>
        <AiEthicsLab lessonId={aiEthicsSafetyLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function AiResearchPresentationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={aiResearchPresentationLesson} subtitle="pdfPageIndex 434–436" backTo={BACK}>
      <Lab>
        <AiPresentationLab lessonId={aiResearchPresentationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
