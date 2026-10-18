import { POINTS_FOR_CORRECT_GUESS, POINTS_FOR_FOOLED, REVEAL_TIMING } from './constants';

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

/**
 * Задержки переворота карточек при раскрытии (с), по индексу утверждения:
 * правды открываются по очереди, ложь — последней, после паузы.
 */
export const getRevealDelays = (count: number, lieIndex: number): number[] => {
  const { start, truthStep, liePause } = REVEAL_TIMING;
  const lastTruthDelay = start + Math.max(0, count - 2) * truthStep;
  let truthOrder = 0;
  return Array.from({ length: count }, (_, i) => {
    if (i === lieIndex) return lastTruthDelay + liePause;
    return start + truthOrder++ * truthStep;
  });
};
