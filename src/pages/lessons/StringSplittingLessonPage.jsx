import { StandardLessonPage } from "./StandardLessonPage";
import { stringSplittingLesson } from "../../content/lessons/day01/stringSplittingLesson";

export default function StringSplittingLessonPage() {
  return (
    <StandardLessonPage
      lesson={stringSplittingLesson}
      subtitle="pdfPageIndex 40, 129"
      backTo="/path/day/day-01"
      nextLink={{ to: "/lessons/hex-puzzle", label: "التالي: أحجية hex →" }}
    />
  );
}
