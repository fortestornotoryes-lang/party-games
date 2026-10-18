import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { CROCODILE_LEVELS, LEVEL_STYLES, URGENT_SECONDS } from '../constants';
import { formatTime } from '../helpers';
import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const CIRCUMFERENCE = 2 * Math.PI * 28;

interface PlayingPhaseProps {
  chosen: WordOption;
  timeLeft: number;
  onGuessed: () => void;
  onGiveUp: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  chosen,
  timeLeft,
  onGuessed,
  onGiveUp,
}) => {
  const { t } = useTranslation();
  const { points, time } = CROCODILE_LEVELS[chosen.difficulty];
  const urgent = timeLeft <= URGENT_SECONDS;

  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col"
    >
      <div className="flex justify-center pt-5 pb-1">
        <div className="relative h-20 w-20">
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
              stroke={urgent ? 'var(--color-premium-red)' : 'var(--color-premium-lime)'}
              strokeWidth="3"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / time}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-lg font-black tabular-nums ${urgent ? 'text-premium-red animate-pulse' : 'text-white'}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="space-y-2">
          <p className="text-micro text-premium-lime/50 font-black tracking-[0.5em] uppercase">
            {t(`${NS.CROCODILE}.explainWord`)}
          </p>
          <FitText
            as="h2"
            className="text-6xl leading-none font-black tracking-tighter text-white uppercase italic"
          >
            {chosen.word}
          </FitText>
          <p
            className={`text-micro pt-2 font-black tracking-[0.3em] uppercase ${LEVEL_STYLES[chosen.difficulty].text}`}
          >
            {t(`${NS.CROCODILE}.pointsValue`, { n: points })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <button
          onClick={onGiveUp}
          className="rounded-premium-lg bg-premium-red/[0.07] border-premium-red/20 active:bg-premium-red/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-all active:scale-95"
        >
          <XCircle className="text-premium-red h-8 w-8" />
          <span className="text-micro text-premium-red/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.CROCODILE}.giveUp`)}
          </span>
        </button>
        <button
          onClick={onGuessed}
          className="rounded-premium-lg bg-premium-green/[0.07] border-premium-green/20 active:bg-premium-green/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-all active:scale-95"
        >
          <CheckCircle className="text-premium-green h-8 w-8" />
          <span className="text-micro text-premium-green/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.CROCODILE}.guessed`)}
          </span>
        </button>
      </div>
    </motion.div>
  );
};
