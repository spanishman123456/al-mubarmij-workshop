import { Link } from "react-router-dom";
import { getCurriculumForGame } from "./curriculumBridge.js";

/** @typedef {import('../types.js').GameId} GameId */

/**
 * @param {{ gameId: GameId }} props
 */
export default function GameCurriculumPanel({ gameId }) {
  const curriculum = getCurriculumForGame(gameId);
  if (!curriculum) return null;

  return (
    <div className="mgl-curriculum">
      {curriculum.curriculumTopic ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">موضوع المنهج</h4>
          <p className="mgl-details__text">{curriculum.curriculumTopic}</p>
        </div>
      ) : null}

      {curriculum.idea ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">فكرة المشروع</h4>
          <p className="mgl-details__text">{curriculum.idea}</p>
        </div>
      ) : null}

      {curriculum.tools?.length ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">الأدوات والعتاد</h4>
          <ul className="mgl-curriculum__list">
            {curriculum.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {curriculum.steps?.length ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">خطوات التنفيذ</h4>
          <ol className="mgl-curriculum__steps">
            {curriculum.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {(curriculum.relatedDays?.length || curriculum.relatedLinks?.length) ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">مرتبط بالمنهج</h4>
          <div className="mgl-curriculum__links">
            {curriculum.relatedDays?.map((d) => (
              <Link key={d.dayId} to={`/path/day/${d.dayId}`} className="mgl-curriculum__link">
                {d.label}
              </Link>
            ))}
            {curriculum.relatedLinks?.map((l) => (
              <Link key={l.to} to={l.to} className="mgl-curriculum__link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {curriculum.codeExplanation?.length ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">شرح الكود</h4>
          <ul className="mgl-curriculum__list">
            {curriculum.codeExplanation.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {curriculum.test ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">اختبار عملي</h4>
          <p className="mgl-details__text">{curriculum.test}</p>
        </div>
      ) : null}

      {curriculum.extend ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">توسّع</h4>
          <p className="mgl-details__text">{curriculum.extend}</p>
        </div>
      ) : null}

      {curriculum.reflectionQuestions?.length ? (
        <div className="mgl-details__block">
          <h4 className="mgl-details__label">أسئلة تأمل</h4>
          <ul className="mgl-curriculum__list">
            {curriculum.reflectionQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
