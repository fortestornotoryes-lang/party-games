import { useEffect } from 'react';

import { useTimer, type Timer } from './useTimer';

/**
 * Отсчёт, который идёт, пока `active` (фаза хода и т.п.). Время задаётся через
 * `timer.setTimeLeft(n)`; при достижении нуля вызывается onExpire.
 * Секунды читать через `useTimeLeft` / `<TimerValue>` — см. useTimer.
 */
export function useCountdown(active: boolean, initial = 0, onExpire?: () => void): Timer {
  const timer = useTimer({ initialTime: initial, onTimeUp: onExpire });

  useEffect(() => {
    if (active) timer.start();
    else timer.pause();
  }, [active, timer]);

  return timer;
}
