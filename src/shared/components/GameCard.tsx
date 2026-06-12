import React from 'react';

import { SectionLabel } from '@/shared/components/SectionLabel';

export const GameCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}> = ({ children, title, className, onClick }) => (
  <div
    onClick={onClick}
    className={`glass-card rounded-premium-lg p-7 shadow-2xl ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className} border-white/5`}
  >
    {!!title && (
      <SectionLabel className="font-display mb-6 tracking-[0.4em] italic">{title}</SectionLabel>
    )}
    {children}
  </div>
);
