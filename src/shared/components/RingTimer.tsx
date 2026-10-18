import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { rgba } from '@/shared/theme/colors';
import { SPRING } from '@/shared/theme/motion';

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RingTimerProps {
  timeLeft: number;
  total: number;
  /** Последние секунды: кольцо краснеет, цифры «бьются», вокруг пульсирует свечение */
  urgent: boolean;
  /** Цвет кольца в спокойном режиме (CSS-значение, например var(--color-premium-sky)) */
  color: string;
  /** Подпись в центре (по умолчанию — секунды) */
  label?: string;
  /** Размер блока (Tailwind h-/w-) */
  sizeClassName?: string;
  /** Размер цифр */
  textClassName?: string;
}

/** Круговой таймер раунда: плавное кольцо + цифры, перелистывающиеся каждую секунду. */
export const RingTimer: React.FC<RingTimerProps> = ({
  timeLeft,
  total,
  urgent,
  color,
  label,
  sizeClassName = 'h-16 w-16',
  textClassName = 'text-xl',
}) => {
  const progress = total > 0 ? timeLeft / total : 0;

  return (
    <div className={`relative ${sizeClassName}`}>
      <AnimatePresence>
        {urgent ? (
          <motion.div
            key="halo"
            className="absolute -inset-2 rounded-full"
            style={{ boxShadow: `0 0 28px ${rgba('red', 0.55)}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.96, 1.06, 0.96] }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
      </AnimatePresence>

      <svg className="relative h-full w-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          stroke={urgent ? 'var(--color-premium-red)' : color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={timeLeft}
            initial={{ y: 14, opacity: 0, scale: urgent ? 1.35 : 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, transition: { duration: 0.18 } }}
            transition={urgent ? SPRING.pop : SPRING.snappy}
            className={`font-black tabular-nums ${textClassName} ${
              urgent ? 'text-premium-red' : 'text-white'
            }`}
          >
            {label ?? timeLeft}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
