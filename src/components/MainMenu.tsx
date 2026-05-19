import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronRight, HelpCircle, X } from 'lucide-react';

import { useGameSettings } from '../contexts/GameSettingsContext';
import { contentService } from '../services/contentService';
import { GameKey } from '../types/games';
import { GAMES_REGISTRY } from '../registry/GameRegistry';

interface MainMenuProps {
    onSelectGame: (gameId: GameKey) => void;
}

const themeConfigs = {
    'premium-red': {
        iconBg: 'bg-premium-red',
        accentBg: 'bg-premium-red/10',
        accentText: 'text-premium-red',
        barColor: 'bg-premium-red',
        sheetAccent: 'text-premium-red',
        sheetBorder: 'border-premium-red/20',
        sheetBg: 'bg-premium-red/5',
    },
    'premium-sky': {
        iconBg: 'bg-premium-sky',
        accentBg: 'bg-premium-sky/10',
        accentText: 'text-premium-sky',
        barColor: 'bg-premium-sky',
        sheetAccent: 'text-premium-sky',
        sheetBorder: 'border-premium-sky/20',
        sheetBg: 'bg-premium-sky/5',
    },
    'premium-green': {
        iconBg: 'bg-premium-green',
        accentBg: 'bg-premium-green/10',
        accentText: 'text-premium-green',
        barColor: 'bg-premium-green',
        sheetAccent: 'text-premium-green',
        sheetBorder: 'border-premium-green/20',
        sheetBg: 'bg-premium-green/5',
    },
    'premium-blue': {
        iconBg: 'bg-premium-blue',
        accentBg: 'bg-premium-blue/10',
        accentText: 'text-premium-blue',
        barColor: 'bg-premium-blue',
        sheetAccent: 'text-premium-blue',
        sheetBorder: 'border-premium-blue/20',
        sheetBg: 'bg-premium-blue/5',
    },
    'premium-orange': {
        iconBg: 'bg-premium-orange',
        accentBg: 'bg-premium-orange/10',
        accentText: 'text-premium-orange',
        barColor: 'bg-premium-orange',
        sheetAccent: 'text-premium-orange',
        sheetBorder: 'border-premium-orange/20',
        sheetBg: 'bg-premium-orange/5',
    },
    'premium-purple': {
        iconBg: 'bg-premium-purple',
        accentBg: 'bg-premium-purple/10',
        accentText: 'text-premium-purple',
        barColor: 'bg-premium-purple',
        sheetAccent: 'text-premium-purple',
        sheetBorder: 'border-premium-purple/20',
        sheetBg: 'bg-premium-purple/5',
    },
    'premium-yellow': {
        iconBg: 'bg-premium-yellow',
        accentBg: 'bg-premium-yellow/10',
        accentText: 'text-premium-yellow',
        barColor: 'bg-premium-yellow',
        sheetAccent: 'text-premium-yellow',
        sheetBorder: 'border-premium-yellow/20',
        sheetBg: 'bg-premium-yellow/5',
    },
} as const;

const getThemeConfig = (theme: string) => {
    const key = `premium-${theme}` as keyof typeof themeConfigs;
    return themeConfigs[key] || themeConfigs['premium-red'];
};

const GAMES = Object.values(GAMES_REGISTRY);

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
    const { setCurrentGameId } = useGameSettings();
    const [descriptionGameId, setDescriptionGameId] = useState<GameKey | null>(null);

    useEffect(() => {
        setCurrentGameId(null);
    }, []);

    const getGameStats = (gameId: GameKey) => {
        const stats = contentService.getWordStats(gameId, 'medium');
        return stats.total > 0 ? stats : null;
    };

    const descriptionGame = descriptionGameId ? GAMES_REGISTRY[descriptionGameId] : null;

    return (
        <div className="min-h-screen pt-6 pb-28 px-5 relative flex flex-col items-center">
            <div className="w-full max-w-md relative z-10">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center px-4 mb-10"
                >
                    <h1 className="text-[56px] font-black italic tracking-tighter uppercase leading-[0.72] mb-3 select-none font-display">
                        PARTY{' '}
                        <span
                            className="text-premium-red"
                            style={{ textShadow: '0 0 32px rgba(255,46,77,0.45)' }}
                        >
                            HUB
                        </span>
                    </h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
                        {GAMES.length} ИГР · ВЕЧЕРИНКА НАЧИНАЕТСЯ
                    </p>
                </motion.div>

                {/* Game List */}
                <div className="space-y-3">
                    {GAMES.map((game, index) => {
                        const Icon = game.icon;
                        const stats = getGameStats(game.id);
                        const themeCfg = getThemeConfig(game.theme);
                        const countDisplay = stats ? `${stats.remaining} / ${stats.total}` : null;

                        return (
                            <motion.button
                                key={game.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.08 + index * 0.04,
                                    duration: 0.28,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                whileTap={{ scale: 0.975 }}
                                onClick={() => onSelectGame(game.id)}
                                className="w-full p-4 rounded-[20px] flex items-center gap-4 text-left relative overflow-hidden
                                    transition-all duration-300 group
                                    bg-white/[0.035] border border-white/[0.07]
                                    hover:bg-white/[0.06] hover:border-white/[0.12]"
                                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
                            >
                                {/* Left color accent bar */}
                                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${themeCfg.barColor} opacity-75`} />

                                {/* Icon */}
                                <div className={`w-[52px] h-[52px] rounded-[16px] ${themeCfg.iconBg} flex items-center justify-center relative overflow-hidden shrink-0 ml-2.5`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/25" />
                                    <Icon className="w-[22px] h-[22px] text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[17px] font-black italic uppercase tracking-tight leading-none mb-1.5 text-white">
                                        {game.title}
                                    </h3>
                                    <p className="text-[12px] text-white/45 font-medium leading-snug mb-2.5 pr-1">
                                        {game.subtitle}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[8px] ${themeCfg.accentBg} ${themeCfg.accentText} border border-current/25 text-[9px] font-black uppercase tracking-[0.15em]`}>
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

                                {/* Right side: ? + arrow */}
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    {game.description && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDescriptionGameId(game.id);
                                            }}
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all
                                                bg-white/[0.04] border border-white/[0.08] text-white/20
                                                hover:text-white/60 hover:border-white/20 active:scale-90"
                                        >
                                            <HelpCircle className="w-6 h-6" />
                                        </button>
                                    )}
                                    {/*<ChevronRight className="w-[14px] h-[14px] text-white/15 transition-all duration-300 group-hover:text-white/35 group-hover:translate-x-0.5" />*/}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Description bottom sheet */}
            <AnimatePresence>
                {descriptionGame && (() => {
                    const Icon = descriptionGame.icon;
                    const themeCfg = getThemeConfig(descriptionGame.theme);
                    return (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setDescriptionGameId(null)}
                                className="fixed inset-0 z-40 bg-black/60"
                                style={{ backdropFilter: 'blur(4px)' }}
                            />

                            {/* Sheet */}
                            <motion.div
                                key="sheet"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                                className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-8"
                            >
                                <div
                                    className="rounded-[28px] overflow-hidden border border-white/[0.08]"
                                    style={{
                                        background: 'linear-gradient(160deg, rgba(20,20,25,0.97) 0%, rgba(10,10,12,0.99) 100%)',
                                        backdropFilter: 'blur(32px)',
                                        boxShadow: '0 -8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                                    }}
                                >
                                    {/* Drag handle */}
                                    <div className="flex justify-center pt-3 pb-0">
                                        <div className="w-10 h-1 rounded-full bg-white/10" />
                                    </div>

                                    <div className="px-6 pb-6 pt-4 space-y-5">
                                        {/* Header */}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[14px] ${themeCfg.iconBg} flex items-center justify-center relative overflow-hidden shrink-0`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                                                <Icon className="w-5 h-5 text-white relative z-10" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-[18px] font-black italic uppercase tracking-tight ${themeCfg.sheetAccent}`}>
                                                    {descriptionGame.title}
                                                </h3>
                                                <p className="text-[11px] text-white/35 font-medium mt-0.5">{descriptionGame.subtitle}</p>
                                            </div>
                                            <button
                                                onClick={() => setDescriptionGameId(null)}
                                                className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors active:scale-90"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <div className={`rounded-2xl border p-4 ${themeCfg.sheetBorder} ${themeCfg.sheetBg}`}>
                                            <p className="text-[13px] text-white/70 font-medium leading-relaxed">
                                                {descriptionGame.description}
                                            </p>
                                        </div>

                                        {/* Info row */}
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] ${themeCfg.accentBg} ${themeCfg.accentText} border border-current/25 text-[9px] font-black uppercase tracking-[0.15em]`}>
                                                <Users className="w-[10px] h-[10px]" />
                                                {descriptionGame.players} игроков
                                            </span>
                                        </div>

                                        {/* Play button */}
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setDescriptionGameId(null);
                                                onSelectGame(descriptionGame.id);
                                            }}
                                            className={`w-full py-4 rounded-[18px] font-black uppercase tracking-[0.15em] text-[13px] text-black ${themeCfg.iconBg} active:scale-[0.98] transition-transform`}
                                            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                                        >
                                            Играть
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};
