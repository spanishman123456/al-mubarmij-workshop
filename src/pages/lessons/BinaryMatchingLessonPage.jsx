import { StandardLessonPage } from "./StandardLessonPage";
import { binaryMatchingLesson } from "../../content/lessons/day01/binaryMatchingLesson";

export default function BinaryMatchingLessonPage() {
  return (
    <StandardLessonPage
      lesson={binaryMatchingLesson}
      subtitle="pdfPageIndex 81–82"
      backTo="/path/day/day-01"
      nextLink={{ to: "/lessons/string-splitting", label: "التالي: تقسيم السلاسل →" }}
    />
  );
}
