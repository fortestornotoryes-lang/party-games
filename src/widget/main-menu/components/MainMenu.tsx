import { BarChart3, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { BunkerBalanceView } from '@/debug/BunkerBalanceView';
import { GameMenuCard } from '@/entities/game/components/GameMenuCard';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import type { GameKey } from '@/entities/game/types';
import { contentService } from '@/features/word-stats/model/contentService';
import { getTheme } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface MainMenuProps {
  onSelectGame: (gameId: GameKey) => void;
}

const GAMES = Object.values(GAMES_REGISTRY);

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  const { setCurrentGameId } = useGameSettings();
  const [descriptionGameId, setDescriptionGameId] = useState<GameKey | null>(null);
  const [showBalance, setShowBalance] = useState<boolean>(false);

  useEffect(() => {
    setCurrentGameId(null);
  }, []);

  const getGameStats = (gameId: GameKey) => {
    const stats = contentService.getWordStats(gameId, DIFFICULTY.MEDIUM);
    return stats.total > 0 ? stats : null;
  };

  const descriptionGame = descriptionGameId ? GAMES_REGISTRY[descriptionGameId] : null;

  return (
    <div className="relative flex min-h-screen flex-col items-center px-5 pt-6 pb-28">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 px-4 text-center"
        >
          <h1 className="text-logo font-display mb-3 leading-[0.72] font-black tracking-tighter uppercase italic select-none">
            PARTY{' '}
            <span
              className="text-premium-red"
              style={{ textShadow: '0 0 32px rgba(255,46,77,0.45)' }}
            >
              HUB
            </span>
          </h1>
          <p className="text-micro font-black tracking-[0.5em] text-white/20 uppercase italic">
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
                onSelect={() => {
                  onSelectGame(game.id);
                }}
                onDescriptionClick={() => {
                  setDescriptionGameId(game.id);
                }}
              />
            );
          })}
        </div>

        {/* Balance debug button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => {
            setShowBalance(true);
          }}
          className="mx-auto mt-6 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black tracking-widest uppercase transition-all active:scale-95"
          style={{
            background: 'rgba(255,138,31,0.07)',
            border: '1px solid rgba(255,138,31,0.18)',
            color: 'rgba(255,138,31,0.55)',
          }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Баланс · Бункер
        </motion.button>
      </div>

      {/* Balance view overlay */}
      <AnimatePresence>
        {showBalance && (
          <BunkerBalanceView
            key="balance"
            onClose={() => {
              setShowBalance(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Description bottom sheet */}
      <AnimatePresence>
        {!!descriptionGame &&
          (() => {
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
                  onClick={() => {
                    setDescriptionGameId(null);
                  }}
                  className="fixed inset-0 z-40 bg-black/60"
                  style={{ backdropFilter: 'blur(var(--blur-backdrop))' }}
                />

                {/* Sheet */}
                <motion.div
                  key="sheet"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md px-4 pb-8"
                >
                  <div
                    className="rounded-premium-xl overflow-hidden border border-white/8"
                    style={{
                      background:
                        'linear-gradient(160deg, rgba(20,20,25,0.97) 0%, rgba(10,10,12,0.99) 100%)',
                      backdropFilter: 'blur(var(--blur-modal))',
                      boxShadow: '0 -8px 48px rgba(0,0,0,0.5), var(--shadow-rim)',
                    }}
                  >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-0">
                      <div className="h-1 w-10 rounded-full bg-white/10" />
                    </div>

                    <div className="space-y-5 px-6 pt-4 pb-6">
                      {/* Header */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-premium-md h-12 w-12 ${t.solid} relative flex shrink-0 items-center justify-center overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                          <Icon className="relative z-10 h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-lg font-black tracking-tight uppercase italic ${t.text}`}
                          >
                            {descriptionGame.title}
                          </h3>
                          <p className="text-label mt-0.5 font-medium text-white/35">
                            {descriptionGame.subtitle}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setDescriptionGameId(null);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/30 transition-colors hover:text-white/60 active:scale-90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Description */}
                      <div className={`rounded-premium-md border p-4 ${t.border20} ${t.bg5}`}>
                        <p className="text-card leading-relaxed font-medium text-white/70">
                          {descriptionGame.description}
                        </p>
                      </div>

                      {/* Info row */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-premium-sm inline-flex items-center gap-1.5 px-3 py-1.5 ${t.bg10} ${t.text} text-micro border border-current/25 font-black tracking-[0.15em] uppercase`}
                        >
                          <Users className="h-2.5 w-2.5" />
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
                        className={`rounded-premium-md text-card w-full py-4 font-black tracking-[0.15em] text-black uppercase ${t.solid} transition-transform active:scale-[0.98]`}
                        style={{ boxShadow: 'var(--shadow-button)' }}
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
