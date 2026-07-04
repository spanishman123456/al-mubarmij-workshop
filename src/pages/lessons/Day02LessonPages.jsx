import { StandardLessonPage } from "./StandardLessonPage";
import { algorithmsLesson } from "../../content/lessons/day02/algorithmsLesson";
import { ifStatementLesson } from "../../content/lessons/day02/ifStatementLesson";
import { conversionsIntroLesson } from "../../content/lessons/day02/conversionsIntroLesson";
import { radixPracticeLesson } from "../../content/lessons/day02/radixPracticeLesson";
import { sentenceReferenceLesson } from "../../content/lessons/day02/sentenceReferenceLesson";
import { day02ComputerLabLesson } from "../../content/lessons/day02/day02ComputerLabLesson";
import { baseArithmeticLesson } from "../../content/lessons/day02/baseArithmeticLesson";
import { twosComplementLesson } from "../../content/lessons/day02/twosComplementLesson";
import { floatingPointLesson } from "../../content/lessons/day02/floatingPointLesson";
import { pythonArraysLesson } from "../../content/lessons/day02/pythonArraysLesson";
import { pythonForRangeLesson } from "../../content/lessons/day02/pythonForRangeLesson";
import { pythonWhileLesson } from "../../content/lessons/day02/pythonWhileLesson";
import { cardSortAlgorithmLesson } from "../../content/lessons/day02/cardSortAlgorithmLesson";
import { AlgorithmStepsLab } from "../../components/lesson/AlgorithmStepsLab";
import { IfStatementLab } from "../../components/lesson/IfStatementLab";
import { BaseArithmeticLab } from "../../components/lesson/BaseArithmeticLab";
import { TwosComplementLab } from "../../components/lesson/TwosComplementLab";
import { PythonListLab } from "../../components/lesson/PythonListLab";
import { ForRangeLab, WhileLoopLab } from "../../components/lesson/LoopLabs";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-02";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function ConversionsIntroLessonPage() {
  return <StandardLessonPage lesson={conversionsIntroLesson} backTo={BACK} nextLink={{ to: "/lessons/base-arithmetic", label: "التالي: الحساب →" }} />;
}

export function BaseArithmeticLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={baseArithmeticLesson} backTo={BACK} nextLink={{ to: "/lessons/twos-complement", label: "التالي: مكمل 2 →" }}>
      <Lab><BaseArithmeticLab lessonId={baseArithmeticLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function TwosComplementLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={twosComplementLesson} backTo={BACK} nextLink={{ to: "/lessons/floating-point", label: "التالي: float →" }}>
      <Lab><TwosComplementLab lessonId={twosComplementLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function FloatingPointLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={floatingPointLesson} backTo={BACK} nextLink={{ to: "/lessons/radix-practice", label: "التالي →" }}>
      <Lab><IfStatementLab lessonId={floatingPointLesson.id} userId={user?.id} initialCode="print(0.1+0.2)" /></Lab>
    </StandardLessonPage>
  );
}

export function RadixPracticeLessonPage() {
  return <StandardLessonPage lesson={radixPracticeLesson} backTo={BACK} nextLink={{ to: "/lessons/algorithms", label: "التالي: الخوارزميات →" }} />;
}

export function CardSortAlgorithmLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={cardSortAlgorithmLesson} backTo={BACK} nextLink={{ to: "/lessons/algorithms", label: "التالي →" }}>
      <Lab><AlgorithmStepsLab lessonId={cardSortAlgorithmLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function AlgorithmsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={algorithmsLesson} backTo={BACK} nextLink={{ to: "/lessons/python-arrays", label: "التالي: القوائم →" }}>
      <Lab><AlgorithmStepsLab lessonId={algorithmsLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function PythonArraysLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={pythonArraysLesson} backTo={BACK} nextLink={{ to: "/lessons/python-for-range", label: "التالي: for →" }}>
      <Lab><PythonListLab lessonId={pythonArraysLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function PythonForRangeLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={pythonForRangeLesson} backTo={BACK} nextLink={{ to: "/lessons/python-while", label: "التالي: while →" }}>
      <Lab><ForRangeLab lessonId={pythonForRangeLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function PythonWhileLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={pythonWhileLesson} backTo={BACK} nextLink={{ to: "/lessons/sentence-reference", label: "التالي: المرجع →" }}>
      <Lab><WhileLoopLab lessonId={pythonWhileLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function SentenceReferenceLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={sentenceReferenceLesson} backTo={BACK} nextLink={{ to: "/lessons/if-statement", label: "التالي: if →" }}>
      <Lab><IfStatementLab lessonId={sentenceReferenceLesson.id} userId={user?.id} initialCode={sentenceReferenceLesson.interactiveExample.defaultValue} /></Lab>
    </StandardLessonPage>
  );
}

export function IfStatementLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={ifStatementLesson} backTo={BACK} nextLink={{ to: "/lessons/day02-computer-lab", label: "التالي: مختبر →" }}>
      <Lab><IfStatementLab lessonId={ifStatementLesson.id} userId={user?.id} initialCode={ifStatementLesson.interactiveExample.defaultValue} /></Lab>
    </StandardLessonPage>
  );
}

export function Day02ComputerLabLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={day02ComputerLabLesson} backTo={BACK}>
      <Lab><IfStatementLab lessonId={day02ComputerLabLesson.id} userId={user?.id} initialCode="d1,d2=4,6\nif d1>d2: print('1')\nelif d1<d2: print('2')\nelse: print('tie')" /></Lab>
    </StandardLessonPage>
  );
}
