import {HelpCircle, Users} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import type {GameMetadata} from '../types/games';

import {getTheme} from '@/shared/theme/colors';

interface GameMenuCardProps {
    game: GameMetadata;
    index: number;
    countDisplay: string | null;
    onSelect: () => void;
    onDescriptionClick: () => void;
}

export const GameMenuCard: React.FC<GameMenuCardProps> = ({
                                                              game,
                                                              index,
                                                              countDisplay,
                                                              onSelect,
                                                              onDescriptionClick,
                                                          }) => {
    const Icon = game.icon;
    const t = getTheme(game.theme);

    return (
        <motion.div
            key={game.id}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{
                delay: 0.08 + index * 0.04,
                duration: 0.28,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileTap={{scale: 0.975}}
            onClick={onSelect}
            className="w-full p-4 rounded-r-premium-2xl flex items-center gap-4 text-left relative overflow-hidden shadow-card2
                transition-all duration-300 group
                bg-white/[0.035] border border-white/8
                hover:bg-white/6 hover:border-white/12"
        >
            {/* Background image (optional, per-game) — right-anchored with left fade */}
            {!!game.backgroundImage && (
                <img
                    src={game.backgroundImage}
                    alt=""
                    aria-hidden
                    className="absolute right-0 top-0 h-full w-auto max-w-[105%] object-contain object-right opacity-90 transition-opacity duration-300 pointer-events-none"
                    style={{maskImage: 'linear-gradient(to right, transparent 0%, black 65%)'}}
                />
            )}

            {/* Left color accent bar */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1.25 rounded-r-full ${t.solid} opacity-75`}
            />

            {/* Icon */}
            <div
                className={`w-13 h-13 rounded-premium-md ${t.solid} flex items-center justify-center relative overflow-hidden shrink-0 ml-2.5`}
            >
                <div className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent"/>
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/25"/>
                <Icon
                    className="w-5.5 h-5.5 text-white relative z-10 transition-transform duration-300 group-hover:scale-110"/>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-lg font-black italic uppercase tracking-widest leading-none mb-1.5 text-white">
                    {game.title}
                </h3>
                <p className="text-xs text-white/45 font-medium leading-snug mb-2.5 pr-1">
                    {game.subtitle}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
          <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-premium-sm ${t.bg10} ${t.text} border border-current/25 text-micro font-black uppercase tracking-[0.15em]`}
          >
            <Users className="w-2.5 h-2.5"/>
              {game.players}
          </span>
                    {!!countDisplay && (
                        <span
                            className="inline-flex items-center px-2.5 py-1.25 rounded-premium-sm bg-white/4 text-white/25 border border-white/6 text-micro font-black uppercase tracking-[0.12em]">
              {countDisplay}
            </span>
                    )}
                </div>
            </div>

            {/* Right side: ? button */}
            <div className="flex flex-col items-center gap-2 shrink-0 relative z-10">
                {!!game.description && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDescriptionClick();
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all
                            bg-white/4 border border-white/8 text-white/20
                            hover:text-white/60 hover:border-white/20 active:scale-90"
                    >
                        <HelpCircle className="w-6 h-6"/>
                    </button>
                )}
            </div>
        </motion.div>
    );
};
