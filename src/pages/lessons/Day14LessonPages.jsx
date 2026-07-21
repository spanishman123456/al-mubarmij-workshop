import { StandardLessonPage } from "./StandardLessonPage";
import { projectArchitectureLesson } from "../../content/lessons/day14/projectArchitectureLesson";
import { projectImplementationLesson } from "../../content/lessons/day14/projectImplementationLesson";
import { projectTestingLesson } from "../../content/lessons/day14/projectTestingLesson";
import { projectPresentationLesson } from "../../content/lessons/day14/projectPresentationLesson";
import { ProjectBuildLab, ProjectTestingLab, ProjectDemoLab } from "../../components/lesson/Day14Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-14";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function ProjectArchitectureLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={projectArchitectureLesson}
      subtitle="pdfPageIndex 454–455"
      backTo={BACK}
      nextLink={{ to: "/lessons/project-implementation-sprint", label: "التالي: تنفيذ المشروع →" }}
    >
      <Lab>
        <ProjectBuildLab lessonId={projectArchitectureLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProjectImplementationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={projectImplementationLesson}
      subtitle="pdfPageIndex 455–456"
      backTo={BACK}
      nextLink={{ to: "/lessons/project-testing-debugging", label: "التالي: اختبار المشروع →" }}
    >
      <Lab>
        <ProjectBuildLab lessonId={projectImplementationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProjectTestingLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={projectTestingLesson}
      subtitle="pdfPageIndex 456–457"
      backTo={BACK}
      nextLink={{ to: "/lessons/project-presentation-rehearsal", label: "التالي: تجهيز العرض →" }}
    >
      <Lab>
        <ProjectTestingLab lessonId={projectTestingLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProjectPresentationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={projectPresentationLesson} subtitle="pdfPageIndex 457–458" backTo={BACK}>
      <Lab>
        <ProjectDemoLab lessonId={projectPresentationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
