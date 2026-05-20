import React from 'react';
import { Home, LucideIcon } from 'lucide-react';
import {PrimaryButton} from "@/components/UI.tsx";

interface GameHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  themeColor: string;
  onBack: () => void;
  extraActions?: React.ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  themeColor,
  onBack,
  extraActions,
}) => {
  return (
    <div
      className="sticky top-0 z-30 px-4 py-2.5 border-b border-white/6 flex items-center justify-between"
      style={{
        background: 'rgba(11, 9, 21, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center border ${themeColor} bg-white/5`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-[14px] font-black uppercase italic tracking-tight leading-none text-white">
            {title}
          </h2>
          <p className="text-[9px] text-white/35 uppercase tracking-[0.18em] font-black mt-0.75">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {extraActions}
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-premium-sm bg-white/6 border border-white/8 text-white/50 flex items-center justify-center active:scale-90 transition-all hover:bg-white/[0.10] hover:text-white/80"
        >
          <Home className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
