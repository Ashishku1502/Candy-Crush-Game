export type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export type SpecialCandyType = 'striped' | 'wrapped' | 'color-bomb' | null;

export interface Candy {
  id: string;
  type: CandyType;
  special: SpecialCandyType;
  row: number;
  col: number;
  isMatched?: boolean;
  isAnimating?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: (Candy | null)[][];
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  maxMoves: number;
  selectedCandy: Position | null;
  isProcessing: boolean;
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
  comboMultiplier: number;
}

export interface LevelConfig {
  level: number;
  targetScore: number;
  maxMoves: number;
}
