import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavBar } from "./components/NavBar";
import Home from "./pages/Home";
import PythonLab from "./pages/PythonLab";
import CurriculumPage from "./pages/CurriculumPage";
import UnitPage from "./pages/UnitPage";
import LessonPage from "./pages/LessonPage";
import WorksheetsPage from "./pages/WorksheetsPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizTakePage from "./pages/QuizTakePage";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen font-ar">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/python" element={<PythonLab />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/curriculum/unit/:unitId" element={<UnitPage />} />
            <Route path="/curriculum/unit/:unitId/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/worksheets" element={<WorksheetsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quizzes/run/:quizId" element={<QuizTakePage />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
