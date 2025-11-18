import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScorePopupProps {
  score: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ score, x, y, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed pointer-events-none z-50 animate-fade-in',
        'text-2xl font-bold text-accent drop-shadow-lg'
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        animation: 'float-up 1s ease-out forwards',
      }}
    >
      +{score}
    </div>
  );
};
