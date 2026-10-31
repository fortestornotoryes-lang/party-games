import { Play, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { URGENT_SECONDS } from '../constants';
import type { CardTimerStatus } from '../types';
import { CARD_TIMER_STATUS } from '../types';

import { RingTimer } from '@/shared/components/RingTimer';
import { TimerValue } from '@/shared/components/TimerValue';
import type { Timer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import type { GameTheme } from '@/shared/types';

interface CardTimerProps {
  timer: Timer;
  total: number;
  status: CardTimerStatus;
  accent: GameTheme;
  onStart: () => void;
}

/**
 * Таймер карточки с `{t:N}`: до старта — кнопка, во время — кольцо,
 * по окончании — «Время!» с возможностью перезапуска.
 */
export const CardTimer: React.FC<CardTimerProps> = ({ timer, total, status, accent, onStart }) => {
  const { t } = useTranslation();

  if (status === CARD_TIMER_STATUS.IDLE) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="text-tag flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-black tracking-[0.3em] text-white/80 uppercase"
      >
        <Play className="h-4 w-4" />
        {t(`${NS.TRUTH_OR_DARE}.startTimer`)} · {t(`${NS.TRUTH_OR_DARE}.seconds`, { n: total })}
      </motion.button>
    );
  }

  const done = status === CARD_TIMER_STATUS.DONE;

  return (
    <button
      onClick={done ? onStart : undefined}
      disabled={!done}
      className="flex flex-col items-center gap-1.5"
      aria-label={done ? t(`${NS.TRUTH_OR_DARE}.startTimer`) : undefined}
    >
      <TimerValue timer={timer}>
        {(timeLeft) => (
          <RingTimer
            timeLeft={timeLeft}
            total={total}
            urgent={!done && timeLeft <= URGENT_SECONDS}
            color={`var(--color-premium-${accent})`}
            label={done ? '0' : undefined}
          />
        )}
      </TimerValue>
      {done && (
        <span className="text-tag text-premium-red flex items-center gap-1.5 font-black tracking-[0.3em] uppercase">
          {t(`${NS.TRUTH_OR_DARE}.timeUp`)}
          <RotateCcw className="h-3.5 w-3.5 opacity-60" />
        </span>
      )}
    </button>
  );
};
