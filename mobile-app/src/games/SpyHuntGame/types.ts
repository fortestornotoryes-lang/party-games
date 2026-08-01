// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const SpyHuntPhase = {
  Distributing: 'distributing',
  Playing: 'playing',
  Reveal: 'reveal',
} as const;
export type SpyHuntPhase = (typeof SpyHuntPhase)[keyof typeof SpyHuntPhase];
