import React from 'react';
import type { Candy, Position } from '@/types/game';
import { CandyCell } from './CandyCell';

interface GameBoardProps {
  board: (Candy | null)[][];
  selectedCandy: Position | null;
  onCandyClick: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, selectedCandy, onCandyClick }) => {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-4 xl:p-6 shadow-2xl border-2 border-primary/10">
        <div className="grid grid-cols-8 gap-2 xl:gap-3 aspect-square">
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) => {
              const isSelected =
                selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex;
              
              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className="relative"
                  style={{
                    animationDelay: `${(rowIndex + colIndex) * 0.02}s`
                  }}
                >
                  <CandyCell
                    candy={candy}
                    isSelected={isSelected}
                    onClick={() => onCandyClick(rowIndex, colIndex)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
