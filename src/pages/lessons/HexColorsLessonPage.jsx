import { StandardLessonPage } from "./StandardLessonPage";
import { hexColorsLesson } from "../../content/lessons/day01/hexColorsLesson";
import { HexColorLab } from "../../components/lesson/HexColorLab";
import { EduCard } from "../../components/layout/PageShell";

export default function HexColorsLessonPage() {
  return (
    <StandardLessonPage
      lesson={hexColorsLesson}
      subtitle="pdfPage 50, 51"
      nextLink={{ to: "/lessons/ascii-unicode", label: "التالي: ASCII و Unicode →" }}
    >
      <EduCard title="معاينة RGB → Hex" className="mt-6" accent="cyan">
        <HexColorLab initial={{ r: 255, g: 0, b: 0 }} />
      </EduCard>
    </StandardLessonPage>
  );
}
