import { createCardEngine } from "../../lib/binaryCards/placeValueCardsLogic.js";

function CardButton({ value, visible, onToggle, disabled, baseLabel }) {
  return (
    <button
      type="button"
      data-testid={`quiz-card-${value}`}
      aria-pressed={visible}
      aria-label={`بطاقة ${value}، ${visible ? "ظاهرة" : "مخفية"}`}
      disabled={disabled}
      onClick={() => onToggle(value)}
      className={`min-h-[4rem] min-w-[3.5rem] cursor-pointer rounded-xl border-2 px-2 py-3 text-center text-sm font-bold transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
        visible
          ? "border-violet-500 bg-violet-600 text-white shadow-md"
          : "border-slate-400/40 bg-slate-800/60 text-slate-400"
      }`}
    >
      <span className="block text-lg">{value}</span>
      <span className="text-[10px]">{visible ? "1" : "0"}</span>
    </button>
  );
}

function parseCards(raw, engine) {
  return engine.parseState(raw);
}

export function QuizCardFlipQuestion({ question, value, onChange, disabled }) {
  const cardValues = question.cardValues || [16, 8, 4, 2, 1];
  const engine = createCardEngine(cardValues);
  const cards = parseCards(value, engine);
  const target = question.target;
  const sum = engine.cardSum(cards);
  const base = question.baseLabel || (cardValues.includes(3) ? "₃" : "₂");

  function toggle(v) {
    if (disabled) return;
    onChange(engine.serializeState(engine.toggleCard(cards, v)));
  }

  return (
    <div className="space-y-3" dir="rtl">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : null}
      {target !== undefined ? (
        <p className="text-base font-bold text-white">
          مثّل العدد: <span dir="ltr">{target}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2" dir="ltr">
        {cardValues.map((v) => (
          <CardButton key={v} value={v} visible={Boolean(cards[v])} onToggle={toggle} disabled={disabled} />
        ))}
      </div>
      <div className="grid gap-1 rounded-lg bg-black/30 p-3 text-sm sm:grid-cols-3">
        <p>
          <span className="text-slate-400">المجموع:</span> <span dir="ltr">{sum}</span>
        </p>
        <p>
          <span className="text-slate-400">التمثيل:</span>{" "}
          <span dir="ltr" className="font-mono">
            {engine.toPlaceString(cards)}
            {base}
          </span>
        </p>
        {target !== undefined ? (
          <p>
            <span className="text-slate-400">المطلوب:</span> <span dir="ltr">{target}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function QuizCardSheetQuestion({ question, value, onChange, disabled }) {
  const targets = question.targets || [];
  const cardValues = question.cardValues || [16, 8, 4, 2, 1];
  const engine = createCardEngine(cardValues);
  let sheet = {};
  try {
    sheet = value ? JSON.parse(value) : {};
  } catch {
    sheet = {};
  }

  function updateTarget(t, state) {
    if (disabled) return;
    onChange(JSON.stringify({ ...sheet, [String(t)]: state }));
  }

  return (
    <div className="space-y-4" dir="rtl">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : null}
      {targets.map((t) => (
        <div key={t} className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="mb-2 font-bold text-violet-200">
            مثّل العدد <span dir="ltr">{t}</span>
          </p>
          <QuizCardFlipQuestion
            question={{ cardValues, target: t, instructionAr: null }}
            value={engine.serializeState(sheet[String(t)] || engine.initialCardState(false))}
            onChange={(s) => {
              try {
                updateTarget(t, JSON.parse(s));
              } catch {
                /* ignore */
              }
            }}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}

export function gradeCardFlipAnswer(question, userAnswer) {
  const engine = createCardEngine(question.cardValues || [16, 8, 4, 2, 1]);
  const cards = engine.parseState(userAnswer);
  return engine.checkTarget(cards, question.target);
}

export function gradeCardSheetAnswer(question, userAnswer) {
  const targets = question.targets || [];
  const engine = createCardEngine(question.cardValues || [16, 8, 4, 2, 1]);
  let sheet = {};
  try {
    sheet = userAnswer ? JSON.parse(userAnswer) : {};
  } catch {
    return false;
  }
  return targets.every((t) => engine.checkTarget(sheet[String(t)] || engine.initialCardState(false), t));
}
