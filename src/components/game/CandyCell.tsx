import React from 'react';
import type { Candy } from '@/types/game';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface CandyCellProps {
  candy: Candy | null;
  isSelected: boolean;
  onClick: () => void;
}

const candyStyles = {
  red: {
    bg: 'bg-candy-red',
    shadow: 'shadow-[0_4px_12px_rgba(255,59,59,0.4)]',
    emoji: '🍓',
  },
  blue: {
    bg: 'bg-candy-blue',
    shadow: 'shadow-[0_4px_12px_rgba(74,144,226,0.4)]',
    emoji: '🍇',
  },
  green: {
    bg: 'bg-candy-green',
    shadow: 'shadow-[0_4px_12px_rgba(126,211,33,0.4)]',
    emoji: '🍏',
  },
  yellow: {
    bg: 'bg-candy-yellow',
    shadow: 'shadow-[0_4px_12px_rgba(245,166,35,0.4)]',
    emoji: '🍋',
  },
  purple: {
    bg: 'bg-candy-purple',
    shadow: 'shadow-[0_4px_12px_rgba(189,16,224,0.4)]',
    emoji: '🍬',
  },
};

export const CandyCell: React.FC<CandyCellProps> = ({ candy, isSelected, onClick }) => {
  if (!candy) {
    return <div className="w-full h-full bg-muted/20 rounded-lg" />;
  }

  const style = candyStyles[candy.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full h-full rounded-2xl transition-all duration-300 flex items-center justify-center',
        'cursor-pointer overflow-hidden group',
        style.bg,
        style.shadow,
        'hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0',
        isSelected && 'scale-110 ring-4 ring-primary ring-offset-2 ring-offset-background animate-pulse',
        candy.isAnimating && 'animate-pop-out',
        !candy.isAnimating && 'animate-bounce-in'
      )}
      aria-label={`${candy.type} candy`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 rounded-2xl" />
      
      <div className="absolute top-2 left-2 w-6 h-6 bg-white/60 rounded-full blur-md" />
      
      <span className="relative z-10 text-3xl xl:text-4xl pointer-events-none select-none drop-shadow-lg">
        {style.emoji}
      </span>

      {candy.special === 'striped' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-full bg-white/80 shadow-lg" />
          <div className="w-1.5 h-full bg-white/80 shadow-lg ml-2" />
        </div>
      )}
      
      {candy.special === 'wrapped' && (
        <div className="absolute inset-1 border-4 border-white/80 rounded-xl pointer-events-none shadow-inner" />
      )}
      
      {candy.special === 'color-bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
          <div className="absolute w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
        </div>
      )}

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-200 rounded-2xl" />
    </button>
  );
};
