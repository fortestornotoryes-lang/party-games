import React from 'react';
import { motion } from 'motion/react';
import { TabooClassicCard } from '@/constants/tabooContent';
import { StopGameButton } from '@/components/StopGameButton';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';

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
    className="flex flex-col p-6 gap-6 max-w-lg mx-auto w-full"
  >
    {/* Word reveal */}
    <div className="text-center space-y-2 pt-2">
      {timedOut && (
        <p className="text-[9px] font-black uppercase tracking-widest text-premium-red/70">
          {t(`${NS.TABOO}.timeOut`)}
        </p>
      )}
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
        {t(`${NS.TABOO}.wordToGuess`)}
      </p>
      <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
        {card.word}
      </h2>
    </div>

    {/* Forbidden words reminder */}
    <div className="p-4 rounded-2xl border border-premium-red/20 bg-premium-red/5">
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-premium-red/50 mb-2 text-center">
        {t(`${NS.TABOO}.forbiddenWords`)}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {card.forbidden.map((w, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-xl border border-premium-red/30 bg-premium-red/10 text-[11px] font-black italic uppercase text-premium-red/70"
          >
            {w}
          </span>
        ))}
      </div>
    </div>

    <div className="border-t border-white/10" />

    {/* Who guessed? */}
    <div className="space-y-3">
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 text-center">
        {t(`${NS.TABOO}.whoGuessed`)}
      </p>

      {otherPlayers.map(player => (
        <button
          key={player}
          onClick={() => onVerdict(player)}
          className="w-full p-4 bg-premium-green/10 border-2 border-premium-green/40 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
        >
          <p className="font-black italic text-premium-green text-base">
            {player}
          </p>
          <span className="text-3xl font-black italic text-premium-green ml-4">
            +1
          </span>
        </button>
      ))}

      <button
        onClick={() => onVerdict(null)}
        className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
      >
        <p className="font-black italic text-white/50 text-base">{t(`${NS.TABOO}.noOneGuessed`)}</p>
        <span className="text-3xl font-black italic text-white/30 ml-4">0</span>
      </button>

      <button
        onClick={() => onVerdict(null, true)}
        className="w-full p-4 bg-premium-red/10 border-2 border-premium-red/30 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
      >
        <div className="text-left">
          <p className="font-black italic text-premium-red text-base leading-tight">
            {t(`${NS.TABOO}.saidForbidden`, { player: currentExplainer })}
          </p>
          <p className="text-[10px] text-white/30 mt-0.5">{t(`${NS.TABOO}.penaltyHint`)}</p>
        </div>
        <span className="text-3xl font-black italic text-premium-red ml-4">−1</span>
      </button>
    </div>

    <div className="border-t border-white/10" />

    <StopGameButton onClick={onStopGame} />
  </motion.div>
  );
};
