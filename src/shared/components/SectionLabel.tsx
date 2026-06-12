import React from 'react';

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`text-label mb-3 block font-black tracking-[0.5em] text-white/80 uppercase italic ${className}`}
  >
    {children}
  </span>
);
