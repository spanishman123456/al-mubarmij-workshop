import { useMemo, useState } from "react";
import { generateGameCode, getGameById } from "./games.js";
import GameSelector from "./components/GameSelector.jsx";
import GameDetails from "./components/GameDetails.jsx";
import HardwarePreview from "./components/HardwarePreview.jsx";
import CodePanel from "./components/CodePanel.jsx";
import MakeCodeModal from "./components/MakeCodeModal.jsx";
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
  const [selectedId, setSelectedId] = useState(/** @type {GameId} */ ("guess-number"));
  const [makeCodeOpen, setMakeCodeOpen] = useState(false);

  const game = useMemo(() => getGameById(selectedId), [selectedId]);
  const code = useMemo(() => generateGameCode(selectedId), [selectedId]);
  const lcdLines = LCD_PREVIEWS[selectedId] || ["Game Lab", "micro:bit"];

  return (
    <section className="mgl-root" aria-labelledby="mgl-heading">
      <header className="mgl-header">
        <div className="mgl-header__text">
          <h2 id="mgl-heading" className="mgl-header__title">
            🎮 Micro:bit Unified Game Lab
          </h2>
          <p className="mgl-header__desc">
            مختبر ألعاب موحّد على لوحة عتاد واحدة — غيّر المنطق البرمجي فقط بين 9 ألعاب تعليمية،
            وصدّر كود MakeCode Python وملف HEX.
          </p>
        </div>
        <div className="mgl-header__badges">
          <span className="mgl-badge">9 games</span>
          <span className="mgl-badge">unified board</span>
          <span className="mgl-badge">HEX export</span>
          <span className="mgl-badge">MakeCode Python</span>
        </div>
      </header>

      <div className="mgl-body">
        <div className="mgl-section">
          <h3 className="mgl-section__title">اختر اللعبة</h3>
          <GameSelector selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="mgl-grid">
          <div className="mgl-section">
            <h3 className="mgl-section__title">تفاصيل اللعبة</h3>
            <GameDetails game={game} />
          </div>

          <div className="mgl-section">
            <h3 className="mgl-section__title">Hardware Preview</h3>
            <HardwarePreview lcdLines={lcdLines} ledGreen={selectedId === "score-counter"} />
          </div>
        </div>

        <div className="mgl-section">
          <h3 className="mgl-section__title">Code Panel — MakeCode Python</h3>
          <CodePanel code={code} onOpenMakeCode={() => setMakeCodeOpen(true)} />
        </div>

        {game.hexPath ? (
          <p className="mgl-hex-link">
            ملف HEX مرجعي مسبق التجميع:{" "}
            <a href={game.hexPath} download className="mgl-hex-link__a">
              تحميل HEX
            </a>
          </p>
        ) : null}
      </div>

      <MakeCodeModal open={makeCodeOpen} code={code} onClose={() => setMakeCodeOpen(false)} />
    </section>
  );
}
