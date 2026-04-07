import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import Home from "./pages/Home";
import PythonLab from "./pages/PythonLab";
import CurriculumPage from "./pages/CurriculumPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-ar min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python" element={<PythonLab />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
