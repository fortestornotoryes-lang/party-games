import React from 'react';
import { StopCircle } from 'lucide-react';

interface StopGameButtonProps {
  onClick: () => void;
  className?: string;
}

export const StopGameButton: React.FC<StopGameButtonProps> = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full p-3.5 bg-white/5 border border-white/10 rounded-premium-md flex items-center justify-center gap-2 active:scale-95 transition-all ${className}`}
  >
    <StopCircle className="w-4 h-4 text-white/30" />
    <span className="font-black uppercase text-sm text-white/30 tracking-widest">
      Завершить игру
    </span>
  </button>
);
