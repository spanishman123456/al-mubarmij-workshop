import { StandardLessonPage } from "./StandardLessonPage";
import { asciiUnicodeLesson } from "../../content/lessons/day01/asciiUnicodeLesson";
import { AsciiTable } from "../../components/lesson/AsciiTable";
import { EduCard } from "../../components/layout/PageShell";

export default function AsciiUnicodeLessonPage() {
  return (
    <StandardLessonPage
      lesson={asciiUnicodeLesson}
      subtitle="pdfPage 46, 96, 97, 129"
      nextLink={{ to: "/lessons/python-intro", label: "التالي: مقدمة بايثون →" }}
    >
      <EduCard title="جدول ASCII تفاعلي" className="mt-6" accent="cyan">
        <AsciiTable highlightChar="A" />
      </EduCard>
    </StandardLessonPage>
  );
}
