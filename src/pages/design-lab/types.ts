import type React from 'react';

import type { Difficulty, GameTheme } from '@/shared/types';

/** Вариант слова на экране выбора (как в Крокодиле: сложность → очки и время). */
export interface LabOption {
  word: string;
  difficulty: Difficulty;
  points: number;
  seconds: number;
}

export interface LabTeam {
  color: GameTheme;
  name: string;
  players: string[];
}

export interface PassProps {
  player: string;
  /** Номер игрока (с единицы) и сколько всего — для прогресса раздачи */
  index: number;
  total: number;
  accent: GameTheme;
  onDone: () => void;
}

export interface RevealProps {
  player: string;
  word: string;
  accent: GameTheme;
  onDone: () => void;
}

export interface ChooseProps {
  options: LabOption[];
  accent: GameTheme;
  onPick: (option: LabOption) => void;
  onReplace: () => void;
}

export interface TeamsProps {
  teams: LabTeam[];
  accent: GameTheme;
  teamCounts: number[];
  onTeamsCount: (count: number) => void;
  onMove: (player: string) => void;
  onShuffle: () => void;
  onStart: () => void;
}

/** Одно дизайн-направление: свой вид для каждого общего элемента игры. */
export interface LabVariant {
  id: string;
  title: string;
  summary: string;
  Pass: React.FC<PassProps>;
  Reveal: React.FC<RevealProps>;
  Choose: React.FC<ChooseProps>;
  Teams: React.FC<TeamsProps>;
}
