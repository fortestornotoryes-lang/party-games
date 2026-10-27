import { AlarmClock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { RoundWord, WordResult } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { PHASE_VARIANTS, SPRING } from '@/shared/theme/motion';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface RoundEndPhaseProps {
  roundScore: number;
  roundWords: RoundWord[];
  onWordResultChange: (index: number, result: WordResult) => void;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({
  roundScore,
  roundWords,
  onWordResultChange,
  onContinue,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="round_end"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full min-h-0 flex-col items-center gap-4 p-5 text-center"
    >
      <div className="shrink-0">
        <div className="mb-1 flex items-center justify-center gap-2 text-white/45">
          <AlarmClock className="h-5 w-5" />
          <p className="text-micro font-black tracking-[0.35em] uppercase">
            {t(`${NS.ALIAS}.timeUp`)}
          </p>
        </div>
        <motion.div
          key={roundScore}
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING.pop}
          className={`text-6xl leading-none font-black tracking-tighter italic tabular-nums ${
            roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
          }`}
        >
          {fmtScore(roundScore)}
        </motion.div>
        <p className="text-label mt-1 font-black tracking-tight text-white/45 uppercase italic">
          {t(`${NS.ALIAS}.pointsPerRound`)}
        </p>
      </div>

      <section className="rounded-premium-lg flex min-h-0 w-full flex-1 flex-col overflow-hidden border border-white/10 bg-white/[0.03] text-left">
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="text-label font-black tracking-widest text-white uppercase">
            {t(`${NS.ALIAS}.roundWords`)}
          </h3>
          <p className="text-label mt-1 text-white/45">{t(`${NS.ALIAS}.reviewHint`)}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
          {roundWords.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/45">
              {t(`${NS.ALIAS}.noRoundWords`)}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {roundWords.map((entry, index) => (
                <div
                  key={index}
                  className="rounded-premium-md border border-white/8 bg-black/20 px-3 py-3"
                >
                  <div className="mb-2 flex min-w-0 items-start justify-between gap-3">
                    <span className="min-w-0 text-sm leading-snug font-bold wrap-anywhere text-white">
                      <span className="mr-2 text-white/30">{index + 1}.</span>
                      {entry.word}
                    </span>
                    <span
                      className={`shrink-0 text-sm font-black tabular-nums ${
                        entry.result > 0
                          ? 'text-premium-green'
                          : entry.result < 0
                            ? 'text-premium-red'
                            : 'text-white/35'
                      }`}
                    >
                      {entry.result > 0 ? '+1' : entry.result < 0 ? '−1' : '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-pressed={entry.result === -1}
                      onClick={() => {
                        onWordResultChange(index, entry.result === -1 ? 0 : -1);
                      }}
                      className={`rounded-premium-sm flex min-h-11 items-center justify-center gap-1.5 border px-2 text-xs font-bold transition-colors ${
                        entry.result === -1
                          ? 'border-premium-red/60 bg-premium-red/20 text-premium-red'
                          : 'border-white/10 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      <XCircle className="h-4 w-4 shrink-0" />
                      {t(`${NS.COMMON}.skip`)}
                    </button>
                    <button
                      type="button"
                      aria-pressed={entry.result === 1}
                      onClick={() => {
                        onWordResultChange(index, entry.result === 1 ? 0 : 1);
                      }}
                      className={`rounded-premium-sm flex min-h-11 items-center justify-center gap-1.5 border px-2 text-xs font-bold transition-colors ${
                        entry.result === 1
                          ? 'border-premium-green/60 bg-premium-green/20 text-premium-green'
                          : 'border-white/10 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      {t(`${NS.ALIAS}.guessed`)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="w-full shrink-0">
        <PrimaryButton onClick={onContinue}>{t(`${NS.ALIAS}.continueBtn`)}</PrimaryButton>
      </div>
    </motion.div>
  );
};
