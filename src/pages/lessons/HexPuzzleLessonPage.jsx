import { StandardLessonPage } from "./StandardLessonPage";
import { hexPuzzleLesson } from "../../content/lessons/day01/hexPuzzleLesson";

export default function HexPuzzleLessonPage() {
  return (
    <StandardLessonPage
      lesson={hexPuzzleLesson}
      subtitle="pdfPageIndex 50–51"
      backTo="/path/day/day-01"
      nextLink={{ to: "/lessons/hex-colors", label: "التالي: ألوان Hex →" }}
    />
  );
}
