import { useDrop } from 'react-dnd';
import { useEffect, useRef, useState } from 'react';
import type { Cell, Shape, Position } from '../lib/types';

type GameGridProps = {
  grid: Cell[][];
  currentShape: Shape;
  onCellDrop: (x: number, y: number) => void;
  isFullscreen: boolean;
};

export function GameGrid({ grid, currentShape, onCellDrop, isFullscreen }: GameGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [previewPosition, setPreviewPosition] = useState<Position | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!gridRef.current) return;
      
      const gridSize = 324; // Base grid size (6 * 52px + padding)
      const margin = 32; // Margin for the grid
      const titleBarHeight = 64; // Height of the title bar
      const maxScale = 1.2; // Maximum allowed scale
      
      const availableWidth = window.innerWidth - margin * 2;
      const availableHeight = window.innerHeight - titleBarHeight - margin * 2;
      
      if (isFullscreen) {
        const scaleX = (availableWidth * 0.6) / gridSize; // Use 60% of width
        const scaleY = (availableHeight * 0.8) / gridSize; // Use 80% of height
        setScale(Math.min(scaleX, scaleY, maxScale));
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isFullscreen]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'shape',
    hover: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const cellSize = 52 * scale;
      
      const x = Math.floor((offset.x - rect.left) / cellSize) - (item.offset?.x || 0);
      const y = Math.floor((offset.y - rect.top) / cellSize) - (item.offset?.y || 0);
      
      setPreviewPosition({ x, y });
    },
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const cellSize = 52 * scale;
      
      const x = Math.floor((offset.x - rect.left) / cellSize) - (item.offset?.x || 0);
      const y = Math.floor((offset.y - rect.top) / cellSize) - (item.offset?.y || 0);
      
      if (canPlaceShape(x, y)) {
        onCellDrop(x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [currentShape, grid, onCellDrop, scale]);

  useEffect(() => {
    if (!isOver) {
      setPreviewPosition(null);
    }
  }, [isOver]);

  const canPlaceShape = (x: number, y: number): boolean => {
    if (!currentShape) return false;
    
    for (let sy = 0; sy < currentShape.grid.length; sy++) {
      for (let sx = 0; sx < currentShape.grid[sy].length; sx++) {
        if (currentShape.grid[sy][sx]) {
          const gridX = x + sx;
          const gridY = y + sy;
          
          if (gridX >= 6 || gridY >= 6 || gridX < 0 || gridY < 0 || grid[gridY][gridX].filled) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const getPreviewCells = () => {
    if (!previewPosition || !isOver) return [];
    
    return Array(currentShape.grid.length).fill(0).flatMap((_, sy) =>
      Array(currentShape.grid[sy].length).fill(0).map((_, sx) => ({
        x: previewPosition.x + sx,
        y: previewPosition.y + sy,
        active: currentShape.grid[sy][sx]
      }))
    ).filter(({active}) => active);
  };

  const previewCells = getPreviewCells();
  const isValidPlacement = previewCells.length > 0 && 
    canPlaceShape(previewPosition?.x || 0, previewPosition?.y || 0);

  return (
    <div 
      ref={(node) => {
        gridRef.current = node;
        drop(node);
      }}
      className="grid inline-block border-2 border-[var(--border-color)] bg-[var(--grid-bg)] p-1 rounded-lg touch-none select-none transition-transform duration-300"
      role="grid"
      aria-label="Game grid - 6x6 cells"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}
    >
      {grid.map((row, y) => (
        <div key={y} className="flex" role="row">
          {row.map((cell, x) => {
            const isPreview = previewCells.some(p => p.x === x && p.y === y);
            return (
              <div
                key={`${x}-${y}`}
                className={`
                  cell
                  ${cell.filled ? 'filled' : ''}
                  ${isPreview ? 'preview' : ''}
                  ${isPreview && isValidPlacement ? 'valid' : ''}
                  ${isPreview && !isValidPlacement ? 'invalid' : ''}
                `}
                style={{
                  backgroundColor: cell.filled ? cell.color : 'transparent'
                }}
                role="gridcell"
                aria-label={cell.filled ? 'Filled cell' : 'Empty cell'}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}