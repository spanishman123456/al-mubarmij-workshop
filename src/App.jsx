import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavBar } from "./components/NavBar";
import { PlatformProvider, usePlatform } from "./context/PlatformContext";
import { ProtectedRoute, GuestRoute, AuthLoading } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import PythonLab from "./pages/PythonLab";
import CurriculumPage from "./pages/CurriculumPage";
import UnitPage from "./pages/UnitPage";
import LessonPage from "./pages/LessonPage";
import WorksheetsPage from "./pages/WorksheetsPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizTakePage from "./pages/QuizTakePage";
import QuizReviewPage from "./pages/QuizReviewPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LearningPathPage from "./pages/LearningPathPage";
import DayLessonPage from "./pages/DayLessonPage";
import SimulationsPage from "./pages/SimulationsPage";
import ProjectsPage from "./pages/ProjectsPage";
import WorksheetDetailPage from "./pages/WorksheetDetailPage";
import { ActivityTracker, StudentInactivityManager } from "./hooks/useActivityTracker";
import { OnboardingGate, OnboardingHub } from "./pages/onboarding/OnboardingPages.jsx";
import BingoPage from "./pages/onboarding/BingoPage.jsx";
import AgreementPage from "./pages/onboarding/AgreementPage.jsx";
import NumberSystemsLessonPage from "./pages/lessons/NumberSystemsLessonPage.jsx";
import BinaryCardsLessonPage from "./pages/lessons/BinaryCardsLessonPage.jsx";
import PythonIntroLessonPage from "./pages/lessons/PythonIntroLessonPage.jsx";
import AsciiUnicodeLessonPage from "./pages/lessons/AsciiUnicodeLessonPage.jsx";
import HexColorsLessonPage from "./pages/lessons/HexColorsLessonPage.jsx";
import HexPuzzleLessonPage from "./pages/lessons/HexPuzzleLessonPage.jsx";
import BinaryPuzzleLessonPage from "./pages/lessons/BinaryPuzzleLessonPage.jsx";
import BinaryMatchingLessonPage from "./pages/lessons/BinaryMatchingLessonPage.jsx";
import StringSplittingLessonPage from "./pages/lessons/StringSplittingLessonPage.jsx";
import {
  AlgorithmsLessonPage,
  IfStatementLessonPage,
  ConversionsIntroLessonPage,
  RadixPracticeLessonPage,
  SentenceReferenceLessonPage,
  Day02ComputerLabLessonPage,
  BaseArithmeticLessonPage,
  TwosComplementLessonPage,
  FloatingPointLessonPage,
  CardSortAlgorithmLessonPage,
  PythonArraysLessonPage,
  PythonForRangeLessonPage,
  PythonWhileLessonPage,
} from "./pages/lessons/Day02LessonPages.jsx";
import {
  ConstantsLessonPage,
  MultiDimArraysLessonPage,
  BreakContinuePassLessonPage,
  DivisorsActivityLessonPage,
  NumbersStepsActivityLessonPage,
  CollatzLessonPage,
  TruthTablesLessonPage,
  LogicGatesLessonPage,
} from "./pages/lessons/Day03LessonPages.jsx";
import {
  KarnaughMapsLessonPage,
  LogicEquivalenceLessonPage,
  PythonTuplesLessonPage,
  NestedLoopsLabLessonPage,
} from "./pages/lessons/Day04LessonPages.jsx";
import {
  LinearSearchLessonPage,
  BinarySearchLessonPage,
  SortingAlgorithmsLessonPage,
  SievePrimesLessonPage,
} from "./pages/lessons/Day05LessonPages.jsx";
import {
  CaesarCipherLessonPage,
  MemoryHierarchyLessonPage,
  CpuSchedulingLessonPage,
} from "./pages/lessons/Day06LessonPages.jsx";
import {
  PythonScopeLessonPage,
  DiceRandomLessonPage,
  TicTacToeLessonPage,
  GamePlanningLessonPage,
} from "./pages/lessons/Day07LessonPages.jsx";
import {
  FibonacciSequenceLessonPage,
  AlgorithmComplexityLessonPage,
  TowerOfHanoiLessonPage,
  PythonFilesIoLessonPage,
} from "./pages/lessons/Day08LessonPages.jsx";
import {
  PythonRecursionLessonPage,
  FractalsIntroLessonPage,
  KochSnowflakeLessonPage,
  SierpinskiTriangleLessonPage,
} from "./pages/lessons/Day09LessonPages.jsx";
import {
  OopFoundationsLessonPage,
  SteganographyLessonPage,
  FractalTreeLessonPage,
  LockerPascalLessonPage,
} from "./pages/lessons/Day10LessonPages.jsx";
import {
  AiFoundationsLessonPage,
  MachineLearningBasicsLessonPage,
  AiEthicsSafetyLessonPage,
  AiResearchPresentationLessonPage,
} from "./pages/lessons/Day11LessonPages.jsx";
import {
  RegexAutomataLessonPage,
  DfaNfaLessonPage,
  ComplexityPnpLessonPage,
  GraphTheoryLessonPage,
} from "./pages/lessons/Day12LessonPages.jsx";
import {
  ComprehensiveReviewLessonPage,
  PostAssessmentLessonPage,
  ProjectIdeationLessonPage,
  ProjectPlanningLessonPage,
} from "./pages/lessons/Day13LessonPages.jsx";
import {
  ProjectArchitectureLessonPage,
  ProjectImplementationLessonPage,
  ProjectTestingLessonPage,
  ProjectPresentationLessonPage,
} from "./pages/lessons/Day14LessonPages.jsx";
import {
  FinalPresentationLessonPage,
  PeerFeedbackLessonPage,
  FinalEvaluationLessonPage,
  ProgramClosureLessonPage,
} from "./pages/lessons/Day15LessonPages.jsx";
import TeacherDay01AnswersPage from "./pages/teacher/TeacherDay01AnswersPage.jsx";
import TeacherDay02AnswersPage from "./pages/teacher/TeacherDay02AnswersPage.jsx";
import TeacherDay03AnswersPage from "./pages/teacher/TeacherDay03AnswersPage.jsx";
import TeacherDay04AnswersPage from "./pages/teacher/TeacherDay04AnswersPage.jsx";
import TeacherDay05AnswersPage from "./pages/teacher/TeacherDay05AnswersPage.jsx";
import TeacherDay06AnswersPage from "./pages/teacher/TeacherDay06AnswersPage.jsx";
import TeacherDay07AnswersPage from "./pages/teacher/TeacherDay07AnswersPage.jsx";
import TeacherDay08AnswersPage from "./pages/teacher/TeacherDay08AnswersPage.jsx";
import TeacherDay09AnswersPage from "./pages/teacher/TeacherDay09AnswersPage.jsx";
import TeacherDay10AnswersPage from "./pages/teacher/TeacherDay10AnswersPage.jsx";
import TeacherDay11AnswersPage from "./pages/teacher/TeacherDay11AnswersPage.jsx";
import TeacherDay12AnswersPage from "./pages/teacher/TeacherDay12AnswersPage.jsx";
import TeacherDay13AnswersPage from "./pages/teacher/TeacherDay13AnswersPage.jsx";
import TeacherDay14AnswersPage from "./pages/teacher/TeacherDay14AnswersPage.jsx";
import TeacherDay15AnswersPage from "./pages/teacher/TeacherDay15AnswersPage.jsx";
import TeacherQuizReviewPage from "./pages/teacher/TeacherQuizReviewPage.jsx";
import { PublishedContentGate } from "./components/auth/PublishedContentGate.jsx";

function NotFoundRedirect() {
  const { user, authReady } = usePlatform();
  if (!authReady) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
}

function QuizTakeRedirect() {
  const { quizId } = useParams();
  return <Navigate to={`/quizzes/run/${quizId}`} replace />;
}

function AppRoutes() {
  const { user, authReady } = usePlatform();
  const location = useLocation();

  return (
    <div className="min-h-screen font-ar">
      {authReady && user ? (
        <>
          <ActivityTracker />
          <StudentInactivityManager />
          <NavBar />
        </>
      ) : null}

      <div key={location.pathname} className="page-enter">
      <OnboardingGate>
      <PublishedContentGate>
      <Routes location={location}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute roles={["student"]}>
              <OnboardingHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/bingo"
          element={
            <ProtectedRoute roles={["student"]}>
              <BingoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/:slug"
          element={
            <ProtectedRoute roles={["student"]}>
              <AgreementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/binary-cards"
          element={
            <ProtectedRoute>
              <BinaryCardsLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/number-systems"
          element={
            <ProtectedRoute>
              <NumberSystemsLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/binary-puzzle"
          element={
            <ProtectedRoute>
              <BinaryPuzzleLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/binary-matching"
          element={
            <ProtectedRoute>
              <BinaryMatchingLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/string-splitting"
          element={
            <ProtectedRoute>
              <StringSplittingLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/hex-puzzle"
          element={
            <ProtectedRoute>
              <HexPuzzleLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/hex-colors"
          element={
            <ProtectedRoute>
              <HexColorsLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/ascii-unicode"
          element={
            <ProtectedRoute>
              <AsciiUnicodeLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/python-intro"
          element={
            <ProtectedRoute>
              <PythonIntroLessonPage />
            </ProtectedRoute>
          }
        />

        <Route path="/lessons/conversions-intro" element={<ProtectedRoute><ConversionsIntroLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/base-arithmetic" element={<ProtectedRoute><BaseArithmeticLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/twos-complement" element={<ProtectedRoute><TwosComplementLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/floating-point" element={<ProtectedRoute><FloatingPointLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/radix-practice" element={<ProtectedRoute><RadixPracticeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/card-sort-algorithm" element={<ProtectedRoute><CardSortAlgorithmLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/algorithms" element={<ProtectedRoute><AlgorithmsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-arrays" element={<ProtectedRoute><PythonArraysLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-for-range" element={<ProtectedRoute><PythonForRangeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-while" element={<ProtectedRoute><PythonWhileLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/sentence-reference" element={<ProtectedRoute><SentenceReferenceLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/if-statement" element={<ProtectedRoute><IfStatementLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/day02-computer-lab" element={<ProtectedRoute><Day02ComputerLabLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/python-constants" element={<ProtectedRoute><ConstantsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-multi-arrays" element={<ProtectedRoute><MultiDimArraysLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-break-continue" element={<ProtectedRoute><BreakContinuePassLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/divisors-activity" element={<ProtectedRoute><DivisorsActivityLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/numbers-steps-activity" element={<ProtectedRoute><NumbersStepsActivityLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/collatz" element={<ProtectedRoute><CollatzLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/truth-tables" element={<ProtectedRoute><TruthTablesLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/logic-gates" element={<ProtectedRoute><LogicGatesLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/karnaugh-maps" element={<ProtectedRoute><KarnaughMapsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/logic-equivalence" element={<ProtectedRoute><LogicEquivalenceLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-tuples" element={<ProtectedRoute><PythonTuplesLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/nested-loops-lab" element={<ProtectedRoute><NestedLoopsLabLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/linear-search" element={<ProtectedRoute><LinearSearchLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/binary-search" element={<ProtectedRoute><BinarySearchLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/sorting-algorithms" element={<ProtectedRoute><SortingAlgorithmsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/sieve-primes" element={<ProtectedRoute><SievePrimesLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/caesar-cipher" element={<ProtectedRoute><CaesarCipherLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/memory-hierarchy" element={<ProtectedRoute><MemoryHierarchyLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/cpu-scheduling" element={<ProtectedRoute><CpuSchedulingLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/python-scope" element={<ProtectedRoute><PythonScopeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/dice-random" element={<ProtectedRoute><DiceRandomLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/tic-tac-toe" element={<ProtectedRoute><TicTacToeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/game-planning" element={<ProtectedRoute><GamePlanningLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/fibonacci-sequence" element={<ProtectedRoute><FibonacciSequenceLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/algorithm-complexity" element={<ProtectedRoute><AlgorithmComplexityLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/tower-of-hanoi" element={<ProtectedRoute><TowerOfHanoiLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/python-files-io" element={<ProtectedRoute><PythonFilesIoLessonPage /></ProtectedRoute>} />

        <Route path="/lessons/python-recursion" element={<ProtectedRoute><PythonRecursionLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/fractals-intro" element={<ProtectedRoute><FractalsIntroLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/koch-snowflake" element={<ProtectedRoute><KochSnowflakeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/sierpinski-triangle" element={<ProtectedRoute><SierpinskiTriangleLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/oop-foundations" element={<ProtectedRoute><OopFoundationsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/steganography-python" element={<ProtectedRoute><SteganographyLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/fractal-tree-recursion" element={<ProtectedRoute><FractalTreeLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/locker-pascal-problem" element={<ProtectedRoute><LockerPascalLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/ai-foundations" element={<ProtectedRoute><AiFoundationsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/machine-learning-basics" element={<ProtectedRoute><MachineLearningBasicsLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/ai-ethics-safety" element={<ProtectedRoute><AiEthicsSafetyLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/ai-research-presentation" element={<ProtectedRoute><AiResearchPresentationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/regex-automata" element={<ProtectedRoute><RegexAutomataLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/dfa-nfa-design" element={<ProtectedRoute><DfaNfaLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/p-vs-np-intro" element={<ProtectedRoute><ComplexityPnpLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/graph-theory-basics" element={<ProtectedRoute><GraphTheoryLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/comprehensive-review" element={<ProtectedRoute><ComprehensiveReviewLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/post-assessment-readiness" element={<ProtectedRoute><PostAssessmentLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-ideation" element={<ProtectedRoute><ProjectIdeationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-planning" element={<ProtectedRoute><ProjectPlanningLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-architecture" element={<ProtectedRoute><ProjectArchitectureLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-implementation-sprint" element={<ProtectedRoute><ProjectImplementationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-testing-debugging" element={<ProtectedRoute><ProjectTestingLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/project-presentation-rehearsal" element={<ProtectedRoute><ProjectPresentationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/final-project-presentation" element={<ProtectedRoute><FinalPresentationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/peer-feedback-and-refinement" element={<ProtectedRoute><PeerFeedbackLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/final-evaluation" element={<ProtectedRoute><FinalEvaluationLessonPage /></ProtectedRoute>} />
        <Route path="/lessons/program-closure-next-steps" element={<ProtectedRoute><ProgramClosureLessonPage /></ProtectedRoute>} />

        <Route path="/teacher/day-01-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay01AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-02-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay02AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-03-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay03AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-04-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay04AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-05-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay05AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-06-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay06AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-07-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay07AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-08-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay08AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-09-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay09AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-10-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay10AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-11-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay11AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-12-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay12AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-13-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay13AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-14-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay14AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-15-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay15AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/quiz-review" element={<ProtectedRoute roles={["teacher"]}><TeacherQuizReviewPage /></ProtectedRoute>} />

        <Route
          path="/path"
          element={
            <ProtectedRoute>
              <LearningPathPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/path/day/:dayId"
          element={
            <ProtectedRoute>
              <DayLessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/python"
          element={
            <ProtectedRoute>
              <PythonLab />
            </ProtectedRoute>
          }
        />

        <Route
          path="/curriculum"
          element={
            <ProtectedRoute>
              <CurriculumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/curriculum/unit/:unitId"
          element={
            <ProtectedRoute>
              <UnitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/curriculum/unit/:unitId/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worksheets"
          element={
            <ProtectedRoute>
              <WorksheetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worksheets/:worksheetId"
          element={
            <ProtectedRoute>
              <WorksheetDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizzesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/run/:quizId"
          element={
            <ProtectedRoute>
              <QuizTakePage />
            </ProtectedRoute>
          }
        />
        <Route path="/quizzes/take/:quizId" element={<QuizTakeRedirect />} />
        <Route
          path="/quizzes/review/:attemptId"
          element={
            <ProtectedRoute>
              <QuizReviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulations"
          element={
            <ProtectedRoute>
              <SimulationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microbit"
          element={
            <ProtectedRoute>
              <Navigate to="/projects#microbit-game-lab" replace />
            </ProtectedRoute>
          }
        />

        {/* مسارات قديمة/بديلة */}
        <Route path="/simulation" element={<Navigate to="/simulations" replace />} />
        <Route path="/tests" element={<Navigate to="/quizzes" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <Navigate to="/student" replace />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
      </PublishedContentGate>
      </OnboardingGate>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </PlatformProvider>
  );
}
