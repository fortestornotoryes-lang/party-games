import { motion } from 'motion/react';
import React from 'react';

import { StopGameButton } from '@/components/StopGameButton';
import type { TabooClassicCard } from '@/constants/tabooContent';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface VerdictPhaseProps {
  card: TabooClassicCard;
  timedOut: boolean;
  currentExplainer: string;
  otherPlayers: string[];
  onVerdict: (guesser: string | null, penalty?: boolean) => void;
  onStopGame: () => void;
}

export const VerdictPhase: React.FC<VerdictPhaseProps> = ({
  card,
  timedOut,
  currentExplainer,
  otherPlayers,
  onVerdict,
  onStopGame,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="verdict"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6"
    >
      {/* Word reveal */}
      <div className="space-y-2 pt-2 text-center">
        {!!timedOut && (
          <p className="text-micro text-premium-red/70 font-black tracking-widest uppercase">
            {t(`${NS.TABOO}.timeOut`)}
          </p>
        )}
        <p className="text-micro font-black tracking-[0.4em] text-white/30 uppercase">
          {t(`${NS.TABOO}.wordToGuess`)}
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          {card.word}
        </h2>
      </div>

      {/* Forbidden words reminder */}
      <div className="rounded-premium-md border-premium-red/20 bg-premium-red/5 border p-4">
        <p className="text-micro text-premium-red/50 mb-2 text-center font-black tracking-[0.4em] uppercase">
          {t(`${NS.TABOO}.forbiddenWords`)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {card.forbidden.map((w, i) => (
            <span
              key={i}
              className="rounded-premium-sm border-premium-red/30 bg-premium-red/10 text-label text-premium-red/70 border px-3 py-1 font-black uppercase italic"
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10" />

      {/* Who guessed? */}
      <div className="space-y-3">
        <p className="text-micro text-center font-black tracking-[0.4em] text-white/30 uppercase">
          {t(`${NS.TABOO}.whoGuessed`)}
        </p>

        {otherPlayers.map((player) => (
          <button
            key={player}
            onClick={() => {
              onVerdict(player);
            }}
            className="bg-premium-green/10 border-premium-green/40 rounded-premium-md flex w-full items-center justify-between border-2 p-4 transition-all active:scale-95"
          >
            <p className="text-premium-green text-base font-black italic">{player}</p>
            <span className="text-premium-green ml-4 text-3xl font-black italic">+1</span>
          </button>
        ))}

        <button
          onClick={() => {
            onVerdict(null);
          }}
          className="rounded-premium-md flex w-full items-center justify-between border-2 border-white/10 bg-white/5 p-4 transition-all active:scale-95"
        >
          <p className="text-base font-black text-white/50 italic">
            {t(`${NS.TABOO}.noOneGuessed`)}
          </p>
          <span className="ml-4 text-3xl font-black text-white/30 italic">0</span>
        </button>

        <button
          onClick={() => {
            onVerdict(null, true);
          }}
          className="bg-premium-red/10 border-premium-red/30 rounded-premium-md flex w-full items-center justify-between border-2 p-4 transition-all active:scale-95"
        >
          <div className="text-left">
            <p className="text-premium-red text-base leading-tight font-black italic">
              {t(`${NS.TABOO}.saidForbidden`, { player: currentExplainer })}
            </p>
            <p className="text-tag mt-0.5 text-white/30">{t(`${NS.TABOO}.penaltyHint`)}</p>
          </div>
          <span className="text-premium-red ml-4 text-3xl font-black italic">−1</span>
        </button>
      </div>

      <div className="border-t border-white/10" />

      <StopGameButton onClick={onStopGame} />
    </motion.div>
  );
};
