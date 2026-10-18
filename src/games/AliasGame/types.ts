export const AliasPhase = {
  Setup: 'setup',
  Start: 'start',
  Playing: 'playing',
  RoundEnd: 'round_end',
  GameOver: 'game_over',
} as const;
export type AliasPhase = (typeof AliasPhase)[keyof typeof AliasPhase];

export const TEAM_COLORS = ['red', 'blue', 'green', 'yellow'] as const;
export type TeamColor = (typeof TEAM_COLORS)[number];

export interface Team {
  players: string[];
  score: number;
  color: TeamColor;
  /** Сколько раундов уже сыграла команда — по нему вычисляется объясняющий. */
  turnsPlayed?: number;
}
