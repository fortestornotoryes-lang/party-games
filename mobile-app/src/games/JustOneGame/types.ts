// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const JustOnePhase = {
  Pass: 'pass',
  Hinting: 'hinting',
  Guessing: 'guessing',
  Result: 'result',
} as const;
export type JustOnePhase = (typeof JustOnePhase)[keyof typeof JustOnePhase];
