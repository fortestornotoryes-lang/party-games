import React from 'react';
import { motion } from 'motion/react';
import { Home, HelpCircle, LucideIcon } from 'lucide-react';

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
        <div className="flex-shrink-0 px-4 py-3 bg-[#0a0502]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${themeColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-base font-black uppercase italic tracking-tighter leading-none inline-block">
                        {title}
                    </h2>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
                        {subtitle}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {extraActions}
                {onShowInstructions && (
                    <button onClick={onShowInstructions} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                )}
                <button onClick={onBack} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                    <Home className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
