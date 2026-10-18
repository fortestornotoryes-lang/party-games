export interface LeaderboardWinner {
  /** Игроки, отсортированные по убыванию счёта */
  sorted: string[];
  topScore: number;
  /** true, если у лидера строго больше очков, чем у второго места (нет дележа первого места) */
  hasWinner: boolean;
}

/** Определяет лидера по личному зачёту — сортировка + проверка на ничью за первое место. */
export function getLeaderboardWinner(
  playerNames: string[],
  scores: Record<string, number>
): LeaderboardWinner {
  const sorted = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner = topScore > 0 && topScore > secondScore;
  return { sorted, topScore, hasWinner };
}
