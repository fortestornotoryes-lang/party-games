// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const TabooReversePhase = {
  /** Передай телефон объясняющему */
  Pass: 'pass',
  /** Таймер + слово + обязательные слова */
  Playing: 'playing',
  /** Оценить раунд (классика / команды) */
  Verdict: 'verdict',
  /** Итог хода в режиме Блиц */
  BlitzVerdict: 'blitz_verdict',
  GameOver: 'game_over',
} as const;
export type TabooReversePhase = (typeof TabooReversePhase)[keyof typeof TabooReversePhase];

export interface BlitzResult {
  card: {
    id: number;
    word: string;
    required: string[];
    difficulty: string;
  };
  status: 'guessed' | 'skipped';
}
