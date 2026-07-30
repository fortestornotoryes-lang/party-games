import * as Haptics from 'expo-haptics';

import { storageService } from './storageService';

/**
 * Параметры залпа конфетти. Локальный аналог canvas-confetti.Options из веба —
 * реальный рендер конфетти появится на этапе 2/7 (react-native-confetti-cannon
 * или свой на Reanimated), пресеты и сигнатуры зафиксированы уже сейчас,
 * чтобы callsites в играх переносились без правок.
 */
export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  gravity?: number;
  startVelocity?: number;
  ticks?: number;
  colors?: string[];
}

/**
 * Пресеты конфетти — базовые залпы по смыслу события.
 * Использовать через feedbackService.celebrate(): сервис сам проверяет
 * настройку visualEffects, callsites не меняются при смене реализации.
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
} as const satisfies Record<string, ConfettiOptions>;

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

/** Порог (мс): одиночная вибрация короче — лёгкий тап, длиннее — средний импульс. */
const LIGHT_IMPACT_MAX_MS = 20;

/** Маппинг веб-паттерна вибрации (мс / массив мс) на дискретную хаптику iOS/Android. */
function hapticForPattern(pattern: number | number[]): Promise<void> {
  if (Array.isArray(pattern)) {
    // Многоимпульсные паттерны (win/celebrate/timeout) — системная notification-хаптика
    return pattern.length >= 5
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
  return pattern <= LIGHT_IMPACT_MAX_MS
    ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Feedback Service — хаптика, звук и праздничные эффекты.
 * Публичный API совпадает с веб-версией: при переносе игр callsites не меняются.
 */
export const feedbackService = {
  /**
   * Залп конфетти по пресету; overrides мержатся поверх пресета.
   * Настройка visualEffects проверяется внутри — в callsite'ах guard не нужен.
   * TODO(этап 2/7): рендер конфетти (react-native-confetti-cannon / Reanimated).
   */
  celebrate: (preset: ConfettiPreset, overrides?: ConfettiOptions) => {
    if (!storageService.getSettings().visualEffects) return;
    void preset;
    void overrides;
  },

  /**
   * Фейерверк из боковых пушек в течение durationMs (финал игры).
   * Возвращает функцию отмены — вернуть её из useEffect как cleanup.
   * TODO(этап 2/7): реальная реализация вместе с celebrate.
   */
  fireworks: (colors?: string[], durationMs = 3000): (() => void) => {
    if (!storageService.getSettings().visualEffects) return () => {};
    void colors;
    void durationMs;
    return () => {};
  },

  // Хаптика: сигнатура веб-версии (мс / массив мс), внутри — expo-haptics
  vibrate: (pattern: number | number[] = 10) => {
    if (!storageService.getSettings().vibration) return;
    hapticForPattern(pattern).catch(() => {
      // Хаптика недоступна (симулятор и т.п.) — молча игнорируем
    });
  },

  /**
   * Звуковые эффекты. Синтез Web Audio API в RN не переносится —
   * TODO(этап 7): короткие бандленные сэмплы через expo-audio.
   */
  playSound: (type: 'success' | 'click' | 'error' | 'start' | 'win' | 'timeout') => {
    if (!storageService.getSettings().sounds) return;
    void type;
  },
};
