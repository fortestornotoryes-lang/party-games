// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const CodenamesPhase = {
  Setup: 'setup',
  PassCaptain: 'pass_captain',
  Captain: 'captain',
  PassTeam: 'pass_team',
  Team: 'team',
  GameOver: 'game_over',
} as const;
export type CodenamesPhase = (typeof CodenamesPhase)[keyof typeof CodenamesPhase];

export type Team = 'red' | 'blue';
export type CardColor = Team | 'neutral' | 'assassin' | 'double_agent';

export interface Card {
  id: number;
  word: string;
  color: CardColor;
  revealed: boolean;
}

/** Состав команд — назначается один раз при старте партии, все 4 поля всегда вместе. */
export interface Roster {
  redCaptain: string;
  blueCaptain: string;
  redTeam: string[];
  blueTeam: string[];
}

export const EMPTY_ROSTER: Roster = { redCaptain: '', blueCaptain: '', redTeam: [], blueTeam: [] };

/** Активная подсказка капитана — сбрасывается целиком в конце хода (см. endTurn). */
export interface ClueState {
  clueWord: string;
  clueCount: number;
}

export const EMPTY_CLUE: ClueState = { clueWord: '', clueCount: 0 };
