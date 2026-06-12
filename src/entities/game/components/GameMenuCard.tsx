import { HelpCircle, Users } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { GameMetadata } from '../types';

import { getTheme } from '@/shared/theme/colors';

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
      className="rounded-r-premium-2xl shadow-card2 group relative flex w-full items-center gap-4 overflow-hidden border border-white/8 bg-white/[0.035] p-4 text-left transition-all duration-300 hover:border-white/12 hover:bg-white/6"
    >
      {/* Background image (optional, per-game) — right-anchored with left fade */}
      {!!game.backgroundImage && (
        <img
          src={game.backgroundImage}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-full w-auto max-w-[105%] object-contain object-right opacity-90 transition-opacity duration-300"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 65%)' }}
        />
      )}

      {/* Left color accent bar */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1.25 rounded-r-full ${t.solid} opacity-75`}
      />

      {/* Icon */}
      <div
        className={`rounded-premium-md h-13 w-13 ${t.solid} relative ml-2.5 flex shrink-0 items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/25" />
        <Icon className="relative z-10 h-5.5 w-5.5 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-w-0 flex-1">
        <h3 className="mb-1.5 text-lg leading-none font-black tracking-widest text-white uppercase italic">
          {game.title}
        </h3>
        <p className="mb-2.5 pr-1 text-xs leading-snug font-medium text-white/45">
          {game.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-premium-sm inline-flex items-center gap-1.5 px-2.5 py-1.25 ${t.bg10} ${t.text} text-micro border border-current/25 font-black tracking-[0.15em] uppercase`}
          >
            <Users className="h-2.5 w-2.5" />
            {game.players}
          </span>
          {!!countDisplay && (
            <span className="rounded-premium-sm text-micro inline-flex items-center border border-white/6 bg-white/4 px-2.5 py-1.25 font-black tracking-[0.12em] text-white/25 uppercase">
              {countDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Right side: ? button */}
      <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">
        {!!game.description && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDescriptionClick();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/4 text-white/20 transition-all hover:border-white/20 hover:text-white/60 active:scale-90"
          >
            <HelpCircle className="h-6 w-6" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
