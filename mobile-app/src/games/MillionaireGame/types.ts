// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const MillionairePhase = {
  Pass: 'pass',
  Question: 'question',
  Reveal: 'reveal',
  Between: 'between',
  Win: 'win',
  GameOver: 'game_over',
} as const;
export type MillionairePhase = (typeof MillionairePhase)[keyof typeof MillionairePhase];
