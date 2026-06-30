import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.jsx";
import { generateGameCode } from "./engine/codeGenerator.js";
import { getGameById } from "./engine/games.js";
import { getLegacyProjectId } from "./learning/curriculumBridge.js";
import GameSelector from "./engine/GameSelector.jsx";
import GameDetails from "./learning/GameDetails.jsx";
import GameCurriculumPanel from "./learning/GameCurriculumPanel.jsx";
import GameQuiz from "./learning/GameQuiz.jsx";
import HardwarePreview from "./hardware/HardwarePreview.jsx";
import CodePanel from "./makecode/CodePanel.jsx";
import MakeCodeModal from "./makecode/MakeCodeModal.jsx";
import "./microbit-game-lab.css";

/** @typedef {import('./types.js').GameId} GameId */

const LCD_PREVIEWS = {
  "guess-number": ["Guess: 5", "OK=check"],
  "binary-system": ["Dec: 7", "Bin: 111"],
  cipher: ["Char: A", "Enc: D"],
  "search-sort": ["i=2", "v=9"],
  "score-counter": ["Score", "3"],
  "logic-gates": ["AND A=1", "B=0 Y=0"],
  "truth-table": ["A=1 B=1", "AND=1"],
  fibonacci: ["Fib", "8"],
  hanoi: ["C0:3", "C1:0 C2:0"],
};

export default function MicrobitGameLab() {
  const { user, myProgress, saveMicrobitProgress } = usePlatform();
  const [selectedId, setSelectedId] = useState(/** @type {GameId} */ ("guess-number"));
  const [makeCodeOpen, setMakeCodeOpen] = useState(false);

  const game = useMemo(() => getGameById(selectedId), [selectedId]);
  const code = useMemo(() => {
    try {
      return generateGameCode(selectedId);
    } catch (err) {
      console.error("[MGL]", err);
      return `# Code generation error\n# ${err.message}\n`;
    }
  }, [selectedId]);
  const lcdLines = LCD_PREVIEWS[selectedId] || ["Game Lab", "micro:bit"];

  const legacyId = getLegacyProjectId(selectedId);
  const microbitData = myProgress?.microbitProjects || {};
  const progress = microbitData[legacyId];
  const completedCount = Object.values(microbitData).filter((p) => p?.status === "completed").length;

  useEffect(() => {
    if (window.location.hash === "#microbit-game-lab") {
      document.getElementById("microbit-game-lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  function handleSave(patch) {
    saveMicrobitProgress(legacyId, patch);
  }

  return (
    <section id="microbit-game-lab" className="mgl-root" aria-labelledby="mgl-heading">
      <header className="mgl-header">
        <div className="mgl-header__text">
          <h2 id="mgl-heading" className="mgl-header__title">
            🎮 Micro:bit Unified Game Lab
          </h2>
          <p className="mgl-header__desc">
            النظام الموحّد الوحيد لمشاريع micro:bit — MakeCode Python + تصدير HEX عبر MakeCode
            الرسمي فقط. ثلاث طبقات: تعليم، محرك ألعاب، وعتاد موحّد.
          </p>
          {user?.role === "student" ? (
            <p className="mgl-header__progress">تقدمك: {completedCount} / 9 مشروع مكتمل</p>
          ) : null}
        </div>
        <div className="mgl-header__badges">
          <span className="mgl-badge">Learning</span>
          <span className="mgl-badge">Game Engine</span>
          <span className="mgl-badge">Hardware HAL</span>
          <span className="mgl-badge">MakeCode-only HEX</span>
        </div>
      </header>

      <div className="mgl-body">
        <div className="mgl-intro">
          <p className="mgl-intro__text">
            اختر لعبة → يُولَّد MakeCode Python تلقائيًا → Open MakeCode → Import → Compile → Download
            HEX. لا MicroPython. لا ملفات HEX مسبقة.
          </p>
          <div className="mgl-intro__links">
            <Link to="/path" className="mgl-curriculum__link">
              المسار الدراسي
            </Link>
            <Link to="/simulations" className="mgl-curriculum__link">
              معمل المحاكاة
            </Link>
          </div>
        </div>

        <div className="mgl-section">
          <h3 className="mgl-section__title">Game Engine — اختر اللعبة</h3>
          <GameSelector selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="mgl-grid">
          <div className="mgl-section">
            <h3 className="mgl-section__title">Learning Layer — التعليم والتقييم</h3>
            <GameDetails game={game} />
            <GameCurriculumPanel gameId={selectedId} />
            {user?.role === "student" ? (
              <GameQuiz gameId={selectedId} progress={progress} onSave={handleSave} />
            ) : null}
          </div>

          <div className="mgl-section">
            <h3 className="mgl-section__title">Hardware Layer — معاينة العتاد</h3>
            <HardwarePreview lcdLines={lcdLines} ledGreen={selectedId === "score-counter"} />
          </div>
        </div>

        <div className="mgl-section">
          <h3 className="mgl-section__title">MakeCode — توليد الكود وتصدير HEX</h3>
          <CodePanel code={code} onOpenMakeCode={() => setMakeCodeOpen(true)} />
          <p className="mgl-hex-note">
            ملف HEX يُنشأ حصريًا عبر MakeCode الرسمي (Import → Compile → Download). لا يوجد HEX
            مسبق التجميع في المنصة.
          </p>
        </div>
      </div>

      <MakeCodeModal open={makeCodeOpen} code={code} onClose={() => setMakeCodeOpen(false)} />
    </section>
  );
}
