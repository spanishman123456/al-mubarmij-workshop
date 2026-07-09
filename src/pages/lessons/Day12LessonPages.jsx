import { StandardLessonPage } from "./StandardLessonPage";
import { regexAutomataLesson } from "../../content/lessons/day12/regexAutomataLesson";
import { dfaNfaLesson } from "../../content/lessons/day12/dfaNfaLesson";
import { complexityPnpLesson } from "../../content/lessons/day12/complexityPnpLesson";
import { graphTheoryLesson } from "../../content/lessons/day12/graphTheoryLesson";
import { AutomataLab, ComplexityLab, GraphLab } from "../../components/lesson/Day12Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-12";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function RegexAutomataLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={regexAutomataLesson}
      subtitle="pdfPageIndex 439–440"
      backTo={BACK}
      nextLink={{ to: "/lessons/dfa-nfa-design", label: "التالي: DFA/NFA →" }}
    >
      <Lab>
        <AutomataLab lessonId={regexAutomataLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function DfaNfaLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={dfaNfaLesson}
      subtitle="pdfPageIndex 441–442"
      backTo={BACK}
      nextLink={{ to: "/lessons/p-vs-np-intro", label: "التالي: P و NP →" }}
    >
      <Lab>
        <AutomataLab lessonId={dfaNfaLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ComplexityPnpLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={complexityPnpLesson}
      subtitle="pdfPageIndex 443–444"
      backTo={BACK}
      nextLink={{ to: "/lessons/graph-theory-basics", label: "التالي: نظرية المخططات →" }}
    >
      <Lab>
        <ComplexityLab lessonId={complexityPnpLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function GraphTheoryLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={graphTheoryLesson} subtitle="pdfPageIndex 445–446" backTo={BACK}>
      <Lab>
        <GraphLab lessonId={graphTheoryLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
