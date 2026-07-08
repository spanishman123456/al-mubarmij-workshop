import { StandardLessonPage } from "./StandardLessonPage";
import { pythonRecursionLesson } from "../../content/lessons/day09/pythonRecursionLesson";
import { fractalsIntroLesson } from "../../content/lessons/day09/fractalsIntroLesson";
import { kochSnowflakeLesson } from "../../content/lessons/day09/kochSnowflakeLesson";
import { sierpinskiTriangleLesson } from "../../content/lessons/day09/sierpinskiTriangleLesson";
import { RecursionLab } from "../../components/lesson/RecursionLab";
import { FractalsIntroLab } from "../../components/lesson/FractalsIntroLab";
import { KochSnowflakeLab } from "../../components/lesson/KochSnowflakeLab";
import { SierpinskiLab } from "../../components/lesson/SierpinskiLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-09";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function PythonRecursionLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={pythonRecursionLesson}
      subtitle="pdfPageIndex 403–412"
      backTo={BACK}
      nextLink={{ to: "/lessons/fractals-intro", label: "التالي: الكسوريات →" }}
    >
      <Lab>
        <RecursionLab lessonId={pythonRecursionLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function FractalsIntroLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={fractalsIntroLesson}
      subtitle="pdfPageIndex 415–416"
      backTo={BACK}
      nextLink={{ to: "/lessons/koch-snowflake", label: "التالي: ندفة Koch →" }}
    >
      <Lab>
        <FractalsIntroLab lessonId={fractalsIntroLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function KochSnowflakeLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={kochSnowflakeLesson}
      subtitle="pdfPageIndex 417"
      backTo={BACK}
      nextLink={{ to: "/lessons/sierpinski-triangle", label: "التالي: مثلث Sierpinski →" }}
    >
      <Lab>
        <KochSnowflakeLab lessonId={kochSnowflakeLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function SierpinskiTriangleLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={sierpinskiTriangleLesson} subtitle="pdfPageIndex 418–419" backTo={BACK}>
      <Lab>
        <SierpinskiLab lessonId={sierpinskiTriangleLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
