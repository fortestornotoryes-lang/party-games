import type { Difficulty } from '@/shared/types';

export const CrocodilePhase = {
  Setup: 'setup',
  Start: 'start',
  ChooseWord: 'choose_word',
  Playing: 'playing',
  RoundEnd: 'round_end',
  GameOver: 'game_over',
} as const;
export type CrocodilePhase = (typeof CrocodilePhase)[keyof typeof CrocodilePhase];

export const TEAM_COLORS = ['red', 'blue', 'green', 'yellow'] as const;
export type TeamColor = (typeof TEAM_COLORS)[number];

export interface Team {
  players: string[];
  score: number;
  color: TeamColor;
  /** Сколько раундов уже сыграла команда — по нему вычисляется объясняющий. */
  turnsPlayed: number;
}

/** Слово, предложенное объясняющему: сложность определяет награду и время. */
export interface WordOption {
  word: string;
  difficulty: Difficulty;
}
