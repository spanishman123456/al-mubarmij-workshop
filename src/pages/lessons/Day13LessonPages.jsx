import { StandardLessonPage } from "./StandardLessonPage";
import { comprehensiveReviewLesson } from "../../content/lessons/day13/comprehensiveReviewLesson";
import { postAssessmentLesson } from "../../content/lessons/day13/postAssessmentLesson";
import { projectIdeationLesson } from "../../content/lessons/day13/projectIdeationLesson";
import { projectPlanningLesson } from "../../content/lessons/day13/projectPlanningLesson";
import { ReviewLab, PostAssessmentLab, ProjectPrepLab } from "../../components/lesson/Day13Labs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-13";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function ComprehensiveReviewLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={comprehensiveReviewLesson}
      subtitle="pdfPageIndex 449–450"
      backTo={BACK}
      nextLink={{ to: "/lessons/post-assessment-readiness", label: "التالي: التقويم البعدي →" }}
    >
      <Lab>
        <ReviewLab lessonId={comprehensiveReviewLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function PostAssessmentLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={postAssessmentLesson}
      subtitle="pdfPageIndex 450–451"
      backTo={BACK}
      nextLink={{ to: "/lessons/project-ideation", label: "التالي: فكرة المشروع →" }}
    >
      <Lab>
        <PostAssessmentLab lessonId={postAssessmentLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProjectIdeationLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={projectIdeationLesson}
      subtitle="pdfPageIndex 451–452"
      backTo={BACK}
      nextLink={{ to: "/lessons/project-planning", label: "التالي: تخطيط المشروع →" }}
    >
      <Lab>
        <ProjectPrepLab lessonId={projectIdeationLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function ProjectPlanningLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={projectPlanningLesson} subtitle="pdfPageIndex 452–453" backTo={BACK}>
      <Lab>
        <ProjectPrepLab lessonId={projectPlanningLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
