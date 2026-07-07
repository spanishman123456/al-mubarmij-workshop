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
import TeacherDay01AnswersPage from "./pages/teacher/TeacherDay01AnswersPage.jsx";
import TeacherDay02AnswersPage from "./pages/teacher/TeacherDay02AnswersPage.jsx";
import TeacherDay03AnswersPage from "./pages/teacher/TeacherDay03AnswersPage.jsx";
import TeacherDay04AnswersPage from "./pages/teacher/TeacherDay04AnswersPage.jsx";
import TeacherDay05AnswersPage from "./pages/teacher/TeacherDay05AnswersPage.jsx";
import TeacherDay06AnswersPage from "./pages/teacher/TeacherDay06AnswersPage.jsx";
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

        <Route path="/teacher/day-01-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay01AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-02-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay02AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-03-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay03AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-04-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay04AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-05-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay05AnswersPage /></ProtectedRoute>} />
        <Route path="/teacher/day-06-answers" element={<ProtectedRoute roles={["teacher"]}><TeacherDay06AnswersPage /></ProtectedRoute>} />
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
