// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const TabooPhase = {
  /** Передай телефон объясняющему */
  Pass: 'pass',
  /** Таймер + слово + запрещённые слова */
  Playing: 'playing',
  /** Кто угадал? Было ли запрещённое слово? */
  Verdict: 'verdict',
  GameOver: 'game_over',
} as const;
export type TabooPhase = (typeof TabooPhase)[keyof typeof TabooPhase];
