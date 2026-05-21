import React from 'react';
import { motion } from 'motion/react';
import { Users, HelpCircle } from 'lucide-react';
import { getTheme } from '../theme/colors';
import { GameMetadata } from '../types/games';

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.08 + index * 0.04,
                duration: 0.28,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileTap={{ scale: 0.975 }}
            onClick={onSelect}
            className="w-full p-4 rounded-r-[20px] flex items-center gap-4 text-left relative overflow-hidden
                transition-all duration-300 group
                bg-white/[0.035] border border-white/[0.07]
                hover:bg-white/[0.06] hover:border-white/[0.12]"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
            {/* Background image (optional, per-game) */}
            {game.backgroundImage && (
                <img
                    src={game.backgroundImage}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300 scale-[1.04] group-hover:scale-100 pointer-events-none"
                />
            )}

            {/* Left color accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[5px] rounded-r-full ${t.solid} opacity-75`} />

            {/* Icon */}
            <div className={`w-[52px] h-[52px] rounded-[16px] ${t.solid} flex items-center justify-center relative overflow-hidden shrink-0 ml-2.5`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/25" />
                <Icon className="w-[22px] h-[22px] text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-[17px] font-black italic uppercase tracking-tight leading-none mb-1.5 text-white">
                    {game.title}
                </h3>
                <p className="text-[12px] text-white/45 font-medium leading-snug mb-2.5 pr-1">
                    {game.subtitle}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[8px] ${t.bg10} ${t.text} border border-current/25 text-[9px] font-black uppercase tracking-[0.15em]`}>
                        <Users className="w-[10px] h-[10px]" />
                        {game.players}
                    </span>
                    {countDisplay && (
                        <span className="inline-flex items-center px-2.5 py-[5px] rounded-[8px] bg-white/[0.04] text-white/25 border border-white/[0.06] text-[9px] font-black uppercase tracking-[0.12em]">
                            {countDisplay}
                        </span>
                    )}
                </div>
            </div>

            {/* Right side: ? button */}
            <div className="flex flex-col items-center gap-2 shrink-0 relative z-10">
                {game.description && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDescriptionClick();
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all
                            bg-white/4 border border-white/8 text-white/20
                            hover:text-white/60 hover:border-white/20 active:scale-90"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
