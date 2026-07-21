import { StandardLessonPage } from "./StandardLessonPage";
import { fibonacciSequenceLesson } from "../../content/lessons/day08/fibonacciSequenceLesson";
import { algorithmComplexityLesson } from "../../content/lessons/day08/algorithmComplexityLesson";
import { towerOfHanoiLesson } from "../../content/lessons/day08/towerOfHanoiLesson";
import { pythonFilesIoLesson } from "../../content/lessons/day08/pythonFilesIoLesson";
import { FibonacciLab } from "../../components/lesson/FibonacciLab";
import { ComplexityLab } from "../../components/lesson/ComplexityLab";
import { TowerOfHanoiLab } from "../../components/lesson/TowerOfHanoiLab";
import { PythonFilesLab } from "../../components/lesson/PythonFilesLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-08";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function FibonacciSequenceLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={fibonacciSequenceLesson}
      subtitle="pdfPageIndex 378–392"
      backTo={BACK}
      nextLink={{ to: "/lessons/algorithm-complexity", label: "التالي: تعقيد الخوارزميات →" }}
    >
      <Lab>
        <FibonacciLab lessonId={fibonacciSequenceLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function AlgorithmComplexityLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={algorithmComplexityLesson}
      subtitle="pdfPageIndex 384–388"
      backTo={BACK}
      nextLink={{ to: "/lessons/tower-of-hanoi", label: "التالي: برج هانوي →" }}
    >
      <Lab>
        <ComplexityLab lessonId={algorithmComplexityLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function TowerOfHanoiLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={towerOfHanoiLesson}
      subtitle="pdfPageIndex 395"
      backTo={BACK}
      nextLink={{ to: "/lessons/python-files-io", label: "التالي: الملفات في بايثون →" }}
    >
      <Lab>
        <TowerOfHanoiLab lessonId={towerOfHanoiLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function PythonFilesIoLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={pythonFilesIoLesson} subtitle="pdfPageIndex 399–401" backTo={BACK}>
      <Lab>
        <PythonFilesLab lessonId={pythonFilesIoLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
