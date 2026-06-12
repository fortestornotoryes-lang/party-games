import type { LucideIcon } from 'lucide-react';
import { Home } from 'lucide-react';
import React from 'react';

import { getTheme } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  theme: GameTheme;
  onBack: () => void;
  extraActions?: React.ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  theme,
  onBack,
  extraActions,
}) => {
  const t = getTheme(theme);
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between border-b border-white/6 px-4 py-2.5"
      style={{
        background: 'rgba(11, 9, 21, 0.75)',
        backdropFilter: 'blur(var(--blur-overlay))',
        WebkitBackdropFilter: 'blur(var(--blur-overlay))',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-premium-sm flex h-8 w-8 items-center justify-center border ${t.headerTheme} bg-white/5`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm leading-none font-black tracking-tight text-white uppercase italic">
            {title}
          </h2>
          <p className="text-micro mt-0.75 font-black tracking-[0.18em] text-white/35 uppercase">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {extraActions}
        <button
          onClick={onBack}
          className="rounded-premium-sm flex h-12 w-12 items-center justify-center border border-white/8 bg-white/6 text-white/50 transition-all hover:bg-white/[0.10] hover:text-white/80 active:scale-90"
        >
          <Home className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
