import { MGL_GAMES } from "../games.js";

/** @typedef {import('../types.js').GameId} GameId */

/**
 * @param {{ selectedId: GameId, onSelect: (id: GameId) => void }} props
 */
export default function GameSelector({ selectedId, onSelect }) {
  return (
    <div className="mgl-game-grid" role="listbox" aria-label="اختيار اللعبة">
      {MGL_GAMES.map((game) => {
        const active = game.id === selectedId;
        return (
          <button
            key={game.id}
            type="button"
            role="option"
            aria-selected={active}
            className={`mgl-game-card${active ? " mgl-game-card--active" : ""}`}
            onClick={() => onSelect(game.id)}
          >
            <span className="mgl-game-card__icon" aria-hidden>
              {game.icon}
            </span>
            <span className="mgl-game-card__title">{game.title}</span>
          </button>
        );
      })}
    </div>
  );
}
