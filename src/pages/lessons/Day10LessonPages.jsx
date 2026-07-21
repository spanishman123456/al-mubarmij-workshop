import { StandardLessonPage } from "./StandardLessonPage";
import { oopFoundationsLesson } from "../../content/lessons/day10/oopFoundationsLesson";
import { steganographyLesson } from "../../content/lessons/day10/steganographyLesson";
import { fractalTreeLesson } from "../../content/lessons/day10/fractalTreeLesson";
import { lockerPascalLesson } from "../../content/lessons/day10/lockerPascalLesson";
import { OopFoundationsLab, SteganographyLab, FractalTreeLab, LockerPascalLab } from "../../components/lesson/Day10Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-10";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function OopFoundationsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={oopFoundationsLesson}
      subtitle="pdfPageIndex 421–427"
      backTo={BACK}
      nextLink={{ to: "/lessons/steganography-python", label: "التالي: إخفاء المعلومات →" }}
    >
      <Lab>
        <OopFoundationsLab lessonId={oopFoundationsLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function SteganographyLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={steganographyLesson}
      subtitle="pdfPageIndex 436–440"
      backTo={BACK}
      nextLink={{ to: "/lessons/fractal-tree-recursion", label: "التالي: الشجرة المتكررة →" }}
    >
      <Lab>
        <SteganographyLab lessonId={steganographyLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function FractalTreeLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={fractalTreeLesson}
      subtitle="pdfPageIndex 441–444"
      backTo={BACK}
      nextLink={{ to: "/lessons/locker-pascal-problem", label: "التالي: الخزانة ومثلث باسكال →" }}
    >
      <Lab>
        <FractalTreeLab lessonId={fractalTreeLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function LockerPascalLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={lockerPascalLesson} subtitle="pdfPageIndex 468+" backTo={BACK}>
      <Lab>
        <LockerPascalLab lessonId={lockerPascalLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
