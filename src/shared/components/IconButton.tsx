import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

export const IconButton: React.FC<{
  onClick: () => void;
  icon: LucideIcon;
  className?: string;
  variant?: 'ghost' | 'filled' | 'danger';
}> = ({ onClick, icon: Icon, className, variant = 'filled' }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    feedbackService.playSound('click');
    feedbackService.vibrate(VIBRATE.tap);
    onClick();
  };

  const variants = {
    ghost: 'glass-card text-white/80 active:scale-95 border-none',
    filled: 'bg-white text-black active:scale-95 border-none',
    danger: 'bg-premium-red/10 text-premium-red border border-premium-red/20 active:scale-95',
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-premium-sm flex items-center justify-center p-4 transition-all ${variants[variant]} ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};
