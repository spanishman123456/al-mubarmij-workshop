import { StandardLessonPage } from "./StandardLessonPage";
import { algorithmsLesson } from "../../content/lessons/day02/algorithmsLesson";
import { ifStatementLesson } from "../../content/lessons/day02/ifStatementLesson";
import { conversionsIntroLesson } from "../../content/lessons/day02/conversionsIntroLesson";
import { radixPracticeLesson } from "../../content/lessons/day02/radixPracticeLesson";
import { sentenceReferenceLesson } from "../../content/lessons/day02/sentenceReferenceLesson";
import { day02ComputerLabLesson } from "../../content/lessons/day02/day02ComputerLabLesson";
import { AlgorithmStepsLab } from "../../components/lesson/AlgorithmStepsLab";
import { IfStatementLab } from "../../components/lesson/IfStatementLab";
import { usePlatform } from "../../context/PlatformContext";

const DAY02_BACK = "/path/day/day-02";

export function AlgorithmsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={algorithmsLesson}
      backTo={DAY02_BACK}
      nextLink={{ to: "/lessons/if-statement", label: "التالي: جمل If →" }}
    >
      <EduCardInteractive lab={<AlgorithmStepsLab lessonId={algorithmsLesson.id} userId={user?.id} />} />
    </StandardLessonPage>
  );
}

export function IfStatementLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={ifStatementLesson}
      backTo={DAY02_BACK}
      nextLink={{ to: "/lessons/day02-computer-lab", label: "التالي: مختبر الحاسب →" }}
    >
      <EduCardInteractive
        lab={
          <IfStatementLab
            lessonId={ifStatementLesson.id}
            userId={user?.id}
            initialCode={ifStatementLesson.interactiveExample.defaultValue}
          />
        }
      />
    </StandardLessonPage>
  );
}

export function ConversionsIntroLessonPage() {
  return (
    <StandardLessonPage
      lesson={conversionsIntroLesson}
      backTo={DAY02_BACK}
      nextLink={{ to: "/lessons/radix-practice", label: "التالي: تطبيقات الأساس →" }}
    />
  );
}

export function RadixPracticeLessonPage() {
  return (
    <StandardLessonPage
      lesson={radixPracticeLesson}
      backTo={DAY02_BACK}
      nextLink={{ to: "/lessons/algorithms", label: "التالي: الخوارزميات →" }}
    />
  );
}

export function SentenceReferenceLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={sentenceReferenceLesson}
      backTo={DAY02_BACK}
      nextLink={{ to: "/lessons/if-statement", label: "التالي: تطبيق If →" }}
    >
      <EduCardInteractive
        lab={
          <IfStatementLab
            lessonId={sentenceReferenceLesson.id}
            userId={user?.id}
            initialCode={sentenceReferenceLesson.interactiveExample.defaultValue}
          />
        }
      />
    </StandardLessonPage>
  );
}

export function Day02ComputerLabLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={day02ComputerLabLesson} backTo={DAY02_BACK}>
      <EduCardInteractive
        lab={
          <IfStatementLab lessonId={day02ComputerLabLesson.id} userId={user?.id} initialCode="d1, d2 = 4, 6\nif d1 > d2:\n    print('1')\nelif d1 < d2:\n    print('2')\nelse:\n    print('تعادل')" />
        }
      />
    </StandardLessonPage>
  );
}

function EduCardInteractive({ lab }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {lab}
    </section>
  );
}
