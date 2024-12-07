import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import type { Shape } from '../lib/types';

type CurrentShapeProps = {
  shape: Shape;
  isDraggable?: boolean;
};

export function CurrentShape({ shape, isDraggable = true }: CurrentShapeProps) {
  const shapeRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shape',
    item: () => {
      const element = shapeRef.current;
      if (!element) return { shape, offset: { x: 0, y: 0 } };

      // Find the dimensions of the shape
      let maxX = 0;
      let maxY = 0;
      shape.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        });
      });

      return {
        shape,
        offset: { x: maxX, y: maxY }
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [shape]);

  const element = (
    <div 
      ref={shapeRef}
      className={`
        inline-block p-1 touch-none select-none text-sm
        ${isDraggable ? 'cursor-move' : ''}
        ${isDragging ? 'opacity-30' : ''}
      `}
      role={isDraggable ? "button" : "presentation"}
      aria-label={isDraggable ? "Current shape - drag to place on grid" : undefined}
      style={{ touchAction: 'none' }}
    >
      {shape.grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                w-[30px] h-[30px] m-[0.75px]
                ${cell ? 'filled border border-[rgba(128,128,128,0.3)] dark:border-[rgba(255,255,255,0.3)]' : 'invisible'}
              `}
              style={{
                backgroundColor: cell ? shape.color : 'transparent'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return isDraggable ? drag(element) : element;
}