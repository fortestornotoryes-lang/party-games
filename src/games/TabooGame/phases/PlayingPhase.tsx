import { motion } from 'motion/react';
import React from 'react';

import type { TabooClassicCard } from '../content.ts';

import { PlayingHeader } from '@/shared/components/PlayingHeader.tsx';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TimerBar } from '@/shared/components/TimerBar';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

/** Плавное уменьшение шрифта по длине слова + перенос как запасной вариант */
const wordFontSize = (word: string): string => {
  const n = word.length;
  if (n <= 6) return '3.5rem';
  if (n <= 8) return '2.8rem';
  if (n <= 10) return '2.3rem';
  if (n <= 13) return '1.9rem';
  return '1.5rem';
};

interface PlayingPhaseProps {
  card: TabooClassicCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  onGuessed: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  onGuessed,
}) => {
  const { t } = useTranslation();
  const timerPct = (timeLeft / cardTimer) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#eab308' : '#ef4444';

  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex min-h-full flex-col"
    >
      <TimerBar pct={timerPct} color={timerColor} />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 p-6">
        <PlayingHeader explainer={currentExplainer} timeLeft={timeLeft} timerColor={timerColor} />

        {/* Forbidden words — shown first so explainer sees the constraints */}
        <div className="rounded-premium-lg border-premium-red/30 bg-premium-red/5 border-2 p-5">
          <p className="text-micro text-premium-red/60 mb-3 text-center font-black tracking-[0.5em] uppercase">
            🚫 {t(`${NS.TABOO}.forbiddenWords`)}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {card.forbidden.map((w, i) => (
              <div
                key={i}
                className="rounded-premium-md border-premium-red/40 bg-premium-red/10 text-premium-red border px-4 py-2 text-sm font-black uppercase italic"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Main word */}
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-premium-2xl w-full border-2 border-white/15 bg-white/5 p-8 text-center">
            <p className="text-micro mb-3 font-black tracking-[0.5em] text-white/30 uppercase">
              {t(`${NS.TABOO}.wordToGuess`)}
            </p>
            <h2
              className="leading-tight font-black tracking-tighter wrap-break-word text-white uppercase italic"
              style={{ fontSize: wordFontSize(card.word) }}
            >
              {card.word}
            </h2>
          </div>
        </div>

        {/* Action */}
        <div className="space-y-2">
          <PrimaryButton
            onClick={onGuessed}
            className="bg-premium-green! shadow-premium-green/30 text-white!"
          >
            {t(`${NS.TABOO}.wordGuessed`)}
          </PrimaryButton>
          <p className="text-micro text-center font-black tracking-widest text-white/20 uppercase">
            {t(`${NS.TABOO}.forbiddenHint`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
