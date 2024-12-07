import { useState, useEffect } from 'react';
import { GameGrid } from './components/GameGrid';
import { CurrentShape } from './components/CurrentShape';
import { Menu } from './components/Menu';
import { SplashScreen } from './components/SplashScreen';
import { GameLayout } from './components/GameLayout';
import { GameState } from './lib/GameState';
import { toggleFullscreen, isFullscreen } from './lib/utils/fullscreen';

export default function App() {
  const [gameState] = useState(() => new GameState(
    new URLSearchParams(window.location.search).get('seed') || undefined
  ));
  const [score, setScore] = useState(gameState.score);
  const [grid, setGrid] = useState(gameState.grid);
  const [currentShape, setCurrentShape] = useState(gameState.currentShape);
  const [nextShape, setNextShape] = useState(gameState.nextShape);
  const [gameOver, setGameOver] = useState(gameState.gameOver);
  const [lastShape, setLastShape] = useState(gameState.lastShape);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isFullscreenMode, setIsFullscreenMode] = useState(isFullscreen());
  const [showSplash, setShowSplash] = useState(() => {
    return localStorage.getItem('shapeSorterSplashDismissed') !== 'true';
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    window.history.replaceState({}, '', `?seed=${gameState.seed}`);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    const handleFullscreenChange = () => {
      setIsFullscreenMode(isFullscreen());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleShapePlacement = async (x: number, y: number) => {
    if (!gameState.placeShape(x, y)) return;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const linesToClear = gameState.findLinesToClear();
    if (linesToClear.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 800));
      gameState.clearLines(linesToClear);
    }
    
    gameState.nextTurn();
    
    setScore(gameState.score);
    setGrid([...gameState.grid]);
    setCurrentShape(gameState.currentShape);
    setNextShape(gameState.nextShape);
    setGameOver(gameState.gameOver);
    setLastShape(gameState.lastShape);
    setKey(prev => prev + 1);
  };

  const handleNewGame = () => {
    const newGameState = new GameState();
    window.history.replaceState({}, '', `?seed=${newGameState.seed}`);
    
    setScore(newGameState.score);
    setGrid([...newGameState.grid]);
    setCurrentShape(newGameState.currentShape);
    setNextShape(newGameState.nextShape);
    setGameOver(newGameState.gameOver);
    setLastShape(newGameState.lastShape);
    
    Object.assign(gameState, newGameState);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?seed=${gameState.seed}`;
    navigator.clipboard.writeText(url);
    alert('Game URL copied to clipboard!');
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };

  const handleDismissSplash = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('shapeSorterSplashDismissed', 'true');
    }
    setShowSplash(false);
  };

  return (
    <>
      <Menu 
        onNewGame={handleNewGame}
        onShare={handleShare}
        onToggleTheme={handleToggleTheme}
        onToggleFullscreen={handleToggleFullscreen}
        isDarkMode={isDarkMode}
        isFullscreen={isFullscreenMode}
      />

      {showSplash && (
        <SplashScreen onDismiss={handleDismissSplash} />
      )}

      <main className="pt-16 min-h-screen">
        {!gameOver ? (
          <GameLayout
            score={score}
            grid={
              <GameGrid
                grid={grid}
                currentShape={currentShape}
                onCellDrop={handleShapePlacement}
                isFullscreen={isFullscreenMode}
              />
            }
            current={
              <CurrentShape
                shape={currentShape}
                isDraggable={true}
              />
            }
            next={
              <CurrentShape
                shape={nextShape}
                isDraggable={false}
              />
            }
          />
        ) : (
          <div className="game-over bg-[var(--modal-bg)] p-5 rounded-lg text-center max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-3">Game Over!</h2>
            <p className="mb-3">Final Score: {score}</p>
            {lastShape && (
              <div className="last-shape mb-5 p-3 bg-red-500/10 rounded">
                <p className="mb-2">This shape couldn't be placed:</p>
                <CurrentShape shape={lastShape} isDraggable={false} />
              </div>
            )}
            <button
              onClick={handleNewGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}