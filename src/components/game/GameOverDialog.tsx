import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, XCircle, Star, Sparkles } from 'lucide-react';

interface GameOverDialogProps {
  isOpen: boolean;
  gameStatus: 'won' | 'lost';
  score: number;
  level: number;
  onRestart: () => void;
  onNextLevel: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  isOpen,
  gameStatus,
  score,
  level,
  onRestart,
  onNextLevel,
}) => {
  const isWon = gameStatus === 'won';

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm xl:max-w-md border-2 border-primary/20">
        <DialogHeader>
          <div className="flex justify-center mb-6 relative">
            {isWon ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 blur-2xl animate-pulse" />
                </div>
                <div className="relative w-24 h-24 xl:w-32 xl:h-32 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-2xl">
                  <Trophy className="w-12 h-12 xl:w-16 xl:h-16 text-white drop-shadow-lg" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
                  <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-accent animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-destructive/30 to-destructive/10 blur-2xl" />
                </div>
                <div className="relative w-24 h-24 xl:w-32 xl:h-32 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-2xl">
                  <XCircle className="w-12 h-12 xl:w-16 xl:h-16 text-white drop-shadow-lg" />
                </div>
              </>
            )}
          </div>
          <DialogTitle className="text-3xl xl:text-4xl text-center font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {isWon ? 'Level Complete!' : 'Game Over'}
          </DialogTitle>
          <DialogDescription className="text-center text-base xl:text-lg mt-2">
            {isWon
              ? '🎉 Congratulations! You reached the target score!'
              : '😔 Out of moves! Try again to beat this level.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 border-2 border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Level</span>
              <span className="text-2xl xl:text-3xl font-bold text-primary">{level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Final Score</span>
              <span className="text-2xl xl:text-3xl font-bold text-secondary">
                {score.toLocaleString()}
              </span>
            </div>
          </div>

          {isWon && (
            <div className="flex items-center justify-center gap-3 py-2">
              <Star className="w-8 h-8 xl:w-10 xl:h-10 text-accent fill-accent animate-pulse" />
              <Star className="w-10 h-10 xl:w-12 xl:h-12 text-accent fill-accent" />
              <Star className="w-8 h-8 xl:w-10 xl:h-10 text-accent fill-accent animate-pulse" />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isWon && (
              <Button 
                onClick={onNextLevel} 
                size="lg" 
                className="w-full text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Next Level →
              </Button>
            )}
            <Button
              onClick={onRestart}
              variant={isWon ? 'outline' : 'default'}
              size="lg"
              className="w-full text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {isWon ? 'Replay Level' : 'Try Again'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
