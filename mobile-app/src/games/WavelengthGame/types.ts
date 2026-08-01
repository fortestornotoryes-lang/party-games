// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const WavelengthPhase = {
  Pass: 'pass',
  Clue: 'clue',
  Guessing: 'guessing',
  Reveal: 'reveal',
} as const;
export type WavelengthPhase = (typeof WavelengthPhase)[keyof typeof WavelengthPhase];
