import { MAX_TEAMS, MIN_TEAM_SIZE, MIN_TEAMS } from './constants';
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
  team.players[(team.turnsPlayed ?? 0) % team.players.length];
