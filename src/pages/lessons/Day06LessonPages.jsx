import { StandardLessonPage } from "./StandardLessonPage";
import { caesarCipherLesson } from "../../content/lessons/day06/caesarCipherLesson";
import { memoryHierarchyLesson } from "../../content/lessons/day06/memoryHierarchyLesson";
import { cpuSchedulingLesson } from "../../content/lessons/day06/cpuSchedulingLesson";
import { CaesarCipherLab } from "../../components/lesson/CaesarCipherLab";
import { MemoryHierarchyLab } from "../../components/lesson/MemoryHierarchyLab";
import { CpuSchedulingLab } from "../../components/lesson/CpuSchedulingLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-06";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function CaesarCipherLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={caesarCipherLesson}
      subtitle="pdfPageIndex 301–306"
      backTo={BACK}
      nextLink={{ to: "/lessons/memory-hierarchy", label: "التالي: الذاكرة والتخزين المؤقت →" }}
    >
      <Lab>
        <CaesarCipherLab lessonId={caesarCipherLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function MemoryHierarchyLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={memoryHierarchyLesson}
      subtitle="pdfPageIndex 307–311"
      backTo={BACK}
      nextLink={{ to: "/lessons/cpu-scheduling", label: "التالي: جدولة المعالج →" }}
    >
      <Lab>
        <MemoryHierarchyLab lessonId={memoryHierarchyLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function CpuSchedulingLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={cpuSchedulingLesson} subtitle="pdfPageIndex 312–314" backTo={BACK}>
      <Lab>
        <CpuSchedulingLab lessonId={cpuSchedulingLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
