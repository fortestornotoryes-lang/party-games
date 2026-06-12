import React from 'react';

export const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}> = ({ children, className, variant }) => (
  <span
    className={`rounded-premium-sm text-micro px-3 py-1 font-black tracking-wider uppercase ${
      variant === 'default'
        ? 'border border-white/5 bg-white/5 text-white/80'
        : 'border border-white/10 text-white/20'
    } ${className}`}
  >
    {children}
  </span>
);
