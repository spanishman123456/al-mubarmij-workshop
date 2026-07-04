import { StandardLessonPage } from "./StandardLessonPage";
import { binaryPuzzleLesson } from "../../content/lessons/day01/binaryPuzzleLesson";

export default function BinaryPuzzleLessonPage() {
  return (
    <StandardLessonPage
      lesson={binaryPuzzleLesson}
      subtitle="pdfPageIndex 70–76"
      backTo="/path/day/day-01"
      nextLink={{ to: "/lessons/binary-matching", label: "التالي: بطاقات المطابقة →" }}
    />
  );
}
