import { MAX_TEAMS, MIN_TEAM_SIZE, MIN_TEAMS, REPLACE_PENALTY } from './constants';
import type { Team } from './types';
import { TEAM_COLORS } from './types';

import { shuffle } from '@/shared/helpers/random';
import { splitIntoGroups } from '@/shared/helpers/teams';

/** Максимум команд, при котором в каждой можно набрать MIN_TEAM_SIZE игроков. */
export const getMaxTeams = (playersCount: number): number =>
  Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, Math.floor(playersCount / MIN_TEAM_SIZE)));

/** Случайный состав на `count` команд; цвета берутся по порядку TEAM_COLORS. */
export const buildTeams = (players: string[], count: number): Team[] =>
  splitIntoGroups(shuffle(players), count).map((group, i) => ({
    color: TEAM_COLORS[i],
    players: group,
    score: 0,
    turnsPlayed: 0,
  }));

/** Переносит игрока в следующую по кругу команду (ручная правка состава). */
export const movePlayerToNextTeam = (teams: Team[], player: string): Team[] => {
  const from = teams.findIndex((t) => t.players.includes(player));
  if (from === -1) return teams;
  const to = (from + 1) % teams.length;
  return teams.map((team, i) => {
    if (i === from) return { ...team, players: team.players.filter((p) => p !== player) };
    if (i === to) return { ...team, players: [...team.players, player] };
    return team;
  });
};

/** Объясняющий в текущем раунде команды — игроки идут по очереди. */
export const getExplainer = (team: Team): string =>
  team.players[team.turnsPlayed % team.players.length];

/** Начисляет очки команде `idx` (может быть отрицательным — штраф). */
export const addScore = (teams: Team[], idx: number, delta: number): Team[] =>
  teams.map((t, i) => (i === idx ? { ...t, score: t.score + delta } : t));

/** Штраф за замену слов — отдельная функция, чтобы правило жило в одном месте. */
export const applyReplacePenalty = (teams: Team[], idx: number): Team[] =>
  addScore(teams, idx, -REPLACE_PENALTY);

/** Закрывает раунд команды: начисляет очки (0 при неудаче) и увеличивает счётчик ходов. */
export const finishTurn = (teams: Team[], idx: number, points: number): Team[] =>
  teams.map((t, i) =>
    i === idx ? { ...t, score: t.score + points, turnsPlayed: t.turnsPlayed + 1 } : t
  );

/** Формат таймера m:ss. */
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
