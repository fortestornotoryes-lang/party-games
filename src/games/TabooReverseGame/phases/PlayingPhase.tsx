import { SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { TabooCard } from '../content';

import { PlayingHeader } from '@/components/PlayingHeader';
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
  card: TabooCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  isBlitz?: boolean;
  blitzStats?: { guessed: number; skipped: number };
  onGuessed: () => void;
  onSkip?: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  isBlitz,
  blitzStats,
  onGuessed,
  onSkip,
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

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
        <PlayingHeader
          explainer={currentExplainer}
          timeLeft={timeLeft}
          timerColor={timerColor}
          extra={
            !!isBlitz &&
            !!blitzStats && (
              <div className="flex items-center gap-2">
                <span className="text-label text-premium-green font-black tabular-nums">
                  ✓{blitzStats.guessed}
                </span>
                <span className="text-label text-premium-red font-black tabular-nums">
                  ✗{blitzStats.skipped}
                </span>
              </div>
            )
          }
        />

        {/* Secret word */}
        <div className="rounded-premium-2xl border-premium-orange/30 bg-premium-orange/5 border-2 p-8 text-center">
          <p className="text-micro text-premium-orange/50 mb-3 font-black tracking-[0.5em] uppercase">
            {t(`${NS.TABOO_REVERSE}.secretWord`)}
          </p>
          <h2
            className="leading-tight font-black tracking-tighter wrap-break-word text-white uppercase italic"
            style={{ fontSize: wordFontSize(card.word) }}
          >
            {card.word}
          </h2>
        </div>

        {/* Required words */}
        <div>
          <p className="text-micro mb-3 text-center font-black tracking-[0.4em] text-white/30 uppercase">
            {t(`${NS.TABOO_REVERSE}.requiredWords`)}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {card.required.map((w, i) => (
              <div
                key={i}
                className="rounded-premium-md border-premium-orange/30 bg-premium-orange/10 text-premium-orange border px-4 py-2.5 text-sm font-black uppercase italic"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-auto space-y-3 pt-4">
          {isBlitz ? (
            /* Blitz: two buttons side by side */
            <div className="flex gap-3">
              <PrimaryButton
                onClick={onGuessed}
                className="bg-premium-green! shadow-premium-green/30 flex-1 text-white!"
              >
                {t(`${NS.TABOO_REVERSE}.guessed`)}
              </PrimaryButton>
              <button
                onClick={onSkip}
                className="rounded-premium-lg glass-card flex items-center justify-center gap-2 border border-white/10 px-5 py-4 text-white/50 transition-all active:scale-95"
              >
                <SkipForward className="h-5 w-5" />
                <span className="text-label font-black tracking-wider uppercase">−1</span>
              </button>
            </div>
          ) : (
            /* Classic / team: single button */
            <PrimaryButton
              onClick={onGuessed}
              className="bg-premium-orange shadow-premium-orange/30 text-white!"
            >
              {t(`${NS.TABOO_REVERSE}.wordGuessed`)}
            </PrimaryButton>
          )}

          <p className="text-micro text-center font-black tracking-widest text-white/20 uppercase">
            {isBlitz
              ? t(`${NS.TABOO_REVERSE}.skipPenaltyHint`)
              : t(`${NS.TABOO_REVERSE}.noWordAllowed`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
