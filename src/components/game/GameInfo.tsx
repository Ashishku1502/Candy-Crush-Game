import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Zap, Flame } from 'lucide-react';

interface GameInfoProps {
  score: number;
  targetScore: number;
  moves: number;
  level: number;
  comboMultiplier: number;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  score,
  targetScore,
  moves,
  level,
  comboMultiplier,
}) => {
  const progress = Math.min((score / targetScore) * 100, 100);
  const isLowMoves = moves <= 5;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4 xl:p-6">
          <div className="flex items-center gap-2 xl:gap-3 mb-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Trophy className="w-4 h-4 xl:w-5 xl:h-5 text-accent" />
            </div>
            <span className="text-xs xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Level</span>
          </div>
          <p className="text-3xl xl:text-4xl font-bold text-accent">{level}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/30 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4 xl:p-6">
          <div className="flex items-center gap-2 xl:gap-3 mb-2">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <Target className="w-4 h-4 xl:w-5 xl:h-5 text-secondary" />
            </div>
            <span className="text-xs xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Score</span>
          </div>
          <p className="text-2xl xl:text-3xl font-bold text-secondary mb-2">
            {score.toLocaleString()}
          </p>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-secondary/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Goal: {targetScore.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${isLowMoves ? 'from-destructive/10 to-destructive/5 border-destructive/30' : 'from-primary/10 to-primary/5 border-primary/30'} border-2 shadow-lg hover:shadow-xl transition-all`}>
        <CardContent className="p-4 xl:p-6">
          <div className="flex items-center gap-2 xl:gap-3 mb-2">
            <div className={`p-2 ${isLowMoves ? 'bg-destructive/20' : 'bg-primary/20'} rounded-lg ${isLowMoves ? 'animate-pulse' : ''}`}>
              <Zap className={`w-4 h-4 xl:w-5 xl:h-5 ${isLowMoves ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <span className="text-xs xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Moves</span>
          </div>
          <p className={`text-3xl xl:text-4xl font-bold ${isLowMoves ? 'text-destructive' : 'text-primary'}`}>
            {moves}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4 xl:p-6">
          <div className="flex items-center gap-2 xl:gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Flame className="w-4 h-4 xl:w-5 xl:h-5 text-primary" />
            </div>
            <span className="text-xs xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Combo</span>
          </div>
          {comboMultiplier > 1 ? (
            <div className="flex items-baseline gap-1">
              <p className="text-3xl xl:text-4xl font-bold text-primary animate-pulse">
                x{comboMultiplier}
              </p>
              <span className="text-sm text-primary/70 font-semibold">🔥</span>
            </div>
          ) : (
            <p className="text-3xl xl:text-4xl font-bold text-muted-foreground/50">-</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
