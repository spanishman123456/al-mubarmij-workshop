import { StandardLessonPage } from "./StandardLessonPage";
import { pythonScopeLesson } from "../../content/lessons/day07/pythonScopeLesson";
import { diceRandomLesson } from "../../content/lessons/day07/diceRandomLesson";
import { ticTacToeLesson } from "../../content/lessons/day07/ticTacToeLesson";
import { gamePlanningLesson } from "../../content/lessons/day07/gamePlanningLesson";
import { ScopeLab } from "../../components/lesson/ScopeLab";
import { DiceRandomLab } from "../../components/lesson/DiceRandomLab";
import { TicTacToeLab } from "../../components/lesson/TicTacToeLab";
import { GamePlanningLab } from "../../components/lesson/GamePlanningLab";
import { usePlatform } from "../../context/PlatformContext";

const BACK = "/path/day/day-07";

function Lab({ children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold">نشاط تفاعلي</h2>
      {children}
    </section>
  );
}

export function PythonScopeLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={pythonScopeLesson}
      subtitle="pdfPageIndex 339–355"
      backTo={BACK}
      nextLink={{ to: "/lessons/dice-random", label: "التالي: رمي النرد والعشوائية →" }}
    >
      <Lab>
        <ScopeLab lessonId={pythonScopeLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function DiceRandomLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={diceRandomLesson}
      subtitle="pdfPageIndex 370"
      backTo={BACK}
      nextLink={{ to: "/lessons/tic-tac-toe", label: "التالي: تيك-تاك-تو →" }}
    >
      <Lab>
        <DiceRandomLab lessonId={diceRandomLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function TicTacToeLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage
      lesson={ticTacToeLesson}
      subtitle="pdfPageIndex 356–360"
      backTo={BACK}
      nextLink={{ to: "/lessons/game-planning", label: "التالي: تخطيط اللعبة →" }}
    >
      <Lab>
        <TicTacToeLab lessonId={ticTacToeLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}

export function GamePlanningLessonPage() {
  const { user } = usePlatform();
  return (
    <StandardLessonPage lesson={gamePlanningLesson} subtitle="pdfPageIndex 361–362" backTo={BACK}>
      <Lab>
        <GamePlanningLab lessonId={gamePlanningLesson.id} userId={user?.id} />
      </Lab>
    </StandardLessonPage>
  );
}
