import React from 'react';
import { motion } from 'motion/react';
import { Home, HelpCircle, LucideIcon } from 'lucide-react';
import { ParallaxBackground } from './UI';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  themeColor: string;
  onBack: () => void;
  onShowInstructions?: () => void;
  extraActions?: React.ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  themeColor,
  onBack,
  onShowInstructions,
  extraActions
}) => {
  return (
    <div className="sticky top-0 z-30 px-4 py-3 border-b border-white/5 flex items-center justify-between overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <ParallaxBackground />
      </div>
      <div className="flex items-center space-x-3 relative z-10">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${themeColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black uppercase italic tracking-tighter leading-none inline-block">
            {title}
          </h2>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 relative z-10">
        {extraActions}
        {onShowInstructions && (
          <button onClick={onShowInstructions} className="p-2 bg-white/10 rounded-lg text-white hover:text-white transition-all active:scale-95 shadow-md">
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
        <button onClick={onBack} className="p-2 bg-white/10 rounded-lg text-white hover:text-white transition-all active:scale-95 shadow-md">
          <Home className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
