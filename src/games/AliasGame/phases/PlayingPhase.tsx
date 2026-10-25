import { CheckCircle, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import type { SwipeDirection } from '../components/SwipeWordCard';
import { SwipeWordCard } from '../components/SwipeWordCard';
import { URGENT_SECONDS } from '../constants';

import { RingTimer } from '@/shared/components/RingTimer';
import { TimerValue } from '@/shared/components/TimerValue';
import { UrgencyVignette } from '@/shared/components/UrgencyVignette';
import { useTimerSelect, type Timer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING } from '@/shared/theme/motion';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

/** Разброс всплывающих «+1/−1» по горизонтали, px */
const POP_SPREAD = 40;

/** Всплывающее «+1 / −1» над счётом */
interface ScorePop {
  id: number;
  delta: 1 | -1;
  offsetX: number;
}

interface PlayingPhaseProps {
  currentWord: string;
  roundScore: number;
  timer: Timer;
  roundTime: number;
  onCorrect: () => void;
  onSkip: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  currentWord,
  roundScore,
  timer,
  roundTime,
  onCorrect,
  onSkip,
}) => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<SwipeDirection>(0);
  // Номер карточки — ключ для AnimatePresence: слово может повториться после сброса пула
  const [cardNo, setCardNo] = useState(0);
  const [pops, setPops] = useState<ScorePop[]>([]);
  const popId = useRef(0);
  // Фаза перерисовывается только при входе в «срочно», а не каждую секунду
  const urgent = useTimerSelect(timer, (t) => t <= URGENT_SECONDS);

  const answer = (dir: 1 | -1) => {
    setDirection(dir);
    setCardNo((n) => n + 1);
    popId.current += 1;
    setPops((prev) => [
      ...prev,
      { id: popId.current, delta: dir, offsetX: (Math.random() - 0.5) * POP_SPREAD },
    ]);
    if (dir === 1) onCorrect();
    else onSkip();
  };

  // Стабильный обработчик свайпа для memo-карточки: answer пересоздаётся каждый рендер
  const answerRef = useRef(answer);
  useLayoutEffect(() => {
    answerRef.current = answer;
  });
  const handleSwipe = useCallback((dir: 1 | -1) => {
    answerRef.current(dir);
  }, []);

  const removePop = (id: number) => {
    setPops((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      key="playing"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex h-full flex-col overflow-hidden"
    >
      <UrgencyVignette active={urgent} />

      {/* Вспышка цвета ответа */}
      {cardNo > 0 && (
        <motion.div
          key={cardNo}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(ellipse at ${direction === 1 ? '100%' : '0%'} 50%, ${rgba(
              direction === 1 ? 'green' : 'red',
              0.22
            )} 0%, transparent 65%)`,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}

      <div className="relative z-10 flex justify-center pt-5 pb-1">
        <TimerValue timer={timer}>
          {(timeLeft) => (
            <RingTimer
              timeLeft={timeLeft}
              total={roundTime}
              urgent={urgent}
              color="var(--color-premium-sky)"
            />
          )}
        </TimerValue>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <div className="grid w-full max-w-sm items-center justify-items-center">
          {/* Колода позади текущей карточки */}
          <div
            aria-hidden
            className="rounded-premium-2xl h-full w-full translate-y-3 scale-[0.92] -rotate-3 self-stretch border border-white/5 bg-white/[0.02] [grid-area:1/1]"
          />
          <div
            aria-hidden
            className="rounded-premium-2xl h-full w-full translate-y-1.5 scale-[0.96] rotate-2 self-stretch border border-white/5 bg-white/[0.03] [grid-area:1/1]"
          />
          <AnimatePresence custom={direction}>
            <SwipeWordCard
              key={cardNo}
              word={currentWord}
              label={t(`${NS.ALIAS}.explainWord`)}
              correctLabel={t(`${NS.ALIAS}.guessed`)}
              skipLabel={t(`${NS.COMMON}.skip`)}
              onSwipe={handleSwipe}
            />
          </AnimatePresence>
        </div>
        <p className="text-micro font-black tracking-[0.3em] text-white/20 uppercase">
          {t(`${NS.ALIAS}.swipeHint`)}
        </p>
      </div>

      <div className="relative z-10 flex items-baseline justify-center gap-2 pb-3">
        <span className="text-micro font-black tracking-[0.3em] text-white/20 uppercase">
          {t(`${NS.ALIAS}.scoreLabel`)}
        </span>
        <span className="relative inline-flex">
          <motion.span
            key={roundScore}
            initial={{ scale: cardNo > 0 ? 1.7 : 1 }}
            animate={{ scale: 1 }}
            transition={SPRING.pop}
            className={`inline-block text-2xl font-black italic tabular-nums ${
              roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
            }`}
          >
            {fmtScore(roundScore)}
          </motion.span>
          {pops.map((pop) => (
            <motion.span
              key={pop.id}
              aria-hidden
              className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 text-xl font-black italic ${
                pop.delta > 0 ? 'text-premium-green' : 'text-premium-red'
              }`}
              initial={{ opacity: 0, y: 8, x: pop.offsetX, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -56, scale: 1.25 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              onAnimationComplete={() => {
                removePop(pop.id);
              }}
            >
              {pop.delta > 0 ? '+1' : '−1'}
            </motion.span>
          ))}
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 px-5 pb-8">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={SPRING.pop}
          onClick={() => {
            answer(-1);
          }}
          className="rounded-premium-lg bg-premium-red/[0.07] border-premium-red/20 active:bg-premium-red/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-colors"
        >
          <XCircle className="text-premium-red h-8 w-8" />
          <span className="text-micro text-premium-red/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.COMMON}.skip`)}
          </span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={SPRING.pop}
          onClick={() => {
            answer(1);
          }}
          className="rounded-premium-lg bg-premium-green/[0.07] border-premium-green/20 active:bg-premium-green/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-colors"
        >
          <CheckCircle className="text-premium-green h-8 w-8" />
          <span className="text-micro text-premium-green/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.ALIAS}.guessed`)}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
