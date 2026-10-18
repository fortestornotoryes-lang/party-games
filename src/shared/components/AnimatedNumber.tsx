import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import React, { useEffect } from 'react';

import { EASE_OUT_EXPO } from '@/shared/theme/motion';

interface AnimatedNumberProps {
  value: number;
  /** С какого числа начать отсчёт при монтировании (по умолчанию — сразу value) */
  from?: number;
  /** Длительность прокрутки, с */
  duration?: number;
  /** Задержка старта, с */
  delay?: number;
  format?: (n: number) => string;
  className?: string;
}

/** Число, которое «прокручивается» к новому значению (счёт, очки, голоса). */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  from,
  duration = 0.8,
  delay = 0,
  format = String,
  className,
}) => {
  const motionValue = useMotionValue(from ?? value);
  const text = useTransform(motionValue, (v) => format(Math.round(v)));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, delay, ease: EASE_OUT_EXPO });
    return () => {
      controls.stop();
    };
  }, [motionValue, value, duration, delay]);

  return <motion.span className={`tabular-nums ${className ?? ''}`}>{text}</motion.span>;
};
