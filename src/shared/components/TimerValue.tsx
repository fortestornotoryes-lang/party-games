import type React from 'react';

import { useTimeLeft, type Timer } from '@/shared/hooks/useTimer';

interface TimerValueProps {
  timer: Timer;
  children: (timeLeft: number) => React.ReactNode;
}

/**
 * Изолирует посекундную перерисовку: на тике обновляется только то, что вернул children,
 * а не вся фаза игры.
 *
 * @example
 * <TimerValue timer={timer}>
 *   {(timeLeft) => <RingTimer timeLeft={timeLeft} total={roundTime} ... />}
 * </TimerValue>
 */
export const TimerValue: React.FC<TimerValueProps> = ({ timer, children }) => {
  const timeLeft = useTimeLeft(timer);
  return <>{children(timeLeft)}</>;
};
