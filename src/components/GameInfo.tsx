import type { Shape } from '../lib/types';
import { CurrentShape } from './CurrentShape';

type GameInfoProps = {
  score: number;
  currentShape: Shape;
  nextShape: Shape;
  gameOver: boolean;
  lastShape: Shape | null;
  onNewGame: () => void;
  currentKey: number;
};

export function GameInfo({
  score,
  currentShape,
  nextShape,
  gameOver,
  lastShape,
  onNewGame,
  currentKey
}: GameInfoProps) {
  if (gameOver) {
    return (
      <div className="game-over bg-[var(--modal-bg)] p-5 rounded-lg text-center w-full">
        <h2 className="text-xl font-bold mb-3">Game Over!</h2>
        <p className="mb-3">Final Score: {score}</p>
        {lastShape && (
          <div className="last-shape mb-5 p-3 bg-red-500/10 rounded">
            <p className="mb-2">This shape couldn't be placed:</p>
            <CurrentShape shape={lastShape} isDraggable={false} />
          </div>
        )}
        <button
          onClick={onNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="game-info">
      <div className="info-content">
        <div className="info-header">
          <h3>Current:</h3>
          <h3>Next:</h3>
          <h3>Score:</h3>
        </div>
        <div className="info-body">
          <div className="current-shape" key={`current-${currentKey}`}>
            <CurrentShape shape={currentShape} />
          </div>
          <div className="next-shape">
            <div className="scale-75 origin-top-left opacity-60">
              <CurrentShape shape={nextShape} isDraggable={false} />
            </div>
          </div>
          <div className="score-value">
            {score}
          </div>
        </div>
      </div>
    </div>
  );
}