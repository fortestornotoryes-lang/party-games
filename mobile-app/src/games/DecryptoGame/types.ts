// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const DecryptoPhase = {
  Setup: 'setup',
  PassCaptain: 'pass_captain',
  CaptainClues: 'captain_clues',
  PassEnemy: 'pass_enemy',
  EnemyIntercept: 'enemy_intercept',
  PassTeam: 'pass_team',
  TeamGuess: 'team_guess',
  Reveal: 'reveal',
  GameOver: 'game_over',
} as const;
export type DecryptoPhase = (typeof DecryptoPhase)[keyof typeof DecryptoPhase];

export type TeamColor = 'red' | 'blue';

export interface RoundData {
  code: number[];
  clues: string[];
  interceptionGuess: number[] | null;
  teamGuess: number[];
}

export interface TeamState {
  words: string[];
  players: string[];
  interceptions: number;
  fails: number;
  history: RoundData[];
  captainIndex: number;
}

/** Эфемерное состояние текущего раунда — всегда читается/сбрасывается целиком (см. startRound). */
export interface RoundState {
  currentCode: number[];
  clues: string[];
  interceptGuess: (number | '')[];
  teamGuess: (number | '')[];
}

export const EMPTY_ROUND: RoundState = {
  currentCode: [],
  clues: ['', '', ''],
  interceptGuess: ['', '', ''],
  teamGuess: ['', '', ''],
};
