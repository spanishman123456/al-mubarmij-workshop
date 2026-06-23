import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavBar } from "./components/NavBar";
import { PlatformProvider } from "./context/PlatformContext";
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

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="min-h-screen font-ar">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/path" element={<LearningPathPage />} />
              <Route path="/path/day/:dayId" element={<DayLessonPage />} />
              <Route path="/python" element={<PythonLab />} />
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/curriculum/unit/:unitId" element={<UnitPage />} />
              <Route path="/curriculum/unit/:unitId/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/worksheets" element={<WorksheetsPage />} />
              <Route path="/worksheets/:worksheetId" element={<WorksheetDetailPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quizzes/run/:quizId" element={<QuizTakePage />} />
              <Route path="/simulations" element={<SimulationsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/microbit" element={<MicrobitPage />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </PlatformProvider>
  );
}
