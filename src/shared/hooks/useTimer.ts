import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';

type Listener = (timeLeft: number) => void;

/**
 * Обратный отсчёт по секундам, живущий вне React-состояния.
 *
 * Зачем: раньше timeLeft лежал в state корня игры, и каждый тик перерисовывал всю игру —
 * шапку, карточку слова, кнопки, списки. Теперь корень держит стабильный объект таймера,
 * а секунды читают только те компоненты, которые их показывают: `useTimeLeft`,
 * `useTimerSelect` (перерисовка только при смене производного значения, например «срочно»)
 * или `<TimerValue>` (render-prop). Побочные эффекты тиков (звук) — через `subscribe`.
 */
export interface Timer {
  start: () => void;
  pause: () => void;
  /** Остановить и выставить время (по умолчанию — initialTime) */
  reset: (newTime?: number) => void;
  setTimeLeft: (seconds: number) => void;
  getTimeLeft: () => number;
  isActive: () => boolean;
  /** Слушатель вызывается при каждом изменении времени; возвращает отписку */
  subscribe: (listener: Listener) => () => void;
}

interface TimerInternals extends Timer {
  /** Остановить интервал, сохранив признак «идёт» (размонтирование / StrictMode) */
  suspend: () => void;
  /** Вернуть интервал, если таймер был запущен */
  resume: () => void;
  /** Обновить initialTime/onTimeUp без пересоздания таймера */
  setOptions: (opts: TimerOptions) => void;
}

interface TimerOptions {
  initialTime: number;
  onTimeUp?: () => void;
}

function createTimer(initial: TimerOptions, autoStart: boolean): TimerInternals {
  let opts = initial;
  let timeLeft = initial.initialTime;
  let active = autoStart;
  let interval: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<Listener>();

  const emit = () => {
    for (const l of listeners) l(timeLeft);
  };
  const stopInterval = () => {
    if (interval) clearInterval(interval);
    interval = null;
  };
  const tick = () => {
    if (timeLeft <= 1) {
      timeLeft = 0;
      active = false;
      stopInterval();
      emit();
      opts.onTimeUp?.();
      return;
    }
    timeLeft -= 1;
    emit();
  };
  const startInterval = () => {
    if (interval || !active || timeLeft <= 0) return;
    interval = setInterval(tick, 1000);
  };

  return {
    start: () => {
      active = true;
      startInterval();
    },
    pause: () => {
      active = false;
      stopInterval();
    },
    reset: (newTime) => {
      active = false;
      stopInterval();
      timeLeft = newTime ?? opts.initialTime;
      emit();
    },
    setTimeLeft: (seconds) => {
      timeLeft = seconds;
      emit();
      if (timeLeft <= 0) stopInterval();
      else startInterval();
    },
    getTimeLeft: () => timeLeft,
    isActive: () => active,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    suspend: stopInterval,
    resume: startInterval,
    setOptions: (next) => {
      opts = next;
    },
  };
}

export function useTimer({
  initialTime,
  onTimeUp,
  autoStart = false,
}: TimerOptions & { autoStart?: boolean }): Timer {
  const [timer] = useState(() => createTimer({ initialTime, onTimeUp }, autoStart));

  // Свежие initialTime/onTimeUp без пересоздания таймера
  useLayoutEffect(() => {
    timer.setOptions({ initialTime, onTimeUp });
  });

  useEffect(() => {
    timer.resume();
    return timer.suspend;
  }, [timer]);

  return timer;
}

/** Текущее время таймера; компонент перерисовывается каждую секунду. */
export function useTimeLeft(timer: Timer): number {
  return useSyncExternalStore(timer.subscribe, timer.getTimeLeft);
}

/**
 * Производное от времени значение (например `t => t <= URGENT_SECONDS`): компонент
 * перерисовывается только когда оно меняется, а не каждую секунду. select должен
 * возвращать примитив.
 */
export function useTimerSelect<T>(timer: Timer, select: (timeLeft: number) => T): T {
  return useSyncExternalStore(timer.subscribe, () => select(timer.getTimeLeft()));
}
