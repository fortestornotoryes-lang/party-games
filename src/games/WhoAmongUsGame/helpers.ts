import { POINTS_FOR_TOP } from './constants';

/** Подсчёт голосов: сколько раз каждый игрок оказался выбран. */
export const tallyVotes = (
  votes: Record<string, string>,
  players: string[]
): Record<string, number> => {
  const counts: Record<string, number> = Object.fromEntries(players.map((p) => [p, 0]));
  for (const target of Object.values(votes)) {
    counts[target] = (counts[target] ?? 0) + 1;
  }
  return counts;
};

/** Игроки с максимальным числом голосов (пусто, если никто не голосовал). */
export const getTopPlayers = (counts: Record<string, number>): string[] => {
  const max = Math.max(0, ...Object.values(counts));
  if (max === 0) return [];
  return Object.keys(counts).filter((p) => counts[p] === max);
};

/** Очки за раунд: по POINTS_FOR_TOP каждому из лидеров. */
export const scoreWhoAmongUsRound = (topPlayers: string[]): Record<string, number> =>
  Object.fromEntries(topPlayers.map((p) => [p, POINTS_FOR_TOP]));

/** Прибавляет дельту очков к общему счёту (новый объект). */
export const addScores = (
  total: Record<string, number>,
  delta: Record<string, number>
): Record<string, number> => {
  const result = { ...total };
  for (const [player, points] of Object.entries(delta)) {
    result[player] = (result[player] ?? 0) + points;
  }
  return result;
};
