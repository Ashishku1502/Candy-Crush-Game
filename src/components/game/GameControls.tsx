import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onPause: () => void;
  onToggleSound: () => void;
  isPaused: boolean;
  isSoundOn: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onPause,
  onToggleSound,
  isPaused,
  isSoundOn,
}) => {
  return (
    <div className="flex flex-wrap gap-3 xl:gap-4 justify-center">
      <Button
        onClick={onRestart}
        variant="outline"
        size="lg"
        className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-primary/50 transition-all hover:scale-105 active:scale-95"
      >
        <RotateCcw className="w-4 h-4 xl:w-5 xl:h-5" />
        <span className="font-semibold">Restart</span>
      </Button>

      <Button
        onClick={onPause}
        variant="outline"
        size="lg"
        className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-secondary/50 transition-all hover:scale-105 active:scale-95"
      >
        {isPaused ? (
          <>
            <Play className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="font-semibold">Resume</span>
          </>
        ) : (
          <>
            <Pause className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="font-semibold">Pause</span>
          </>
        )}
      </Button>

      <Button
        onClick={onToggleSound}
        variant="outline"
        size="lg"
        className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-accent/50 transition-all hover:scale-105 active:scale-95"
      >
        {isSoundOn ? (
          <>
            <Volume2 className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="font-semibold hidden xl:inline">Sound On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="font-semibold hidden xl:inline">Sound Off</span>
          </>
        )}
      </Button>
    </div>
  );
};
