import { StandardLessonPage } from "./StandardLessonPage";
import { linearSearchLesson } from "../../content/lessons/day05/linearSearchLesson";
import { binarySearchLesson } from "../../content/lessons/day05/binarySearchLesson";
import { sortingAlgorithmsLesson } from "../../content/lessons/day05/sortingAlgorithmsLesson";
import { sievePrimesLesson } from "../../content/lessons/day05/sievePrimesLesson";
import { LinearSearchLab } from "../../components/lesson/LinearSearchLab";
import { BinarySearchLab } from "../../components/lesson/BinarySearchLab";
import { SelectionSortLab } from "../../components/lesson/SelectionSortLab";
import { SievePrimesLab } from "../../components/lesson/SievePrimesLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-05";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function LinearSearchLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={linearSearchLesson}
      subtitle="pdfPageIndex 253–261"
      backTo={BACK}
      nextLink={{ to: "/lessons/binary-search", label: "التالي: البحث الثنائي →" }}
    >
      <Lab>
        <LinearSearchLab lessonId={linearSearchLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function BinarySearchLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={binarySearchLesson}
      subtitle="pdfPageIndex 262–272"
      backTo={BACK}
      nextLink={{ to: "/lessons/sorting-algorithms", label: "التالي: فرز الاختيار →" }}
    >
      <Lab>
        <BinarySearchLab lessonId={binarySearchLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function SortingAlgorithmsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={sortingAlgorithmsLesson}
      subtitle="pdfPageIndex 285–286"
      backTo={BACK}
      nextLink={{ to: "/lessons/sieve-primes", label: "التالي: غربال إراتوستينس →" }}
    >
      <Lab>
        <SelectionSortLab lessonId={sortingAlgorithmsLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function SievePrimesLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={sievePrimesLesson} subtitle="pdfPageIndex 287–294" backTo={BACK}>
      <Lab>
        <SievePrimesLab lessonId={sievePrimesLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
