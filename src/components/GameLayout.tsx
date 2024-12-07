import { ReactNode } from 'react';

type GameLayoutProps = {
  score: number;
  grid: ReactNode;
  current: ReactNode;
  next: ReactNode;
};

export function GameLayout({ score, grid, current, next }: GameLayoutProps) {
  return (
    <div className="game-layout">
      <div className="game-content">
        {/* Score and Grid Container */}
        <div className="main-container">
          <div className="score-display">
            <span className="score-label">Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="grid-container">
            {grid}
          </div>
        </div>

        {/* Side Panel - Below in portrait, right side in landscape */}
        <div className="pieces-panel">
          <div className="piece-container">
            <span className="piece-label">Current:</span>
            <div className="piece-display">
              {current}
            </div>
          </div>

          <div className="piece-container">
            <span className="piece-label">Next:</span>
            <div className="piece-display opacity-60">
              {next}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}