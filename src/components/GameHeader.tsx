import type {LucideIcon} from 'lucide-react';
import {Home} from 'lucide-react';
import React from 'react';

import {getTheme} from '@/shared/theme/colors';
import type {GameTheme} from '@/shared/types';


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
            className="sticky top-0 z-30 px-4 py-2.5 border-b border-white/6 flex items-center justify-between"
            style={{
                background: 'rgba(11, 9, 21, 0.75)',
                backdropFilter: 'blur(var(--blur-overlay))',
                WebkitBackdropFilter: 'blur(var(--blur-overlay))',
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-8 h-8 rounded-premium-sm flex items-center justify-center border ${t.headerTheme} bg-white/5`}
                >
                    <Icon className="w-4 h-4"/>
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase italic tracking-tight leading-none text-white ">
                        {title}
                    </h2>
                    <p className="text-micro text-white/35 uppercase tracking-[0.18em] font-black mt-0.75">
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
                    <Home className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};
