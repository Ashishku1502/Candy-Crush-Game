import type { Candy, CandyType, Position, SpecialCandyType } from '@/types/game';

const BOARD_SIZE = 8;
const CANDY_TYPES: CandyType[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createCandy(row: number, col: number, type?: CandyType): Candy {
  return {
    id: generateUniqueId(),
    type: type || CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
    special: null,
    row,
    col,
  };
}

export function initializeBoard(): (Candy | null)[][] {
  const board: (Candy | null)[][] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      let candy = createCandy(row, col);
      
      while (wouldCreateMatch(board, row, col, candy.type)) {
        candy = createCandy(row, col);
      }
      
      board[row][col] = candy;
    }
  }
  
  return board;
}

function wouldCreateMatch(
  board: (Candy | null)[][],
  row: number,
  col: number,
  type: CandyType
): boolean {
  if (col >= 2 && board[row][col - 1]?.type === type && board[row][col - 2]?.type === type) {
    return true;
  }
  
  if (row >= 2 && board[row - 1][col]?.type === type && board[row - 2][col]?.type === type) {
    return true;
  }
  
  return false;
}

export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function swapCandies(
  board: (Candy | null)[][],
  pos1: Position,
  pos2: Position
): (Candy | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;
  
  if (newBoard[pos1.row][pos1.col]) {
    newBoard[pos1.row][pos1.col]!.row = pos1.row;
    newBoard[pos1.row][pos1.col]!.col = pos1.col;
  }
  if (newBoard[pos2.row][pos2.col]) {
    newBoard[pos2.row][pos2.col]!.row = pos2.row;
    newBoard[pos2.row][pos2.col]!.col = pos2.col;
  }
  
  return newBoard;
}

export function findMatches(board: (Candy | null)[][]): Position[] {
  const matches: Position[] = [];
  const matchedSet = new Set<string>();
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const candy = board[row][col];
      if (!candy) continue;
      
      const horizontalMatches = findHorizontalMatches(board, row, col);
      const verticalMatches = findVerticalMatches(board, row, col);
      
      if (horizontalMatches.length >= 3) {
        horizontalMatches.forEach(pos => {
          const key = `${pos.row}-${pos.col}`;
          if (!matchedSet.has(key)) {
            matchedSet.add(key);
            matches.push(pos);
          }
        });
      }
      
      if (verticalMatches.length >= 3) {
        verticalMatches.forEach(pos => {
          const key = `${pos.row}-${pos.col}`;
          if (!matchedSet.has(key)) {
            matchedSet.add(key);
            matches.push(pos);
          }
        });
      }
    }
  }
  
  return matches;
}

function findHorizontalMatches(board: (Candy | null)[][], row: number, col: number): Position[] {
  const candy = board[row][col];
  if (!candy) return [];
  
  const matches: Position[] = [{ row, col }];
  let currentCol = col + 1;
  
  while (currentCol < BOARD_SIZE && board[row][currentCol]?.type === candy.type) {
    matches.push({ row, col: currentCol });
    currentCol++;
  }
  
  currentCol = col - 1;
  while (currentCol >= 0 && board[row][currentCol]?.type === candy.type) {
    matches.push({ row, col: currentCol });
    currentCol--;
  }
  
  return matches.length >= 3 ? matches : [];
}

function findVerticalMatches(board: (Candy | null)[][], row: number, col: number): Position[] {
  const candy = board[row][col];
  if (!candy) return [];
  
  const matches: Position[] = [{ row, col }];
  let currentRow = row + 1;
  
  while (currentRow < BOARD_SIZE && board[currentRow][col]?.type === candy.type) {
    matches.push({ row: currentRow, col });
    currentRow++;
  }
  
  currentRow = row - 1;
  while (currentRow >= 0 && board[currentRow][col]?.type === candy.type) {
    matches.push({ row: currentRow, col });
    currentRow--;
  }
  
  return matches.length >= 3 ? matches : [];
}

export function removeMatches(board: (Candy | null)[][], matches: Position[]): (Candy | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  matches.forEach(pos => {
    newBoard[pos.row][pos.col] = null;
  });
  
  return newBoard;
}

export function applyGravity(board: (Candy | null)[][]): (Candy | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptyRow = BOARD_SIZE - 1;
    
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col] !== null) {
        if (row !== emptyRow) {
          newBoard[emptyRow][col] = newBoard[row][col];
          if (newBoard[emptyRow][col]) {
            newBoard[emptyRow][col]!.row = emptyRow;
          }
          newBoard[row][col] = null;
        }
        emptyRow--;
      }
    }
  }
  
  return newBoard;
}

export function fillEmptySpaces(board: (Candy | null)[][]): (Candy | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = createCandy(row, col);
      }
    }
  }
  
  return newBoard;
}

export function calculateScore(matchCount: number, comboMultiplier: number): number {
  let baseScore = 0;
  
  if (matchCount === 3) {
    baseScore = 100;
  } else if (matchCount === 4) {
    baseScore = 200;
  } else if (matchCount >= 5) {
    baseScore = 500;
  }
  
  return baseScore * comboMultiplier;
}

export function determineSpecialCandy(matches: Position[]): SpecialCandyType {
  if (matches.length === 4) {
    return 'striped';
  } else if (matches.length === 5) {
    const rows = new Set(matches.map(m => m.row));
    const cols = new Set(matches.map(m => m.col));
    
    if (rows.size > 1 && cols.size > 1) {
      return 'wrapped';
    }
    return 'color-bomb';
  }
  
  return null;
}

export function hasValidMoves(board: (Candy | null)[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (col < BOARD_SIZE - 1) {
        const testBoard = swapCandies(board, { row, col }, { row, col: col + 1 });
        if (findMatches(testBoard).length > 0) {
          return true;
        }
      }
      
      if (row < BOARD_SIZE - 1) {
        const testBoard = swapCandies(board, { row, col }, { row: row + 1, col });
        if (findMatches(testBoard).length > 0) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export const LEVEL_CONFIGS = [
  { level: 1, targetScore: 1000, maxMoves: 20 },
  { level: 2, targetScore: 2000, maxMoves: 18 },
  { level: 3, targetScore: 3500, maxMoves: 16 },
  { level: 4, targetScore: 5000, maxMoves: 15 },
  { level: 5, targetScore: 7000, maxMoves: 14 },
];

export function getLevelConfig(level: number) {
  return LEVEL_CONFIGS[Math.min(level - 1, LEVEL_CONFIGS.length - 1)];
}
