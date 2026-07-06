import confetti from 'canvas-confetti';

import { storageService } from './storageService';

/**
 * Пресеты конфетти — базовые залпы по смыслу события.
 * Использовать через feedbackService.celebrate(), не импортировать canvas-confetti напрямую:
 * сервис сам проверяет настройку visualEffects, а при порте на другую платформу
 * меняется только этот файл.
 */
export const CONFETTI = {
  /** Победа / конец игры — большой залп из центра */
  win: { particleCount: 200, spread: 80, origin: { y: 0.5 } },
  /** Успех в раунде — залп снизу по центру */
  success: { particleCount: 150, spread: 70, origin: { y: 0.6 } },
  /** Небольшой залп — очко, мелкое достижение */
  small: { particleCount: 80, spread: 60, origin: { y: 0.6 } },
  /** Залп по центру игровой доски */
  board: { particleCount: 130, spread: 75, origin: { y: 0.45 } },
  /** Залп сверху — призовая лестница и т.п. */
  top: { particleCount: 70, spread: 60, origin: { y: 0.25 }, gravity: 1.1 },
} as const satisfies Record<string, confetti.Options>;

export type ConfettiPreset = keyof typeof CONFETTI;

/**
 * Стандартные вибропаттерны для единообразного UX.
 * Использовать вместо магических чисел в callsite'ах.
 */
export const VIBRATE = {
  /** Правильный ответ / угадано */
  correct: [50, 30, 50] as number[],
  /** Неправильный ответ / ошибка */
  error: 100,
  /** Победа / конец игры */
  win: [100, 50, 100] as number[],
  /** Таймер истёк */
  timeout: [80, 40, 80] as number[],
  /** Лёгкий тап / клик */
  tap: 10,
  /** Двойной импульс — конец раунда / переход */
  celebrate: [50, 30, 50, 30, 50] as number[],
} as const;

// Singleton AudioContext — браузер ограничивает их количество (~6 на страницу).
// Переиспользуем один на всё время жизни приложения.
let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (_audioCtx && _audioCtx.state !== 'closed') return _audioCtx;
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  _audioCtx = new Ctor();
  return _audioCtx;
}

/**
 * Feedback Service for Haptics and Sound Effects
 */
export const feedbackService = {
  /**
   * Залп конфетти по пресету; overrides мержатся поверх пресета.
   * Настройка visualEffects проверяется внутри — в callsite'ах guard не нужен.
   */
  celebrate: (preset: ConfettiPreset, overrides?: confetti.Options) => {
    if (!storageService.getSettings().visualEffects) return;
    try {
      void confetti({ ...CONFETTI[preset], ...overrides });
    } catch (e) {
      // Ignore confetti errors
    }
  },

  /**
   * Фейерверк из боковых пушек в течение durationMs (финал игры).
   * Возвращает функцию отмены — вернуть её из useEffect как cleanup.
   */
  fireworks: (colors?: string[], durationMs = 3000): (() => void) => {
    if (!storageService.getSettings().visualEffects) return () => {};

    const animationEnd = Date.now() + durationMs;
    const defaults: confetti.Options = { startVelocity: 30, spread: 360, ticks: 60, colors };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 50 * (timeLeft / durationMs);
      try {
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      } catch (e) {
        // Ignore confetti errors
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  },

  // Haptic Feedback (Vibration)
  vibrate: (pattern: number | number[] = 10) => {
    void storageService.getSettingsAsync().then(({ vibration }) => {
      if (vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(pattern);
        } catch (e) {
          // Ignore vibration errors
        }
      }
    });
  },

  // Sound Effects using Web Audio API
  playSound: (type: 'success' | 'click' | 'error' | 'start' | 'win' | 'timeout') => {
    void storageService.getSettingsAsync().then(({ sounds }) => {
      if (!sounds) return;

      try {
        const ctx = getAudioCtx();
        if (!ctx) return;

        // Browsers suspend AudioContext until a user gesture; resume silently.
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
          case 'success':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
          case 'click':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
          case 'error':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
          case 'start':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(261.63, now); // C4
            osc.frequency.setValueAtTime(329.63, now + 0.1); // E4
            osc.frequency.setValueAtTime(392.0, now + 0.2); // G4
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
          case 'win':
            // Восходящий аккорд — C4 → E4 → G4 → C5
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(261.63, now);
            osc.frequency.setValueAtTime(329.63, now + 0.12);
            osc.frequency.setValueAtTime(392.0, now + 0.24);
            osc.frequency.setValueAtTime(523.25, now + 0.36);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
            osc.start(now);
            osc.stop(now + 0.7);
            break;
          case 'timeout':
            // Нисходящий сигнал — тревога
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(220, now + 0.4);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;
        }
      } catch (e) {
        // Ignore audio errors
      }
    });
  },
};
