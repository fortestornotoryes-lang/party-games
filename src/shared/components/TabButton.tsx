import React from 'react';

export const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`text-label font-display flex-1 border-b-2 py-4 font-black tracking-[0.3em] uppercase italic transition-all ${
      active ? 'border-premium-red text-white' : 'border-white/5 text-white/20'
    }`}
  >
    {children}
  </button>
);
