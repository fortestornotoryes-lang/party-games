import React from "react";

export const Badge: React.FC<{
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'outline';
}> = ({children, className, variant}) => (
    <span
        className={`px-3 py-1 rounded-premium-sm text-micro font-black uppercase tracking-wider ${
            variant === 'default'
                ? 'bg-white/5 text-white/80 border border-white/5'
                : 'border border-white/10 text-white/20'
        } ${className}`}
    >
    {children}
  </span>
);