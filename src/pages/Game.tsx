import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Position } from '@/types/game';
import { GameBoard } from '@/components/game/GameBoard';
import { GameInfo } from '@/components/game/GameInfo';
import { GameControls } from '@/components/game/GameControls';
import { GameOverDialog } from '@/components/game/GameOverDialog';
import { UserProfile } from '@/components/auth/UserProfile';
import {
  initializeBoard,
  areAdjacent,
  swapCandies,
  findMatches,
  removeMatches,
  applyGravity,
  fillEmptySpaces,
  calculateScore,
  hasValidMoves,
  getLevelConfig,
} from '@/lib/gameLogic';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getGameProgress, updateGameProgress } from '@/db/api';

export default function Game() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const initializeGame = useCallback((level: number = 1): GameState => {
    const config = getLevelConfig(level);
    return {
      board: initializeBoard(),
      score: 0,
      moves: config.maxMoves,
      level,
      targetScore: config.targetScore,
      maxMoves: config.maxMoves,
      selectedCandy: null,
      isProcessing: false,
      gameStatus: 'playing',
      comboMultiplier: 1,
    };
  }, []);

  const [gameState, setGameState] = useState<GameState>(() => initializeGame(1));

  // Load progress from database when user logs in
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        setIsLoadingProgress(true);
        const progress = await getGameProgress(user.id);
        if (progress) {
          setGameState(initializeGame(progress.current_level));
        }
        setIsLoadingProgress(false);
      } else {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user, initializeGame]);

  // Save progress to database
  const saveProgress = useCallback(async (level: number, score: number) => {
    if (user) {
      await updateGameProgress(user.id, level, score);
    }
  }, [user]);

  const processMatches = useCallback(async (currentBoard = gameState.board, multiplier = 1) => {
    const matches = findMatches(currentBoard);

    if (matches.length === 0) {
      setGameState(prev => ({
        ...prev,
        isProcessing: false,
        comboMultiplier: 1,
      }));

      if (!hasValidMoves(currentBoard)) {
        toast({
          title: 'No valid moves!',
          description: 'Board reshuffled',
        });
        setGameState(prev => ({
          ...prev,
          board: initializeBoard(),
        }));
      }
      return;
    }

    const matchedBoard = currentBoard.map(row =>
      row.map(candy => {
        if (candy && matches.some(m => m.row === candy.row && m.col === candy.col)) {
          return { ...candy, isAnimating: true };
        }
        return candy;
      })
    );

    setGameState(prev => ({ ...prev, board: matchedBoard }));

    await new Promise(resolve => setTimeout(resolve, 500));

    const clearedBoard = removeMatches(matchedBoard, matches);
    const points = calculateScore(matches.length, multiplier);

    setGameState(prev => ({
      ...prev,
      board: clearedBoard,
      score: prev.score + points,
      comboMultiplier: multiplier,
    }));

    await new Promise(resolve => setTimeout(resolve, 300));

    const fallenBoard = applyGravity(clearedBoard);
    setGameState(prev => ({ ...prev, board: fallenBoard }));

    await new Promise(resolve => setTimeout(resolve, 500));

    const filledBoard = fillEmptySpaces(fallenBoard);
    setGameState(prev => ({ ...prev, board: filledBoard }));

    await new Promise(resolve => setTimeout(resolve, 600));

    processMatches(filledBoard, multiplier + 1);
  }, [gameState.board, toast]);

  const handleCandyClick = useCallback(
    async (row: number, col: number) => {
      if (gameState.isProcessing || gameState.gameStatus !== 'playing') return;

      const clickedPosition: Position = { row, col };

      if (!gameState.selectedCandy) {
        setGameState(prev => ({ ...prev, selectedCandy: clickedPosition }));
        return;
      }

      if (
        gameState.selectedCandy.row === row &&
        gameState.selectedCandy.col === col
      ) {
        setGameState(prev => ({ ...prev, selectedCandy: null }));
        return;
      }

      if (!areAdjacent(gameState.selectedCandy, clickedPosition)) {
        setGameState(prev => ({ ...prev, selectedCandy: clickedPosition }));
        return;
      }

      setGameState(prev => ({ ...prev, isProcessing: true }));

      const swappedBoard = swapCandies(
        gameState.board,
        gameState.selectedCandy,
        clickedPosition
      );

      const matches = findMatches(swappedBoard);

      if (matches.length === 0) {
        toast({
          title: 'Invalid move',
          description: 'This swap does not create any matches',
          variant: 'destructive',
        });

        setGameState(prev => ({
          ...prev,
          selectedCandy: null,
          isProcessing: false,
        }));
        return;
      }

      setGameState(prev => ({
        ...prev,
        board: swappedBoard,
        moves: prev.moves - 1,
        selectedCandy: null,
      }));

      await new Promise(resolve => setTimeout(resolve, 400));

      processMatches(swappedBoard, 1);
    },
    [gameState, processMatches, toast]
  );

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    if (gameState.score >= gameState.targetScore) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }));
      saveProgress(gameState.level + 1, gameState.score);
      toast({
        title: 'Level Complete!',
        description: `You scored ${gameState.score} points!`,
      });
    } else if (gameState.moves <= 0 && !gameState.isProcessing) {
      setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
      toast({
        title: 'Game Over',
        description: 'No more moves left!',
        variant: 'destructive',
      });
    }
  }, [gameState.score, gameState.moves, gameState.targetScore, gameState.level, gameState.isProcessing, gameState.gameStatus, saveProgress, toast]);

  const handleRestart = useCallback(() => {
    setGameState(initializeGame(gameState.level));
  }, [gameState.level, initializeGame]);

  const handleNextLevel = useCallback(() => {
    setGameState(initializeGame(gameState.level + 1));
  }, [gameState.level, initializeGame]);

  const handlePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'paused' ? 'playing' : 'paused',
    }));
  }, []);

  const handleToggleSound = useCallback(() => {
    setIsSoundOn(prev => !prev);
  }, []);

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--game-bg-start))] to-[hsl(var(--game-bg-end))]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-bg-start))] via-[hsl(var(--background))] to-[hsl(var(--game-bg-end))] py-4 xl:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,16,224,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute top-4 right-4 z-10">
        <UserProfile />
      </div>
      
      <div className="relative max-w-4xl mx-auto space-y-4 xl:space-y-6">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
              🍬 Candy Crush
            </h1>
            <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mt-2" />
          </div>
          <p className="text-base xl:text-lg text-muted-foreground font-medium">
            Match 3 or more candies to score points and complete the level!
          </p>
        </div>

        <GameInfo
          score={gameState.score}
          targetScore={gameState.targetScore}
          moves={gameState.moves}
          level={gameState.level}
          comboMultiplier={gameState.comboMultiplier}
        />

        <GameBoard
          board={gameState.board}
          selectedCandy={gameState.selectedCandy}
          onCandyClick={handleCandyClick}
        />

        <GameControls
          onRestart={handleRestart}
          onPause={handlePause}
          onToggleSound={handleToggleSound}
          isPaused={gameState.gameStatus === 'paused'}
          isSoundOn={isSoundOn}
        />

        <GameOverDialog
          isOpen={gameState.gameStatus === 'won' || gameState.gameStatus === 'lost'}
          gameStatus={gameState.gameStatus as 'won' | 'lost'}
          score={gameState.score}
          level={gameState.level}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
        />

        {gameState.gameStatus === 'paused' && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-card/90 backdrop-blur-sm p-10 xl:p-12 rounded-3xl shadow-2xl text-center space-y-6 border-2 border-primary/20 max-w-md">
              <div className="text-6xl">⏸️</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Game Paused
              </h2>
              <p className="text-lg text-muted-foreground">
                Click Resume to continue playing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
