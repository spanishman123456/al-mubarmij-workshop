import { StandardLessonPage } from "./StandardLessonPage";
import { karnaughMapsLesson } from "../../content/lessons/day04/karnaughMapsLesson";
import { logicEquivalenceLesson } from "../../content/lessons/day04/logicEquivalenceLesson";
import { pythonTuplesLesson } from "../../content/lessons/day04/pythonTuplesLesson";
import { nestedLoopsLabLesson } from "../../content/lessons/day04/nestedLoopsLabLesson";
import { KarnaughMapLab } from "../../components/lesson/KarnaughMapLab";
import { LogicEquivalenceLab } from "../../components/lesson/LogicEquivalenceLab";
import { TupleLab } from "../../components/lesson/TupleLab";
import { NestedLoopsLab } from "../../components/lesson/NestedLoopsLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-04";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function KarnaughMapsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={karnaughMapsLesson}
      subtitle="pdfPageIndex 190–193"
      backTo={BACK}
      nextLink={{ to: "/lessons/logic-equivalence", label: "التالي: الاقترانات المنطقية →" }}
    >
      <Lab>
        <KarnaughMapLab lessonId={karnaughMapsLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function LogicEquivalenceLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={logicEquivalenceLesson}
      subtitle="pdfPageIndex 194–195"
      backTo={BACK}
      nextLink={{ to: "/lessons/python-tuples", label: "التالي: الحقول المترابطة →" }}
    >
      <Lab>
        <LogicEquivalenceLab lessonId={logicEquivalenceLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function PythonTuplesLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={pythonTuplesLesson}
      subtitle="pdfPageIndex 196–199"
      backTo={BACK}
      nextLink={{ to: "/lessons/nested-loops-lab", label: "التالي: الحلقات المتداخلة →" }}
    >
      <Lab>
        <TupleLab lessonId={pythonTuplesLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function NestedLoopsLabLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={nestedLoopsLabLesson} subtitle="pdfPageIndex 200–203" backTo={BACK}>
      <Lab>
        <NestedLoopsLab lessonId={nestedLoopsLabLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
