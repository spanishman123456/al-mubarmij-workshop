import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LearningPathPage from "./pages/LearningPathPage";
import DayLessonPage from "./pages/DayLessonPage";
import SimulationsPage from "./pages/SimulationsPage";
import ProjectsPage from "./pages/ProjectsPage";
import WorksheetDetailPage from "./pages/WorksheetDetailPage";
import MicrobitPage from "./pages/MicrobitPage";
import { ActivityTracker, StudentInactivityManager } from "./hooks/useActivityTracker";

function NotFoundRedirect() {
  const { user, authReady } = usePlatform();
  if (!authReady) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
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
              <MicrobitPage />
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
