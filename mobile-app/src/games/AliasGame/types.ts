// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const AliasPhase = {
  Start: 'start',
  Playing: 'playing',
  RoundEnd: 'round_end',
  GameOver: 'game_over',
} as const;
export type AliasPhase = (typeof AliasPhase)[keyof typeof AliasPhase];

export interface Team {
  players: string[];
  score: number;
  color: 'red' | 'blue';
}
