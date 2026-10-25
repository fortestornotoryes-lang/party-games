import type { LabOption, LabTeam } from './types';

import type { Difficulty, GameTheme } from '@/shared/types';

// Длинное имя и длинное слово — специально: проверяем вёрстку на 360 px (см. gotchas.md)
export const LAB_PLAYERS = ['Маша', 'Артём', 'Константинопольский', 'Лиза', 'Вова', 'Ника'];

export const LAB_WORDS = ['Бутерброд', 'Достопримечательность', 'Кот', 'Северное сияние'];

const LEVELS: Record<Difficulty, { points: number; seconds: number }> = {
  easy: { points: 1, seconds: 60 },
  medium: { points: 2, seconds: 90 },
  hard: { points: 3, seconds: 120 },
};

const option = (word: string, difficulty: Difficulty): LabOption => ({
  word,
  difficulty,
  ...LEVELS[difficulty],
});

export const LAB_OPTION_SETS: LabOption[][] = [
  [option('Кот', 'easy'), option('Самолёт', 'medium'), option('Невесомость', 'hard')],
  [option('Зонт', 'easy'), option('Пылесос', 'medium'), option('Достопримечательность', 'hard')],
  [option('Мяч', 'easy'), option('Светофор', 'medium'), option('Дежавю', 'hard')],
];

const TEAM_PRESETS: { color: GameTheme; name: string }[] = [
  { color: 'red', name: 'Красные' },
  { color: 'sky', name: 'Синие' },
  { color: 'yellow', name: 'Жёлтые' },
];

export const LAB_TEAM_COUNTS = [2, 3];

export const LAB_ACCENTS: GameTheme[] = ['purple', 'red', 'green', 'sky', 'orange'];

/** Раскладывает игроков по командам по кругу (порядок — как в списке). */
export const dealTeams = (players: string[], count: number): LabTeam[] =>
  TEAM_PRESETS.slice(0, count).map((preset, t) => ({
    ...preset,
    players: players.filter((_, i) => i % count === t),
  }));

export const shuffled = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Игрок переходит в следующую по кругу команду. */
export const moveToNextTeam = (teams: LabTeam[], player: string): LabTeam[] => {
  const from = teams.findIndex((team) => team.players.includes(player));
  if (from < 0) return teams;
  const to = (from + 1) % teams.length;
  return teams.map((team, i) => {
    if (i === from) return { ...team, players: team.players.filter((p) => p !== player) };
    if (i === to) return { ...team, players: [...team.players, player] };
    return team;
  });
};

export const formatSeconds = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/** «1 очко», «2 очка», «5 очков» */
export const pointsLabel = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} очко`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} очка`;
  return `${n} очков`;
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Лёгкое',
  medium: 'Среднее',
  hard: 'Сложное',
};

export const DIFFICULTY_COLOR: Record<Difficulty, GameTheme> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
};

/** Пауза между выбором слова и переходом дальше — успевает сыграть анимация выбора, мс */
export const PICK_DELAY_MS = 420;

/** Стабильный «случайный» наклон стикера/карты по имени, градусы */
export const tiltOf = (name: string, max: number): number => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 100) / 100) * max * 2 - max;
};
