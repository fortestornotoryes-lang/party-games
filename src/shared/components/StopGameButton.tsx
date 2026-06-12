import { StopCircle } from 'lucide-react';
import React from 'react';

interface StopGameButtonProps {
  onClick: () => void;
  className?: string;
}

export const StopGameButton: React.FC<StopGameButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`rounded-premium-md flex w-full items-center justify-center gap-2 border border-white/10 bg-white/5 p-3.5 transition-all active:scale-95 ${className}`}
  >
    <StopCircle className="h-4 w-4 text-white/30" />
    <span className="text-sm font-black tracking-widest text-white/30 uppercase">
      Завершить игру
    </span>
  </button>
);
