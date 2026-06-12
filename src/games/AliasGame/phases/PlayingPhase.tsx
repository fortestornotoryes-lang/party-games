import { CheckCircle, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const CIRCUMFERENCE = 2 * Math.PI * 28;

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface PlayingPhaseProps {
  currentWord: string;
  roundScore: number;
  timeLeft: number;
  roundTime: number;
  onCorrect: () => void;
  onSkip: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  currentWord,
  roundScore,
  timeLeft,
  roundTime,
  onCorrect,
  onSkip,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col"
    >
      <div className="flex justify-center pt-5 pb-1">
        <div className="relative h-16 w-16">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={timeLeft <= 10 ? 'var(--color-premium-red)' : 'var(--color-premium-sky)'}
              strokeWidth="3"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / roundTime}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-xl font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white'}`}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 30, scale: 0.84 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="space-y-2"
          >
            <p className="text-micro text-premium-sky/35 font-black tracking-[0.5em] uppercase">
              {t(`${NS.ALIAS}.explainWord`)}
            </p>
            <h2 className="text-6xl leading-none font-black tracking-tighter wrap-break-word text-white uppercase italic">
              {currentWord}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-3 text-center">
        <span className="text-micro font-black tracking-[0.3em] text-white/20 uppercase">
          {t(`${NS.ALIAS}.scoreLabel`)}:{' '}
        </span>
        <span
          className={`text-micro font-black tracking-[0.3em] uppercase ${roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'}`}
        >
          {fmtScore(roundScore)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-8">
        <button
          onClick={onSkip}
          className="rounded-premium-lg bg-premium-red/[0.07] border-premium-red/20 active:bg-premium-red/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-all active:scale-95"
        >
          <XCircle className="text-premium-red h-8 w-8" />
          <span className="text-micro text-premium-red/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.COMMON}.skip`)}
          </span>
        </button>
        <button
          onClick={onCorrect}
          className="rounded-premium-lg bg-premium-green/[0.07] border-premium-green/20 active:bg-premium-green/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-all active:scale-95"
        >
          <CheckCircle className="text-premium-green h-8 w-8" />
          <span className="text-micro text-premium-green/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.ALIAS}.guessed`)}
          </span>
        </button>
      </div>
    </motion.div>
  );
};
