import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X } from 'lucide-react';

import { useGameSettings } from '../contexts/GameSettingsContext';
import { contentService } from '../services/contentService';
import { GameKey } from '../types/games';
import { GAMES_REGISTRY } from '../registry/GameRegistry';
import { getTheme } from '../theme/colors';
import { GameMenuCard } from './GameMenuCard';

interface MainMenuProps {
    onSelectGame: (gameId: GameKey) => void;
}

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
                        const stats = getGameStats(game.id);
                        const countDisplay = stats ? `${stats.remaining} / ${stats.total}` : null;

                        return (
                            <GameMenuCard
                                key={game.id}
                                game={game}
                                index={index}
                                countDisplay={countDisplay}
                                onSelect={() => onSelectGame(game.id)}
                                onDescriptionClick={() => setDescriptionGameId(game.id)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Description bottom sheet */}
            <AnimatePresence>
                {descriptionGame && (() => {
                    const Icon = descriptionGame.icon;
                    const t = getTheme(descriptionGame.theme);
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
                                    className="rounded-[28px] overflow-hidden border border-white/8"
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
                                            <div className={`w-12 h-12 rounded-premium-md ${t.solid} flex items-center justify-center relative overflow-hidden shrink-0`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                                                <Icon className="w-5 h-5 text-white relative z-10" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-[18px] font-black italic uppercase tracking-tight ${t.text}`}>
                                                    {descriptionGame.title}
                                                </h3>
                                                <p className="text-[11px] text-white/35 font-medium mt-0.5">{descriptionGame.subtitle}</p>
                                            </div>
                                            <button
                                                onClick={() => setDescriptionGameId(null)}
                                                className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors active:scale-90"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <div className={`rounded-2xl border p-4 ${t.border20} ${t.bg5}`}>
                                            <p className="text-[13px] text-white/70 font-medium leading-relaxed">
                                                {descriptionGame.description}
                                            </p>
                                        </div>

                                        {/* Info row */}
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-premium-sm ${t.bg10} ${t.text} border border-current/25 text-[9px] font-black uppercase tracking-[0.15em]`}>
                                                <Users className="w-2.5 h-2.5" />
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
                                            className={`w-full py-4 rounded-premium-md font-black uppercase tracking-[0.15em] text-[13px] text-black ${t.solid} active:scale-[0.98] transition-transform`}
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
