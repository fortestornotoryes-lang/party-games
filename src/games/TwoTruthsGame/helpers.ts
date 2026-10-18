import { POINTS_FOR_CORRECT_GUESS, POINTS_FOR_FOOLED } from './constants';

/** Все утверждения заполнены и отмечена ложь. */
export const isStatementsReady = (statements: string[], lieIndex: number | null): boolean =>
  lieIndex !== null && statements.every((s) => s.trim().length > 0);

/**
 * Очки за раунд: угадавший ложь получает очко, рассказчик — очко
 * за каждого, кто выбрал правду. Возвращает дельту, не мутирует аргументы.
 */
export const scoreTwoTruthsRound = (
  storyteller: string,
  guesses: Record<string, number>,
  lieIndex: number
): Record<string, number> => {
  const delta: Record<string, number> = {};
  for (const [player, choice] of Object.entries(guesses)) {
    if (choice === lieIndex) {
      delta[player] = (delta[player] ?? 0) + POINTS_FOR_CORRECT_GUESS;
    } else {
      delta[storyteller] = (delta[storyteller] ?? 0) + POINTS_FOR_FOOLED;
    }
  }
  return delta;
};

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
