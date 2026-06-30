/** @typedef {import('../types.js').MglGame} MglGame */

/**
 * @param {{ game: MglGame }} props
 */
export default function GameDetails({ game }) {
  return (
    <div className="mgl-details">
      <h3 className="mgl-details__title">{game.title}</h3>
      <div className="mgl-details__block">
        <h4 className="mgl-details__label">الهدف التعليمي</h4>
        <p className="mgl-details__text">{game.objective}</p>
      </div>
      <div className="mgl-details__block">
        <h4 className="mgl-details__label">المفاهيم</h4>
        <ul className="mgl-details__tags">
          {game.concepts.map((c) => (
            <li key={c} className="mgl-details__tag">
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="mgl-details__block">
        <h4 className="mgl-details__label">طريقة التحكم</h4>
        <p className="mgl-details__text">{game.controls}</p>
      </div>
      <div className="mgl-details__block">
        <h4 className="mgl-details__label">وصف اللعبة</h4>
        <p className="mgl-details__text">{game.description}</p>
      </div>
    </div>
  );
}
