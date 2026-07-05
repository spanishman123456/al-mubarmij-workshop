import { StandardLessonPage } from "./StandardLessonPage";
import { constantsLesson } from "../../content/lessons/day03/constantsLesson";
import { multiDimArraysLesson } from "../../content/lessons/day03/multiDimArraysLesson";
import { breakContinuePassLesson } from "../../content/lessons/day03/breakContinuePassLesson";
import { divisorsActivityLesson } from "../../content/lessons/day03/divisorsActivityLesson";
import { numbersStepsActivityLesson } from "../../content/lessons/day03/numbersStepsActivityLesson";
import { collatzLesson } from "../../content/lessons/day03/collatzLesson";
import { truthTablesLesson } from "../../content/lessons/day03/truthTablesLesson";
import { logicGatesLesson } from "../../content/lessons/day03/logicGatesLesson";
import { IfStatementLab } from "../../components/lesson/IfStatementLab";
import { MultiDimGridLab } from "../../components/lesson/MultiDimGridLab";
import { LoopControlLab } from "../../components/lesson/LoopControlLab";
import { DivisorsLab } from "../../components/lesson/DivisorsLab";
import { NumbersStepsLab } from "../../components/lesson/NumbersStepsLab";
import { CollatzSimulator } from "../../components/lesson/CollatzSimulator";
import { TruthTableBuilder } from "../../components/sims/TruthTableBuilder";
import { LogicGatesSim } from "../../components/sims/LogicSims";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-03";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function ConstantsLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={constantsLesson} backTo={BACK} nextLink={{ to: "/lessons/python-multi-arrays", label: "التالي →" }}>
      <Lab><IfStatementLab lessonId={constantsLesson.id} userId={user?.id} initialCode={constantsLesson.interactiveExample.defaultValue} /></Lab>
    </StandardLessonPage>
  );
}

export function MultiDimArraysLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={multiDimArraysLesson} backTo={BACK} nextLink={{ to: "/lessons/python-break-continue", label: "التالي →" }}>
      <Lab><MultiDimGridLab lessonId={multiDimArraysLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function BreakContinuePassLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={breakContinuePassLesson} backTo={BACK} nextLink={{ to: "/lessons/divisors-activity", label: "التالي →" }}>
      <Lab><LoopControlLab lessonId={breakContinuePassLesson.id} userId={user?.id} preset="continue" /></Lab>
    </StandardLessonPage>
  );
}

export function DivisorsActivityLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={divisorsActivityLesson} backTo={BACK} nextLink={{ to: "/lessons/numbers-steps-activity", label: "التالي: الأرقام والخطوات →" }}>
      <Lab><DivisorsLab lessonId={divisorsActivityLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function NumbersStepsActivityLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={numbersStepsActivityLesson} backTo={BACK} nextLink={{ to: "/lessons/collatz", label: "التالي: Collatz →" }}>
      <Lab><NumbersStepsLab lessonId={numbersStepsActivityLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function CollatzLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={collatzLesson} backTo={BACK} nextLink={{ to: "/lessons/truth-tables", label: "التالي: جداول الحقيقة →" }}>
      <Lab><CollatzSimulator lessonId={collatzLesson.id} userId={user?.id} /></Lab>
    </StandardLessonPage>
  );
}

export function TruthTablesLessonPage() {
  return (
    <StandardLessonPage lesson={truthTablesLesson} backTo={BACK} nextLink={{ to: "/lessons/logic-gates", label: "التالي: البوابات →" }}>
      <Lab><TruthTableBuilder /></Lab>
    </StandardLessonPage>
  );
}

export function LogicGatesLessonPage() {
  return (
    <StandardLessonPage lesson={logicGatesLesson} backTo={BACK}>
      <Lab><LogicGatesSim /></Lab>
    </StandardLessonPage>
  );
}
