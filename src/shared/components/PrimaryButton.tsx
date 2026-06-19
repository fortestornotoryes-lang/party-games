import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

export type ButtonVariant = 'white' | 'premium' | 'red' | 'blue' | 'emerald' | 'purple' | 'outline';
const buttonVariants: Record<ButtonVariant, string> = {
  white: 'bg-white text-black font-display',
  premium: 'glass-card text-white  font-display border-white/10',
  red: 'bg-premium-red text-white shadow-[0_20px_50px_rgba(255,46,77,0.3)]',
  blue: 'bg-premium-blue text-white shadow-[0_20px_50px_rgba(63,123,255,0.3)]',
  emerald: 'bg-premium-green text-white shadow-[0_20px_50px_rgba(0,216,138,0.3)]',
  purple: 'bg-premium-purple text-white shadow-[0_20px_50px_rgba(199,123,255,0.3)]',
  outline: 'bg-transparent text-white/80 border border-white/5 hover:bg-white/5',
};

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  iconElement?: React.ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
  type?: 'button' | 'submit';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  icon: Icon,
  iconElement,
  disabled,
  variant = 'premium',
  className,
  type = 'button',
}) => {
  const handleClick = () => {
    feedbackService.playSound('click');
    feedbackService.vibrate(VIBRATE.tap);
    console.log('onClick', onClick);
    if (onClick) onClick();
  };

  const baseStyles =
    'w-full h-16 rounded-premium-md font-black italic text-xl flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none relative overflow-hidden group border-none';

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${buttonVariants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {iconElement ?? (Icon && <Icon className="relative z-10 h-6 w-6" />)}
      <span className="relative z-10 leading-none tracking-tighter uppercase">{children}</span>
    </button>
  );
};
