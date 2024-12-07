import type { Shape } from '../lib/types';
import { CurrentShape } from './CurrentShape';

type ShapesPanelProps = {
  score: number;
  currentShape: Shape;
  nextShape: Shape;
  gameOver: boolean;
  lastShape: Shape | null;
  onNewGame: () => void;
  currentKey: number;
};

export function ShapesPanel({
  score,
  currentShape,
  nextShape,
  gameOver,
  lastShape,
  onNewGame,
  currentKey
}: ShapesPanelProps) {
  return (
    <div className="shapes-panel flex-shrink-0 min-w-[200px]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {!gameOver ? (
          <>
            <div className="flex items-center gap-8">
              <div className="current-shape slide-in" key={`current-${currentKey}`}>
                <h3 className="mb-2 text-lg font-semibold">Current:</h3>
                <CurrentShape shape={currentShape} />
              </div>
              <div className="next-shape">
                <h3 className="mb-2 text-sm font-semibold">Next:</h3>
                <div className="scale-75 origin-top-left opacity-60">
                  <CurrentShape shape={nextShape} isDraggable={false} />
                </div>
              </div>
            </div>
            <div className="score text-2xl font-bold text-center md:text-left">
              Score: {score}
            </div>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
}